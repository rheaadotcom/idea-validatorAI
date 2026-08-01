'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, PlusCircle } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = "No validated ideas yet",
  description = "Transform your raw thoughts into actionable startup blueprints using our AI engine.",
  actionHref = "/",
  actionText = "Validate Your First Idea",
  icon: Icon = Sparkles
}) {
  return (
    <div className="glass-card rounded-3xl p-12 text-center max-w-lg mx-auto space-y-6 border-dashed border-2 border-slate-300 dark:border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500/20 via-accent-cyan/20 to-accent-violet/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-500 shadow-glow-primary">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {actionHref && (
        <Link href={actionHref} className="inline-block">
          <Button variant="shiny" size="md" icon={PlusCircle}>
            {actionText}
          </Button>
        </Link>
      )}
    </div>
  );
}
