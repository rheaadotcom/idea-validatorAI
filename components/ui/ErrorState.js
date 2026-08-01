'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = "Something went wrong while processing your request.", onRetry }) {
  return (
    <div className="glass-card rounded-2xl p-8 border-rose-500/30 bg-rose-500/5 text-center space-y-4 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="font-semibold text-rose-600 dark:text-rose-400">Error Occurred</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
}
