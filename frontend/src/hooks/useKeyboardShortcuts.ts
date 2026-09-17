"use client";

import { useEffect, useRef, useCallback } from 'react';
import {
  buildShortcuts,
  type Shortcut,
  type ShortcutContext,
  type KeyStroke,
  type KeyboardEventLite,
  toStroke,
  matchesSequence,
  isChordPrefix,
  matchStroke,
} from '../lib/shortcuts';

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
}

const CHORD_TIMEOUT_MS = 1200;

function isInEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toUpperCase();
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboardShortcuts(
  context: ShortcutContext,
  shortcuts: Shortcut[] = [],
  options: UseKeyboardShortcutsOptions = {},
): void {
  const { enabled = true } = options;
  const contextRef = useRef(context);
  contextRef.current = context;
  const shortcutsRef = useRef<Shortcut[]>(shortcuts.length ? shortcuts : buildShortcuts(context));
  shortcutsRef.current = shortcuts.length ? shortcuts : buildShortcuts(context);

  const chordStateRef = useRef<{ sequence: KeyStroke[]; timer: ReturnType<typeof setTimeout> | null }>({
    sequence: [],
    timer: null,
  });

  const resetChord = useCallback(() => {
    if (chordStateRef.current.timer) clearTimeout(chordStateRef.current.timer);
    chordStateRef.current = { sequence: [], timer: null };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ctx: ShortcutContext = contextRef.current;

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      const lite = e as unknown as KeyboardEventLite;
      const stroke = toStroke(lite);

      const single = shortcutsRef.current.find(
        (sc) => sc.sequence.length === 1 && matchStroke(lite, sc.sequence[0]),
      );
      if (single) {
        if (!isInEditableTarget(e.target)) {
          e.preventDefault();
          single.action(ctx);
        }
        return;
      }

      const hasChord = shortcutsRef.current.some((sc) => sc.sequence.length > 1);
      if (!hasChord) return;
      if (isInEditableTarget(e.target)) return;

      const input = [...chordStateRef.current.sequence, stroke];

      for (const sc of shortcutsRef.current) {
        if (sc.sequence.length > 1 && matchesSequence(input, sc)) {
          resetChord();
          e.preventDefault();
          sc.action(ctx);
          return;
        }
      }

      const prefixes = shortcutsRef.current.some((sc) => sc.sequence.length > 1 && isChordPrefix(input, [sc]));
      if (prefixes) {
        chordStateRef.current.sequence = input;
        if (chordStateRef.current.timer) clearTimeout(chordStateRef.current.timer);
        chordStateRef.current.timer = setTimeout(resetChord, CHORD_TIMEOUT_MS);
        e.preventDefault();
        return;
      }

      resetChord();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (chordStateRef.current.timer) clearTimeout(chordStateRef.current.timer);
    };
  }, [enabled, resetChord]);
}
