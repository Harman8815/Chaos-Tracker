import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { createEventBus, AppEventBus, DashboardEventMap, EventBus } from '../lib/events';
import { OfflineQueue, StorageLike } from '../lib/offlineQueue';
import { SyncManager, ApiTransport, SyncResult } from '../services/syncService';
import { dashboardService, DashboardData } from '../services/dashboardService';
import { PointsData } from '../services/pointsService';
import { PlannerData, DashboardLayout } from '../types';
import { WS_BASE_URL, POLL_INTERVAL_MS } from '../lib/env';

export interface RealtimeContextValue {
  eventBus: AppEventBus;
  online: boolean;
  lastUpdate: number;
  pollIntervalMs: number;
  setPollIntervalMs: (n: number) => void;
  refresh: () => Promise<void>;
  sendAI: (payload: { prompt: string; history?: Array<{ role: string; parts: { text: string }[] }> }) => Promise<string>;
  latestPoints: PointsData | null;
  pendingWrites: number;
  syncNow: () => Promise<SyncResult>;
  persistPlanner: (data: PlannerData) => Promise<boolean>;
  persistDashboardLayout: (layout: DashboardLayout) => void;
  reconnect: () => void;
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

const STORAGE_KEY = 'tracker-offline-queue';

export interface RealtimeProviderProps {
  children: React.ReactNode;
  mergeRemote: (data: PointsData) => void;
  storageFactory?: () => StorageLike;
}

function getStorage(): StorageLike {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
}

function getWebSocketBase(): string {
  if (typeof window === 'undefined') return '';
  const loc = window.location;
  const protocol = loc.protocol === 'https:' ? 'wss' : 'ws';
  const host = loc.host;
  const base = WS_BASE_URL || `${protocol}//${host}`;
  return base;
}

function convertDashboardToPointsData(data: DashboardData): PointsData {
  const dailyData: PointsData['dailyData'] = {};
  for (const [date, dayData] of Object.entries(data.dailyScores)) {
    dailyData[date] = {
      habitScores: dayData.habitScores || {},
      journal: dayData.journal || '',
    };
  }
  return {
    habits: data.habits,
    rules: [],
    dailyData,
  };
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children, mergeRemote, storageFactory }) => {
  const storage = useRef<StorageLike>(storageFactory ? storageFactory() : getStorage());
  const [online, setOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [pollIntervalMs, setPollIntervalMs] = useState<number>(POLL_INTERVAL_MS);
  const [latestPoints, setLatestPoints] = useState<PointsData | null>(null);
  const [pendingWrites, setPendingWrites] = useState<number>(0);

  const eventBusRef = useRef<EventBus<DashboardEventMap> | null>(null);
  if (!eventBusRef.current) {
    eventBusRef.current = createEventBus<DashboardEventMap>();
    storage.current.setItem(STORAGE_KEY, storage.current.getItem(STORAGE_KEY) ?? '[]');
  }
  const eventBus = eventBusRef.current;

  const queueRef = useRef<OfflineQueue | null>(null);
  if (!queueRef.current) {
    queueRef.current = new OfflineQueue(storage.current);
  }
  const syncManagerRef = useRef<SyncManager | null>(null);
  if (!syncManagerRef.current) {
    syncManagerRef.current = new SyncManager(queueRef.current, new ApiTransport(), eventBus);
  }

  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const abortedRef = useRef(false);
  const refreshCounter = useRef(0);

  const updateOnline = useCallback((o: boolean) => {
    setOnline(o);
    eventBus.emit('online:state', { online: o });
  }, [eventBus]);

  const refreshPending = useCallback(() => {
    if (queueRef.current) setPendingWrites(queueRef.current.count());
  }, []);

  const refresh = useCallback(async () => {
    const id = ++refreshCounter.current;
    if (abortedRef.current || id !== refreshCounter.current) return;
    try {
      const points = await dashboardService.getDashboardData();
      if (abortedRef.current || id !== refreshCounter.current) return;
      const pointsData = convertDashboardToPointsData(points);
      setLatestPoints(pointsData);
      setLastUpdate((n) => n + 1);
      mergeRemote(pointsData);
      eventBus.emit('dashboard:update', { source: 'poll', ts: Date.now() });
      if (queueRef.current) setPendingWrites(queueRef.current.count());
    } catch (err) {
      eventBus.emit('dashboard:update', { source: 'poll', ts: Date.now() });
    }
  }, [eventBus, mergeRemote]);

  const connectWebSocket = useCallback(() => {
    if (typeof WebSocket === 'undefined') return;
    const base = getWebSocketBase();
    const wsUrl = `${base}${WS_BASE_URL ? '' : ''}/ws/dashboard/`;
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onopen = () => {
        eventBus.emit('online:state', { online: true });
      };
      ws.onmessage = (ev: MessageEvent) => {
        let msg: { type: string; payload?: unknown } = { type: 'raw', payload: ev.data };
        try {
          msg = JSON.parse(ev.data);
        } catch {
          // raw text
        }
        if (msg.type === 'dashboard:update' && msg.payload) {
          eventBus.emit('dashboard:update', { source: 'socket', ts: Date.now() });
          setLastUpdate((n) => n + 1);
          try {
            const pointsData = convertDashboardToPointsData(msg.payload as DashboardData);
            setLatestPoints(pointsData);
          } catch {}
        }
        if (msg.type === 'ai:stream-chunk') {
          eventBus.emit('ai:stream-chunk', msg.payload as DashboardEventMap['ai:stream-chunk']);
        }
      };
      ws.onerror = () => {
        eventBus.emit('online:state', { online: navigator.onLine });
      };
      ws.onclose = () => {
        wsRef.current = null;
      };
    } catch {
      wsRef.current = null;
    }
  }, [eventBus]);

  const reconnect = useCallback(() => {
    if (wsRef.current) wsRef.current.close();
    connectWebSocket();
  }, [connectWebSocket]);

  const sendAI = useCallback(
    async (payload: { prompt: string; history?: ReadonlyArray<{ role: string; parts: { text: string }[] }> }): Promise<string> => {
      eventBus.emit('ai:stream-start', { id: payload.prompt } as DashboardEventMap['ai:stream-start']);
      const wsBase = getWebSocketBase();
      const wsUrl = `${wsBase}/ws/ai/stream/`;
      const chunks: string[] = [];
      const { streamAIContent } = await import('../services/streamingService');
      const streamPayload = {
        prompt: payload.prompt,
        history: payload.history as Array<{ role: string; parts: { text: string }[] }> | undefined,
      };
      for await (const msg of streamAIContent(streamPayload, { wsUrl }, { eventBus: { emit: (e, p) => eventBus.emit(e as any, p) } })) {
        if (msg.type === 'chunk' && msg.text) {
          chunks.push(msg.text);
          eventBus.emit('ai:stream-chunk', { id: payload.prompt, text: msg.text } as DashboardEventMap['ai:stream-chunk']);
        }
      }
      eventBus.emit('ai:stream-end', { id: payload.prompt, text: chunks.join('') } as DashboardEventMap['ai:stream-end']);
      return chunks.join('');
    },
    [eventBus],
  );

  const syncNow = useCallback(async (): Promise<SyncResult> => {
    const res = await syncManagerRef.current!.scheduleSync();
    refreshPending();
    return res;
  }, []);

  const persistPlanner = useCallback(async (data: PlannerData): Promise<boolean> => {
    const ok = await syncManagerRef.current!.persistPlanner(data);
    refreshPending();
    return ok;
  }, []);

  const persistDashboardLayout = useCallback((layout: DashboardLayout) => {
    syncManagerRef.current!.persistDashboardLayout(layout);
    refreshPending();
  }, []);

  useEffect(() => {
    const onOnline = () => updateOnline(true);
    const onOffline = () => updateOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [updateOnline]);

  useEffect(() => {
    if (online) {
      syncNow();
    }
  }, [online, syncNow]);

  useEffect(() => {
    if (!online) return;
    const id = setInterval(() => {
      pollRef.current && clearTimeout(pollRef.current);
      refresh();
    }, pollIntervalMs);
    pollRef.current = id as unknown as NodeJS.Timeout;
    return () => clearInterval(id);
  }, [online, pollIntervalMs, refresh]);

  useEffect(() => {
    if (online) {
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [online, connectWebSocket]);

  useEffect(() => {
    return () => {
      abortedRef.current = true;
    };
  }, []);

  const value: RealtimeContextValue = {
    eventBus,
    online,
    lastUpdate,
    pollIntervalMs,
    setPollIntervalMs,
    refresh,
    sendAI,
    latestPoints,
    pendingWrites,
    syncNow,
    persistPlanner,
    persistDashboardLayout,
    reconnect,
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
};

export function useRealtime(): RealtimeContextValue {
  const ctx = useContext(RealtimeContext);
  if (!ctx) throw new Error('useRealtime must be used within a RealtimeProvider');
  return ctx;
}
