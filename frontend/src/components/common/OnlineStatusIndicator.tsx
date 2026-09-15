"use client";

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';
import { useRealtime } from '../../context/RealtimeContext';

export function OnlineStatusIndicator() {
  const { online, pendingWrites, syncNow, lastUpdate } = useRealtime();
  const [showDetails, setShowDetails] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    if (online && lastUpdate > 0) {
      setLastSynced(new Date(lastUpdate).toLocaleTimeString());
    }
  }, [online, lastUpdate]);

  if (!showDetails && online && pendingWrites === 0) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
        showDetails ? 'w-auto opacity-100' : 'w-10 opacity-80'
      } ${online ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      role="status"
      aria-live="polite"
      aria-label={online ? `Online${pendingWrites > 0 ? `, ${pendingWrites} pending sync` : ''}` : 'Offline'}
    >
      {online ? (
        <Wifi className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      ) : (
        <WifiOff className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      )}
      {showDetails && (
        <>
          <span className="whitespace-nowrap">
            {online ? 'Online' : 'Offline'}
          </span>
          {pendingWrites > 0 && online && (
            <>
              <span className="whitespace-nowrap text-amber-400">·</span>
              <span className="whitespace-nowrap">{pendingWrites} pending</span>
              <button
                onClick={syncNow}
                className="ml-1 p-1 rounded hover:bg-white/10 transition-colors"
                aria-label="Sync now"
                disabled={!online}
              >
                <RotateCcw className="w-3 h-3" aria-hidden="true" />
              </button>
            </>
          )}
          {lastSynced && online && (
            <>
              <span className="whitespace-nowrap text-text-secondary">·</span>
              <span className="whitespace-nowrap text-text-secondary">Last sync: {lastSynced}</span>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default OnlineStatusIndicator;