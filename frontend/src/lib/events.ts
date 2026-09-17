export type EventHandler<T = unknown> = (payload: T) => void;

export interface EventMap {
  [key: string]: unknown;
}

export type Unsubscribe = () => void;

export interface EventBus<E extends EventMap = Record<string, unknown>> {
  on<K extends keyof E>(event: K, handler: EventHandler<E[K]>): Unsubscribe;
  off<K extends keyof E>(event: K, handler: EventHandler<E[K]>): void;
  emit<K extends keyof E>(event: K, payload: E[K]): void;
  once<K extends keyof E>(event: K, handler: EventHandler<E[K]>): void;
}

export interface DashboardEventMap extends EventMap {
  'dashboard:update': { source: 'poll' | 'socket' | 'manual'; ts: number };
  'dashboard:refresh': void;
  'ai:stream-start': { id: string; model?: string };
  'ai:stream-chunk': { id: string; text: string };
  'ai:stream-end': { id: string; text: string };
  'ai:stream-error': { id: string; error: string };
  'offline:write': { endpoint: string; method: string; body: unknown };
  'online:state': { online: boolean };
  'search:focus': void;
  'command:focus': void;
  'shortcuts:toggle': void;
}

export function createEventBus<E extends EventMap = Record<string, unknown>>(): EventBus<E> {
  const listeners = new Map<string, Set<EventHandler<any>>>();

  const on = <K extends keyof E>(event: K, handler: EventHandler<E[K]>): Unsubscribe => {
    const eventKey = event as string;
    let set = listeners.get(eventKey);
    if (!set) {
      set = new Set();
      listeners.set(eventKey, set);
    }
    set.add(handler);
    return () => {
      listeners.get(eventKey)?.delete(handler);
    };
  };

  const off = <K extends keyof E>(event: K, handler: EventHandler<E[K]>): void => {
    listeners.get(event as string)?.delete(handler);
  };

  const emit = <K extends keyof E>(event: K, payload: E[K]): void => {
    listeners.get(event as string)?.forEach((handler) => handler(payload));
  };

  const once = <K extends keyof E>(event: K, handler: EventHandler<E[K]>): void => {
    const wrapped: EventHandler<E[K]> = (payload) => {
      handler(payload);
      off(event, wrapped);
    };
    on(event, wrapped);
  };

  return { on, off, emit, once };
}

export type AppEventBus = EventBus<DashboardEventMap>;
