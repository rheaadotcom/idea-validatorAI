'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, Github, Twitter, Shield, Cpu, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/50 dark:bg-[#06070a] text-slate-600 dark:text-slate-400 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-glow-primary">
                <Lightbulb className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                IdeaValidator <span className="text-brand-500">AI</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              The next-generation AI intelligence platform for founders, product managers, and indie hackers to validate business ideas before writing code.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>All AI Systems Operational</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Product Features
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-brand-500 transition-colors">Market Size Analysis</Link></li>
              <li><Link href="/" className="hover:text-brand-500 transition-colors">Competitor Intelligence</Link></li>
              <li><Link href="/" className="hover:text-brand-500 transition-colors">SWOT Matrix Generator</Link></li>
              <li><Link href="/" className="hover:text-brand-500 transition-colors">Automated Pitch Deck</Link></li>
            </ul>
          </div>

          {/* Tech Stack / Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Built With
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-brand-400" /> Next.js 16 (Turbopack)</li>
              <li className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-accent-cyan" /> OpenAI GPT-4o Engine</li>
              <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-accent-emerald" /> NextAuth & MongoDB</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} IdeaValidator AI. Built for high-velocity founders.</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
