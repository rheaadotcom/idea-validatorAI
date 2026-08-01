'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Zap, Sparkles } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AnalyticsCharts({ ideas = [] }) {
  // Score Tier Distribution
  const tiers = {
    high: ideas.filter(i => (i.analysis?.profitability_score || 0) >= 80).length,
    good: ideas.filter(i => (i.analysis?.profitability_score || 0) >= 60 && (i.analysis?.profitability_score || 0) < 80).length,
    average: ideas.filter(i => (i.analysis?.profitability_score || 0) >= 40 && (i.analysis?.profitability_score || 0) < 60).length,
    low: ideas.filter(i => (i.analysis?.profitability_score || 0) < 40).length,
  };

  const total = ideas.length || 1;

  const marketSectors = [
    { name: 'AI & Autonomous Agents', growth: '+44% YoY', percentage: 88, color: 'bg-brand-500' },
    { name: 'Micro-SaaS & Developer Tools', growth: '+32% YoY', percentage: 76, color: 'bg-accent-cyan' },
    { name: 'Digital Health & Bio-Analytics', growth: '+25% YoY', percentage: 64, color: 'bg-accent-emerald' },
    { name: 'Fintech & Automated Wealth', growth: '+18% YoY', percentage: 52, color: 'bg-accent-violet' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Chart 1: Profitability Score Distribution */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center border border-brand-500/20">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Profitability Score Distribution</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Analysis performance breakdown</p>
            </div>
          </div>
          <Badge variant="cyan">Histogram</Badge>
        </div>

        {/* Visual Bar Chart */}
        <div className="space-y-3 pt-2">
          {[
            { label: '80% – 100% (Unicorn Tier)', count: tiers.high, color: 'bg-emerald-500' },
            { label: '60% – 79% (Strong Market Pull)', count: tiers.good, color: 'bg-cyan-500' },
            { label: '40% – 59% (Moderate Potential)', count: tiers.average, color: 'bg-amber-500' },
            { label: 'Under 40% (High Challenge)', count: tiers.low, color: 'bg-rose-500' },
          ].map((bar, idx) => {
            const pct = Math.round((bar.count / total) * 100);

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-300">{bar.label}</span>
                  <span className="text-slate-400">{bar.count} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    className={`h-full ${bar.color} rounded-full`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Chart 2: Market Sector Velocity Radar */}
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center border border-accent-cyan/20">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Market Sector Velocity Index</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Live investor capital allocation trends</p>
            </div>
          </div>
          <Badge variant="violet" icon={Sparkles}>AI Radar</Badge>
        </div>

        {/* Progress List */}
        <div className="space-y-3.5 pt-1">
          {marketSectors.map((sector, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-200">{sector.name}</span>
                <span className="text-emerald-400 font-bold">{sector.growth}</span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sector.percentage}%` }}
                  transition={{ duration: 1.2, delay: idx * 0.15 }}
                  className={`h-full ${sector.color} rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
