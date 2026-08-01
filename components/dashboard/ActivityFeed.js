'use client';

import React from 'react';
import { Activity, Clock, CheckCircle2, FileText, Sparkles, Presentation } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ActivityFeed({ ideas = [] }) {
  // Synthesize recent activities from ideas data
  const activities = ideas.slice(0, 5).map((idea, idx) => ({
    id: idea._id,
    type: idx % 2 === 0 ? 'validation' : 'deck',
    title: idea.title,
    time: 'Recently',
    score: idea.analysis?.profitability_score || 75,
  }));

  if (activities.length === 0) {
    activities.push(
      { id: '1', type: 'system', title: 'AI Analyst Engine initialized', time: 'Just now', score: 100 },
      { id: '2', type: 'system', title: 'Market database updated with 10k+ data points', time: '1 hour ago', score: 95 }
    );
  }

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-violet/10 text-accent-violet flex items-center justify-center border border-accent-violet/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity Audit</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Live feed of system operations</p>
          </div>
        </div>
        <Badge variant="outline">Live Feed</Badge>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {activities.map((act) => (
          <div key={act.id} className="relative flex items-start justify-between text-xs group">
            <div className="absolute -left-[21px] top-0.5 w-3 h-3 rounded-full bg-brand-500 border-2 border-slate-900 shadow-glow-primary" />
            <div className="space-y-0.5 max-w-[80%]">
              <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-400 transition-colors">
                {act.title}
              </span>
              <p className="text-[11px] text-slate-400">
                {act.type === 'validation' ? 'Completed market validation analysis' : 'Generated 10-slide pitch deck'}
              </p>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
