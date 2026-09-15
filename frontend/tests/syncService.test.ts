import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createPlannerPatch, needsPlannerSync, ApiTransport } from '../src/services/syncService';
import type { PlannerData } from '../src/types';
import type { QueueItem } from '../src/lib/offlineQueue';

function makePlanner(blocks: Array<{ id: string; title: string }>): PlannerData {
  return {
    blocks: blocks.map((b) => ({ id: b.id, title: b.title, x: 0, y: 0, tasks: [] })),
    links: [],
    transform: { scale: 1, panX: 0, panY: 0 },
  };
}

describe('createPlannerPatch', () => {
  it('returns full local data when remote is null', () => {
    const local = makePlanner([{ id: 'a', title: 'A' }]);
    assert.deepEqual(createPlannerPatch(local, null), local);
  });

  it('returns null when nothing changed', () => {
    const local = makePlanner([{ id: 'a', title: 'A' }]);
    const remote = makePlanner([{ id: 'a', title: 'A' }]);
    assert.equal(createPlannerPatch(local, remote), null);
  });

  it('detects new local blocks', () => {
    const remote = makePlanner([{ id: 'a', title: 'A' }]);
    const local = makePlanner([{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }]);
    const patch = createPlannerPatch(local, remote);
    assert.ok(patch);
    if (patch && patch.blocks) {
      assert.equal(patch.blocks.length, 2);
    }
  });

  it('detects changed blocks', () => {
    const remote = makePlanner([{ id: 'a', title: 'Old' }]);
    const local = makePlanner([{ id: 'a', title: 'New' }]);
    assert.ok(createPlannerPatch(local, remote));
  });

  it('returns null when local is undefined', () => {
    assert.equal(createPlannerPatch(undefined, null), null);
  });
});

describe('needsPlannerSync', () => {
  it('is true when there are differences', () => {
    const local = makePlanner([{ id: 'a', title: 'A' }]);
    const remote = makePlanner([{ id: 'a', title: 'Different' }]);
    assert.equal(needsPlannerSync(local, remote), true);
  });

  it('is false when identical', () => {
    const local = makePlanner([{ id: 'a', title: 'A' }]);
    assert.equal(needsPlannerSync(local, local), false);
  });
});

describe('ApiTransport', () => {
  it('dispatches to the correct client method per HTTP method', async () => {
    const calls: string[] = [];
    const fakeClient = {
      get: async () => calls.push('get'),
      post: async () => calls.push('post'),
      put: async () => calls.push('put'),
      patch: async () => calls.push('patch'),
      delete: async () => calls.push('delete'),
    };
    const transport = new ApiTransport(fakeClient as any);
    const item: QueueItem = { id: '1', endpoint: '/x', method: 'PUT', body: { a: 1 }, createdAt: 0, attempt: 0, idemKey: 'k' };
    await transport.request(item);
    assert.deepEqual(calls, ['put']);

    item.method = 'DELETE';
    await transport.request(item);
    assert.deepEqual(calls, ['put', 'delete']);

    item.method = 'POST';
    await transport.request(item);
    assert.deepEqual(calls, ['put', 'delete', 'post']);
  });
});
