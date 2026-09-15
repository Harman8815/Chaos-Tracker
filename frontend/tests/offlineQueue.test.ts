import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { OfflineQueue, MemoryStorage } from '../src/lib/offlineQueue';

function makeQueue() {
  const storage = new MemoryStorage();
  return new OfflineQueue(storage);
}

describe('OfflineQueue', () => {
  it('enqueues and persists items', () => {
    const q = makeQueue();
    q.enqueue({ endpoint: '/goals/', method: 'POST', body: { text: 'x' } });
    assert.equal(q.count(), 1);
    const all = q.all();
    assert.equal(all[0].endpoint, '/goals/');
    assert.equal(all[0].attempt, 0);
  });

  it('persists across instances via storage', () => {
    const storage = new MemoryStorage();
    const q1 = new OfflineQueue(storage);
    q1.enqueue({ endpoint: '/goals/', method: 'POST', body: {} });
    const q2 = new OfflineQueue(storage);
    assert.equal(q2.count(), 1);
  });

  it('pending excludes exceeded retries', () => {
    const q = makeQueue();
    const id = q.enqueue({ endpoint: '/x', method: 'POST', body: {} });
    for (let i = 0; i < 5; i++) q.incrementAttempt(id);
    assert.equal(q.pending().length, 0);
  });

  it('pending returns only retryable items sorted by time', () => {
    const q = makeQueue();
    const id2 = q.enqueue({ endpoint: '/a', method: 'POST', body: {} });
    const id1 = q.enqueue({ endpoint: '/b', method: 'POST', body: {} });
    const pending = q.pending();
    assert.equal(pending.length, 2);
    assert.equal(pending[0].endpoint, '/a');
  });

  it('processQueue drains successful items', async () => {
    const storage = new MemoryStorage();
    const q = new OfflineQueue(storage);
    const transport = {
      request: async () => {},
    };
    const SyncManagerCtor = (await import('../src/services/syncService')).SyncManager;
    const manager = new SyncManagerCtor(q, transport as any);
    q.enqueue({ endpoint: '/x', method: 'POST', body: {} });
    q.enqueue({ endpoint: '/y', method: 'POST', body: {} });
    const res = await manager.processQueue();
    assert.equal(res.processed, 2);
    assert.equal(res.failed, 0);
    assert.equal(q.count(), 0);
  });

  it('processQueue increments attempt on failure', async () => {
    const q = makeQueue();
    const transport = {
      request: async () => {
        throw new Error('boom');
      },
    };
    const { SyncManager } = await import('../src/services/syncService');
    const manager = new SyncManager(q, transport as any);
    const id = q.enqueue({ endpoint: '/x', method: 'POST', body: {} });
    const res = await manager.processQueue();
    assert.equal(res.failed, 1);
    assert.equal(q.all().find((i) => i.id === id)!.attempt, 1);
  });

  it('clear empties the queue', () => {
    const q = makeQueue();
    q.enqueue({ endpoint: '/x', method: 'POST', body: {} });
    q.clear();
    assert.equal(q.count(), 0);
  });
});
