import { client } from '../api/client';
import { ENDPOINTS } from '../api/constants';
import type { PlannerData, DashboardLayout } from '../types';
import type { QueueItem, OfflineQueue } from '../lib/offlineQueue';
import type { DashboardEventMap } from '../lib/events';

export interface SyncResult {
  success: boolean;
  processed: number;
  failed: number;
  error?: string;
}

export interface SyncTransport {
  request(item: QueueItem): Promise<void>;
}

export class ApiTransport implements SyncTransport {
  constructor(private apiClient: typeof client = client) {}

  async request(item: QueueItem): Promise<void> {
    const { endpoint, method, body, headers } = item;
    switch (method) {
      case 'POST':
        await this.apiClient.post(endpoint, body, headers);
        break;
      case 'PUT':
        await this.apiClient.put(endpoint, body, headers);
        break;
      case 'PATCH':
        await this.apiClient.patch(endpoint, body, headers);
        break;
      case 'DELETE':
        await this.apiClient.delete(endpoint, headers);
        break;
      default:
        await this.apiClient.get(endpoint, headers);
    }
  }
}

export function createPlannerPatch(local: PlannerData | undefined, remote: PlannerData | null): Partial<PlannerData> | null {
  if (!local) return null;
  if (!remote) return local;
  const remoteBlocks = new Set((remote.blocks || []).map((b) => b.id));
  const missing = local.blocks.filter((b) => !remoteBlocks.has(b.id));
  const changed = local.blocks.filter((b) => {
    const rb = remote.blocks.find((x) => x.id === b.id);
    return rb && JSON.stringify(rb) !== JSON.stringify(b);
  });
  if (missing.length === 0 && changed.length === 0 && new Set(local.blocks.map((b) => b.id)).size === remoteBlocks.size)
    return null;
  return {
    blocks: [...(remote.blocks || []), ...missing, ...changed],
    links: local.links,
    transform: local.transform,
  };
}

export function needsPlannerSync(local: PlannerData | undefined, remote: PlannerData | null): boolean {
  return createPlannerPatch(local, remote) !== null;
}

export class SyncManager {
  private queue: OfflineQueue;
  private transport: SyncTransport;
  private eventBus?: { emit: (e: string, p: unknown) => void };
  private running = false;

  constructor(queue: OfflineQueue, transport: SyncTransport, eventBus?: { emit: (e: string, p: unknown) => void }) {
    this.queue = queue;
    this.transport = transport;
    this.eventBus = eventBus;
  }

  enqueue(item: Omit<QueueItem, 'id' | 'createdAt' | 'attempt' | 'idemKey'>): string {
    return this.queue.enqueue(item);
  }

  async persistPlanner(data: PlannerData): Promise<boolean> {
    if (this.isOnline()) {
      try {
        await this.transport.request({
          id: 'planner-local',
          endpoint: ENDPOINTS.PLANNER,
          method: 'PUT',
          body: data,
          createdAt: Date.now(),
          attempt: 0,
          idemKey: `planner:${Date.now()}`,
        });
        this.eventBus?.emit('online:state', { online: true } as DashboardEventMap['online:state']);
        return true;
      } catch {
        this.enqueue({ endpoint: ENDPOINTS.PLANNER, method: 'PUT', body: data });
        this.eventBus?.emit('offline:write', { endpoint: ENDPOINTS.PLANNER, method: 'PUT', body: data } as DashboardEventMap['offline:write']);
        return false;
      }
    }
    this.enqueue({ endpoint: ENDPOINTS.PLANNER, method: 'PUT', body: data });
    this.eventBus?.emit('offline:write', { endpoint: ENDPOINTS.PLANNER, method: 'PUT', body: data } as DashboardEventMap['offline:write']);
    return false;
  }

  get pendingCount(): number {
    return this.queue.count();
  }

  isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
  }

  async processQueue(limit = 50): Promise<SyncResult> {
    if (this.running) return { success: false, processed: 0, failed: 0, error: 'already-running' };
    this.running = true;
    const items = this.queue.pending(limit);
    let processed = 0;
    let failed = 0;
    let lastError: string | undefined;
    for (const item of items) {
      try {
        await this.transport.request(item);
        this.queue.remove(item.id);
        processed++;
      } catch (err) {
        this.queue.incrementAttempt(item.id);
        failed++;
        lastError = (err as Error).message;
      }
    }
    this.running = false;
    this.eventBus?.emit('online:state', { online: this.isOnline() } as DashboardEventMap['online:state']);
    return { success: failed === 0, processed, failed, error: lastError };
  }

  async scheduleSync(): Promise<SyncResult> {
    if (!this.isOnline()) {
      return { success: false, processed: 0, failed: 0, error: 'offline' };
    }
    const result = await this.processQueue();
    this.eventBus?.emit('online:state', { online: true } as DashboardEventMap['online:state']);
    return result;
  }

  persistDashboardLayout(layout: DashboardLayout): void {
    this.enqueue({ endpoint: '/dashboard/layout/', method: 'PUT', body: layout });
  }

  clearQueue(): void {
    this.queue.clear();
  }
}

