export type Modifier = 'ctrl' | 'alt' | 'shift' | 'meta';

export interface KeyStroke {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export interface ShortcutContext {
  openCommandPalette: () => void;
  openShortcutsHelp: () => void;
  navigate: (href: string) => void;
  toggleTheme: () => void;
  toggleDensity: () => void;
  toggleSidebar?: () => void;
  search?: () => void;
  openAIModal?: () => void;
  openSettings?: () => void;
}

export interface Shortcut {
  id: string;
  label: string;
  description?: string;
  sequence: KeyStroke[];
  category: string;
  action: (ctx: ShortcutContext) => void;
}

export interface KeyboardEventLite {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
  defaultPrevented?: boolean;
  preventDefault(): void;
  stopPropagation(): void;
}

export function toStroke(event: KeyboardEventLite): KeyStroke {
  return {
    key: event.key,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  };
}

function strokeEquals(a: KeyStroke, b: KeyStroke): boolean {
  return (
    a.key.toLowerCase() === b.key.toLowerCase() &&
    !!a.ctrl === !!b.ctrl &&
    !!a.alt === !!b.alt &&
    !!a.shift === !!b.shift &&
    !!a.meta === !!b.meta
  );
}

export function matchStroke(event: KeyboardEventLite, stroke: KeyStroke): boolean {
  if (event.defaultPrevented) return false;
  return strokeEquals(toStroke(event), stroke);
}

export function matchesSequence(input: KeyStroke[], shortcut: Shortcut): boolean {
  if (input.length !== shortcut.sequence.length) return false;
  return input.every((s, i) => strokeEquals(s, shortcut.sequence[i]));
}

export function isChordPrefix(input: KeyStroke[], shortcuts: Shortcut[]): boolean {
  if (input.length === 0) return false;
  return shortcuts.some((sc) => {
    if (sc.sequence.length <= input.length) return false;
    return input.every((s, i) => strokeEquals(s, sc.sequence[i]));
  });
}

export function describeKeyStroke(stroke: KeyStroke): string {
  const parts: string[] = [];
  if (stroke.ctrl) parts.push('Ctrl');
  if (stroke.alt) parts.push('Alt');
  if (stroke.shift) parts.push('Shift');
  if (stroke.meta) parts.push('Cmd');
  parts.push(stroke.key.toUpperCase());
  return parts.join(' + ');
}

export function describeShortcut(shortcut: Shortcut): string {
  return shortcut.sequence.map(describeKeyStroke).join(' , ');
}

export function buildShortcuts(context: ShortcutContext): Shortcut[] {
  const open = (cb?: () => void) => cb && cb();
  return [
    {
      id: 'command-palette',
      label: 'Open Command Palette',
      sequence: [{ key: 'k', meta: true }, { key: 'k', ctrl: true }],
      category: 'Navigation',
      description: 'Search and run commands from anywhere',
      action: (c) => open(context.openCommandPalette ?? c.openCommandPalette),
    },
    {
      id: 'shortcuts-help',
      label: 'Keyboard Shortcuts',
      sequence: [{ key: '?' }],
      category: 'General',
      description: 'Show keyboard shortcuts',
      action: (c) => open(context.openShortcutsHelp ?? c.openShortcutsHelp),
    },
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      sequence: [{ key: 'l', shift: true }],
      category: 'General',
      action: (c) => open(context.toggleTheme ?? c.toggleTheme),
    },
    {
      id: 'toggle-density',
      label: 'Toggle Density',
      sequence: [{ key: 'd', shift: true }],
      category: 'General',
      action: (c) => open(context.toggleDensity ?? c.toggleDensity),
    },
    {
      id: 'ai-assistant',
      label: 'Open AI Assistant',
      sequence: [{ key: 'i', meta: true }, { key: 'i', ctrl: true }],
      category: 'AI',
      action: (c) => open(context.openAIModal ?? c.openAIModal),
    },
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      sequence: [{ key: 'g' }, { key: 'd' }],
      category: 'Navigation',
      action: (c) => (context.navigate ?? c.navigate)('/dashboard'),
    },
    {
      id: 'goals',
      label: 'Go to Goals',
      sequence: [{ key: 'g' }, { key: 'g' }],
      category: 'Navigation',
      action: (c) => (context.navigate ?? c.navigate)('/goals'),
    },
    {
      id: 'planner',
      label: 'Go to Planner',
      sequence: [{ key: 'g' }, { key: 'p' }],
      category: 'Navigation',
      action: (c) => (context.navigate ?? c.navigate)('/planner'),
    },
    {
      id: 'journal',
      label: 'Go to Journal',
      sequence: [{ key: 'g' }, { key: 'j' }],
      category: 'Navigation',
      action: (c) => (context.navigate ?? c.navigate)('/journal'),
    },
    {
      id: 'expenses',
      label: 'Go to Expenses',
      sequence: [{ key: 'g' }, { key: 'e' }],
      category: 'Navigation',
      action: (c) => (context.navigate ?? c.navigate)('/expense'),
    },
  ];
}

export function dispatchShortcut(event: KeyboardEventLite, input: KeyStroke[], shortcuts: Shortcut[], context: ShortcutContext): boolean {
  for (const sc of shortcuts) {
    if (matchesSequence(input, sc)) {
      event.preventDefault();
      sc.action(context);
      return true;
    }
  }
  return false;
}
