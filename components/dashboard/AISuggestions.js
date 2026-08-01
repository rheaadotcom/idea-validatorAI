'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lightbulb, Flame } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AISuggestions() {
  const suggestions = [
    {
      title: "Autonomous Code Security Auditor",
      market: "DevTools & Cyber",
      tam: "$12B TAM",
      score: "92% Fit",
      desc: "AI bot that performs automated SAST security audits and PR dependency patching."
    },
    {
      title: "Bio-Wearable Longevity Coach",
      market: "HealthTech & Wearables",
      tam: "$45B TAM",
      score: "88% Fit",
      desc: "Integrates Apple Watch & Oura data to generate real-time predictive health recommendations."
    },
    {
      title: "Stripe Micro-SaaS Churn Intelligence",
      market: "FinTech & Analytics",
      tam: "$8B TAM",
      score: "85% Fit",
      desc: "ML model that detects subscription cancellation risks 30 days before user churns."
    }
  ];

  return (
    <Card className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI High-Potential Opportunity Radar</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Curated unserved market niches with high TAM</p>
          </div>
        </div>
        <Badge variant="warning" icon={Sparkles}>Curated</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((sug, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-3 flex flex-col justify-between hover:border-brand-500/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">{sug.market}</Badge>
                <span className="text-xs font-bold text-emerald-400">{sug.score}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">{sug.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{sug.desc}</p>
            </div>

            <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">{sug.tam}</span>
              <Link href="/" className="text-[11px] font-bold text-brand-400 flex items-center gap-1 hover:underline">
                Validate <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
