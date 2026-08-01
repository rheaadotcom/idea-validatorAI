'use client';

import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-800/80 rounded-xl skeleton-shimmer ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="pt-4 flex justify-between items-center border-t border-slate-200/50 dark:border-slate-800/50">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}
