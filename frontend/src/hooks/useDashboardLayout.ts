"use client";

import { useState, useCallback, useEffect } from 'react';
import type { DashboardLayout, DashboardWidgetConfig, DashboardWidgetId } from '../types';

export const DEFAULT_DASHBOARD_LAYOUT: DashboardWidgetConfig[] = [
  { id: 'rank', enabled: true, x: 0, y: 0, w: 2 },
  { id: 'time', enabled: true, x: 2, y: 0, w: 2 },
  { id: 'streaks', enabled: true, x: 0, y: 2, w: 4 },
  { id: 'trend', enabled: true, x: 0, y: 3, w: 4 },
  { id: 'radar', enabled: true, x: 0, y: 4, w: 2 },
  { id: 'today-pie', enabled: true, x: 2, y: 4, w: 2 },
  { id: 'habit-streaks-bar', enabled: true, x: 0, y: 5, w: 2 },
  { id: 'monthly-avg', enabled: true, x: 2, y: 5, w: 2 },
  { id: 'weekly-perf', enabled: true, x: 0, y: 6, w: 2 },
  { id: 'target', enabled: true, x: 2, y: 6, w: 2 },
  { id: 'ai-reflection', enabled: true, x: 0, y: 7, w: 4 },
];

export const DASHBOARD_STORAGE_KEY = 'tracker-dashboard-layout';
export const DASHBOARD_COLUMNS = 4;

export function readDashboardLayout(): DashboardLayout {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { widgets: DEFAULT_DASHBOARD_LAYOUT, columns: DASHBOARD_COLUMNS };
  }
  try {
    const raw = window.localStorage.getItem(DASHBOARD_STORAGE_KEY);
    if (!raw) return { widgets: DEFAULT_DASHBOARD_LAYOUT, columns: DASHBOARD_COLUMNS };
    const parsed = JSON.parse(raw) as DashboardLayout;
    if (Array.isArray(parsed.widgets) && parsed.widgets.length) return parsed;
  } catch {
    // fall through to default
  }
  return { widgets: DEFAULT_DASHBOARD_LAYOUT, columns: DASHBOARD_COLUMNS };
}

export function writeDashboardLayout(layout: DashboardLayout): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // storage full / disabled
  }
}

export function reorderWidgets(widgets: DashboardWidgetConfig[], newOrder: string[]): DashboardWidgetConfig[] {
  const order = new Map(newOrder.map((id, i) => [id, i]));
  return widgets
    .slice()
    .sort((a, b) => {
      const ai = order.get(a.id) ?? 0;
      const bi = order.get(b.id) ?? 0;
      if (ai === bi) return 0;
      return ai < bi ? -1 : 1;
    })
    .map((w, i) => ({ ...w, y: i }));
}

export function useDashboardLayout() {
  const [layout, setLayout] = useState<DashboardLayout>(() => readDashboardLayout());

  useEffect(() => {
    writeDashboardLayout(layout);
  }, [layout]);

  const reorder = useCallback((newOrder: string[]) => {
    setLayout((prev) => ({ ...prev, widgets: reorderWidgets(prev.widgets.filter((w) => w.enabled), newOrder) }));
  }, []);

  const updateWidget = useCallback(
    (id: DashboardWidgetId, patch: Partial<DashboardWidgetConfig>) =>
      setLayout((prev) => ({
        ...prev,
        widgets: prev.widgets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
      })),
    [],
  );

  const toggle = useCallback((id: DashboardWidgetId) => {
    setLayout((prev) => ({
      ...prev,
      widgets: prev.widgets.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)),
    }));
  }, []);

  const reset = useCallback(() => {
    setLayout({ widgets: DEFAULT_DASHBOARD_LAYOUT, columns: DASHBOARD_COLUMNS });
  }, []);

  const enabledWidgets = layout.widgets.filter((w) => w.enabled);

  return { layout, enabledWidgets, reorder, updateWidget, toggle, reset, storageKey: DASHBOARD_STORAGE_KEY };
}
