"use client";
import React, { useContext } from 'react';
import { DataContext } from '@/context/DataContext';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { dataLoading } = useContext(DataContext);

  return (
    <>
      {dataLoading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="text-text-secondary text-sm">Syncing data...</div>
        </div>
      )}
      {children}
    </>
  );
}
