import type { DashboardEventMap } from '../lib/events';

export interface AIStreamMessage {
  type: 'chunk' | 'end' | 'error' | 'start';
  id?: string;
  text?: string;
  error?: string;
  model?: string;
}

export interface StreamOptions {
  wsUrl?: string;
  timeoutMs?: number;
  onEvent?: <K extends keyof DashboardEventMap>(event: K, payload: DashboardEventMap[K]) => void;
}

export interface AIStreamContext {
  eventBus?: { emit: (e: string, p: unknown) => void };
}

const STREAM_CLOSED = '__STREAM_CLOSED__';

export class AsyncQueue<T> {
  private items: T[] = [];
  private waits: Array<(v: T) => void> = [];
  private closed = false;

  enqueue(item: T): void {
    if (this.closed) return;
    if (this.waits.length) {
      const resolve = this.waits.shift()!;
      resolve(item);
    } else {
      this.items.push(item);
    }
  }

  async dequeue(): Promise<T> {
    if (this.items.length) return this.items.shift()!;
    if (this.closed) return STREAM_CLOSED as T;
    return new Promise((resolve) => this.waits.push(resolve));
  }

  close(): void {
    this.closed = true;
    while (this.waits.length) {
      const resolve = this.waits.shift()!;
      resolve(STREAM_CLOSED as T);
    }
  }

  get isClosed(): boolean {
    return this.closed;
  }
}

export class ProgressiveTextBuilder {
  private text = '';
  constructor(private onAppend: (text: string) => void) {}

  append(chunk: string): void {
    if (!chunk) return;
    this.text += chunk;
    this.onAppend(this.text);
  }

  get value(): string {
    return this.text;
  }

  reset(): void {
    this.text = '';
  }
}

export function parseSSEResponse(line: string): AIStreamMessage | null {
  if (!line.trim()) return null;
  if (line.startsWith(':')) return null;
  if (line.startsWith('data:')) {
    const data = line.slice(5).trim();
    try {
      return JSON.parse(data) as AIStreamMessage;
    } catch {
      return { type: 'chunk', text: data };
    }
  }
  return null;
}

export function combineChunks(chunks: string[]): string {
  return chunks.filter(Boolean).join('');
}

export async function* streamFromResponseStream(
  response: Response,
): AsyncGenerator<AIStreamMessage, void, unknown> {
  if (!response.body) {
    yield { type: 'error', error: 'No response body' };
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      for (const line of text.split('\n')) {
        const msg = parseSSEResponse(line);
        if (msg) yield msg;
      }
    }
    yield { type: 'end' };
  } catch (err) {
    yield { type: 'error', error: (err as Error).message };
  } finally {
    reader.releaseLock?.();
  }
}

export interface WebSocketLike {
  readyState: number;
  onmessage: ((ev: { data: string }) => void) | null;
  onopen: (() => void) | null;
  onclose: (() => void) | null;
  onerror: ((e: unknown) => void) | null;
  send(data: string): void;
  close(): void;
}

export const WS_CONNECTING = 0;
export const WS_OPEN = 1;

export function tryWebSocket(url: string, timeoutMs: number): Promise<WebSocketLike | null> {
  if (typeof WebSocket === 'undefined') return Promise.resolve(null);
  return new Promise<WebSocketLike | null>((resolve) => {
    let resolved = false;
    const timer = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      try {
        socket.onclose = null;
        socket.onerror = null;
        socket.close();
      } catch {}
      resolve(null);
    }, timeoutMs);

    let socket: WebSocket;
    try {
      socket = new WebSocket(url);
    } catch {
      clearTimeout(timer);
      resolve(null);
      return;
    }

    socket.onopen = () => {
      if (resolved) {
        socket.close();
        return;
      }
      resolved = true;
      clearTimeout(timer);
      resolve(socket as unknown as WebSocketLike);
    };
    socket.onerror = () => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      resolve(null);
    };
  });
}

export async function* streamAIContent(
  payload: { prompt: string; history?: Array<{ role: string; parts: { text: string }[] }> },
  opts: StreamOptions = {},
  ctx: AIStreamContext = {},
): AsyncGenerator<AIStreamMessage, void, unknown> {
  const timeoutMs = opts.timeoutMs ?? 1200;
  const builder = new ProgressiveTextBuilder((t) => {
    ctx.eventBus?.emit('ai:stream-chunk', { id: payload.prompt, text: t } as DashboardEventMap['ai:stream-chunk']);
  });
  ctx.eventBus?.emit('ai:stream-start', { id: payload.prompt } as DashboardEventMap['ai:stream-start']);
  yield { type: 'start', id: payload.prompt };

  const ws = opts.wsUrl ? await tryWebSocket(opts.wsUrl, timeoutMs) : null;
  if (ws) {
    builder.reset();
    const queue = new AsyncQueue<string>();
    ws.onmessage = (ev) => queue.enqueue(ev.data);
    ws.onerror = () => queue.close();
    ws.onclose = () => queue.close();
    ws.send(JSON.stringify({ type: 'start', payload }));
    while (!queue.isClosed) {
      const data = await queue.dequeue();
      if (data === STREAM_CLOSED) break;
      try {
        const parsed = JSON.parse(data) as AIStreamMessage;
        if (parsed.type === 'end') break;
        if (parsed.type === 'error') {
          yield { type: 'error', error: parsed.error };
          break;
        }
        if (parsed.type === 'chunk' && parsed.text) {
          builder.append(parsed.text);
          yield { type: 'chunk', text: parsed.text };
        } else {
          builder.append(data);
          yield { type: 'chunk', text: data };
        }
      } catch {
        builder.append(data);
        yield { type: 'chunk', text: data };
      }
    }
    ws.close();
    yield { type: 'end' };
    return;
  }

  yield* fallbackFetchStream(payload, ctx, builder);
  yield { type: 'end' };
}

async function* fallbackFetchStream(
  payload: { prompt: string; history?: Array<{ role: string; parts: { text: string }[] }> },
  ctx: AIStreamContext,
  builder: ProgressiveTextBuilder,
): AsyncGenerator<AIStreamMessage, void, unknown> {
  if (typeof fetch === 'undefined') {
    yield { type: 'error', error: 'Streaming unavailable in this environment' };
    return;
  }
  try {
    const res = await fetch('/api/ai/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      yield { type: 'error', error: `HTTP ${res.status}` };
      return;
    }
    for await (const msg of streamFromResponseStream(res)) {
      if (msg.type === 'chunk' && msg.text) builder.append(msg.text);
      ctx.eventBus?.emit('ai:stream-chunk', msg as DashboardEventMap['ai:stream-chunk']);
      yield msg;
    }
  } catch (err) {
    yield { type: 'error', error: (err as Error).message };
  }
}
