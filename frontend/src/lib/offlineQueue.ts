export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface QueueItem {
  id: string;
  endpoint: string;
  method: HttpMethod;
  body: unknown;
  headers?: Record<string, string>;
  createdAt: number;
  attempt: number;
  idemKey: string;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface OfflineQueueOptions {
  maxRetries?: number;
  maxAgeMs?: number;
}

const DEFAULT_STORAGE_KEY = 'tracker-offline-queue';
const DEFAULT_MAX_RETRIES = 5;
const DEFAULT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function safeParse(value: string | null): QueueItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as QueueItem[]) : [];
  } catch {
    return [];
  }
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '[]';
  }
}

export class OfflineQueue {
  private storage: StorageLike;
  private storageKey: string;
  private maxRetries: number;
  private maxAgeMs: number;

  constructor(storage: StorageLike = (typeof localStorage !== 'undefined' ? localStorage : new MemoryStorage()), options?: OfflineQueueOptions) {
    this.storage = storage;
    this.storageKey = DEFAULT_STORAGE_KEY;
    this.maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.maxAgeMs = options?.maxAgeMs ?? DEFAULT_MAX_AGE_MS;
  }

  enqueue(item: Omit<QueueItem, 'id' | 'createdAt' | 'attempt' | 'idemKey'>): string {
    const now = Date.now();
    const full: QueueItem = {
      id: generateId(),
      createdAt: now,
      attempt: 0,
      idemKey: `${item.method}:${item.endpoint}:${now}`,
      ...item,
    };
    const all = this.all();
    all.push(full);
    this.persist(all);
    return full.id;
  }

  all(): QueueItem[] {
    return safeParse(this.storage.getItem(this.storageKey));
  }

  pending(limit = 50): QueueItem[] {
    const now = Date.now();
    return this.all()
      .filter((it) => it.attempt < this.maxRetries && now - it.createdAt < this.maxAgeMs)
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, limit);
  }

  hasPending(): boolean {
    return this.pending().length > 0;
  }

  remove(id: string): boolean {
    const all = this.all().filter((it) => it.id !== id);
    this.persist(all);
    return true;
  }

  incrementAttempt(id: string): void {
    const all = this.all().map((it) => (it.id === id ? { ...it, attempt: it.attempt + 1 } : it));
    this.persist(all);
  }

  clear(): void {
    this.storage.removeItem(this.storageKey);
  }

  count(): number {
    return this.all().length;
  }

  private persist(items: QueueItem[]): void {
    this.storage.setItem(this.storageKey, safeStringify(items));
  }
}

export class MemoryStorage implements StorageLike {
  private map = new Map<string, string>();
  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }
  removeItem(key: string): void {
    this.map.delete(key);
  }
  clear(): void {
    this.map.clear();
  }
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `q_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export { DEFAULT_STORAGE_KEY };
