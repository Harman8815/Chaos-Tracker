import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { createEventBus, EventMap } from '../src/lib/events';

interface TestEventMap extends EventMap {
  ping: number;
  x: void;
  e: string;
}

describe('createEventBus', () => {
  it('delivers emitted events to subscribers', () => {
    const bus = createEventBus<TestEventMap>();
    const received: number[] = [];
    const off = bus.on('ping', (p) => received.push(p));
    bus.emit('ping', 1);
    bus.emit('ping', 2);
    off();
    bus.emit('ping', 3);
    assert.deepEqual(received, [1, 2]);
  });

  it('once removes handler after first call', () => {
    const bus = createEventBus<TestEventMap>();
    let count = 0;
    bus.once('x', () => count++);
    bus.emit('x', undefined);
    bus.emit('x', undefined);
    assert.equal(count, 1);
  });

  it('off removes a specific handler', () => {
    const bus = createEventBus<TestEventMap>();
    const a = () => {};
    const b = () => {};
    bus.on('x', a);
    bus.on('x', b);
    bus.off('x', a);
    // both removed handler should not throw and only b remains
    assert.doesNotThrow(() => bus.emit('x', undefined));
  });

  it('supports unsubscribe return from on()', () => {
    const bus = createEventBus<TestEventMap>();
    const calls: string[] = [];
    const unsub = bus.on('e', (p) => calls.push(p));
    bus.emit('e', 'a');
    unsub();
    bus.emit('e', 'b');
    assert.deepEqual(calls, ['a']);
  });
});
