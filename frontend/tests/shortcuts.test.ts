import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { matchStroke, buildShortcuts, matchesSequence, isChordPrefix, describeShortcut, toStroke, type ShortcutContext } from '../src/lib/shortcuts';

function evt(key: string, mods: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {}) {
  return {
    key,
    ctrlKey: !!mods.ctrl,
    altKey: !!mods.alt,
    shiftKey: !!mods.shift,
    metaKey: !!mods.meta,
    defaultPrevented: false,
    preventDefault() { this.defaultPrevented = true; },
    stopPropagation() {},
  };
}

const ctx: ShortcutContext = {
  openCommandPalette: () => {},
  openShortcutsHelp: () => {},
  navigate: () => {},
  toggleTheme: () => {},
  toggleDensity: () => {},
};

describe('matchStroke', () => {
  it('matches a single unmodified key', () => {
    assert.equal(matchStroke(evt('?'), { key: '?', sequence: [{ key: '?' }] } as any), true);
  });

  it('requires modifiers to match', () => {
    const stroke = { key: 'k', shift: true, sequence: [{ key: 'k' }] } as any;
    assert.equal(matchStroke(evt('k', { shift: true }), stroke), true);
    assert.equal(matchStroke(evt('k'), stroke), false);
  });

  it('ignores already-prevented events', () => {
    const e = evt('?');
    e.preventDefault();
    assert.equal(matchStroke(e, { key: '?', sequence: [{ key: '?' }] } as any), false);
  });
});

describe('buildShortcuts', () => {
  it('includes command palette and nav chords', () => {
    const sc = buildShortcuts(ctx);
    const ids = sc.map((s) => s.id);
    assert.ok(ids.includes('command-palette'));
    assert.ok(ids.includes('shortcuts-help'));
    assert.ok(ids.includes('dashboard'));
    assert.ok(ids.includes('ai-assistant'));
  });

  it('chord sequences have more than one keystroke', () => {
    const sc = buildShortcuts(ctx);
    const dash = sc.find((s) => s.id === 'dashboard')!;
    assert.equal(dash.sequence.length, 2);
  });
});

describe('matchesSequence / isChordPrefix', () => {
  const dash = { sequence: [{ key: 'g' }, { key: 'd' }], category: '', action: () => {} } as any;
  it('matches a complete chord', () => {
    assert.equal(matchesSequence([toStroke(evt('g')), toStroke(evt('d'))], dash), true);
  });
  it('detects a partial chord prefix', () => {
    assert.equal(isChordPrefix([toStroke(evt('g'))], [dash as any]), true);
    assert.equal(isChordPrefix([toStroke(evt('x'))], [dash as any]), false);
  });
});

describe('describeShortcut', () => {
  it('formats modifiers and key', () => {
    assert.equal(describeShortcut({ sequence: [{ key: 'k', ctrl: true, meta: true }], category: '', action: () => {} } as any), 'Ctrl + Cmd + K');
  });
});
