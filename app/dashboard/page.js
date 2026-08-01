'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Trash2, ChevronRight, BarChart3, Clock, AlertCircle, PlusCircle, Search, Filter, 
  Sparkles, TrendingUp, ShieldCheck, Download, Share2, Compass, Layers, Zap, CheckCircle2, User as UserIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

import Sidebar from '@/components/dashboard/Sidebar';
import AnimatedCounter from '@/components/dashboard/AnimatedCounter';
import dynamic from 'next/dynamic';

const AnalyticsCharts = dynamic(() => import('@/components/dashboard/AnalyticsCharts'), { ssr: false, loading: () => <CardSkeleton /> });
const ActivityFeed = dynamic(() => import('@/components/dashboard/ActivityFeed'), { ssr: false, loading: () => <CardSkeleton /> });
const AISuggestions = dynamic(() => import('@/components/dashboard/AISuggestions'), { ssr: false, loading: () => <CardSkeleton /> });

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [activeView, setActiveView] = useState('overview');

  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas');
      const data = await res.json();
      if (data.success) {
        setIdeas(data.data);
      } else {
        toast.error(data.error || 'Failed to load ideas');
      }
    } catch (error) {
      toast.error('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchIdeas();
    }
  }, [status, router]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this validated idea?')) return;

    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Idea deleted');
        setIdeas(ideas.filter((i) => i._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete idea');
    }
  };

  // Export Portfolio Data as JSON file
  const handleExportData = () => {
    if (ideas.length === 0) return toast.error('No validation reports to export');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ideas, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `startup_portfolio_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Exported portfolio JSON report!', { icon: '📊' });
  };

  // Filter & Search Logic
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());

    const risk = idea.analysis?.risk_level?.toUpperCase() || 'MEDIUM';
    const matchesRisk = riskFilter === 'ALL' || risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  // Calculate Metrics
  const avgScore = ideas.length > 0 
    ? Math.round(ideas.reduce((acc, curr) => acc + (curr.analysis?.profitability_score || 0), 0) / ideas.length)
    : 0;

  const highPotentialCount = ideas.filter(i => (i.analysis?.profitability_score || 0) >= 70).length;
  const lowRiskCount = ideas.filter(i => i.analysis?.risk_level === 'Low').length;

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
        <div className="w-full lg:w-64 h-96 glass-card rounded-[20px] animate-pulse" />
        <div className="flex-1 space-y-6">
          <div className="h-20 glass-card rounded-[20px] animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-start gap-8 animate-fade-in">

      {/* ───────────────────────────────────────────── */}
      {/* 1. STICKY SIDEBAR                             */}
      {/* ───────────────────────────────────────────── */}
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        totalCount={ideas.length} 
      />

      {/* ───────────────────────────────────────────── */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                */}
      {/* ───────────────────────────────────────────── */}
      <main className="flex-1 w-full space-y-8 min-w-0">

        {/* Top Greeting & Action Header */}
        <div className="glass-card rounded-[20px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="space-y-1.5 z-10">
            <div className="flex items-center space-x-2 text-brand-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Market Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Good day, {session?.user?.name || 'Founder'} 👋
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg">
              Monitoring 12,450+ real-time market data points across tech, health, and fintech ecosystems.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10">
            <Button variant="outline" size="sm" onClick={handleExportData} icon={Download}>
              Export Data
            </Button>
            <Link href="/">
              <Button variant="shiny" size="sm" icon={PlusCircle}>
                New Validation
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Statistics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Total Validations */}
          <Card className="space-y-3 relative overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reports</span>
              <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center border border-brand-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <AnimatedCounter value={ideas.length} />
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Active Portfolio</span>
            </div>
          </Card>

          {/* Card 2: Avg Profitability */}
          <Card className="space-y-3 relative overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Profitability</span>
              <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center border border-accent-cyan/20">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <AnimatedCounter value={avgScore} suffix="%" />
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Benchmark Index</span>
            </div>
          </Card>

          {/* Card 3: High Potential Ideas */}
          <Card className="space-y-3 relative overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Potential</span>
              <div className="w-8 h-8 rounded-xl bg-accent-emerald/10 text-accent-emerald flex items-center justify-center border border-accent-emerald/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <AnimatedCounter value={highPotentialCount} />
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Score &gt;= 70%</span>
            </div>
          </Card>

          {/* Card 4: Low Risk Ratio */}
          <Card className="space-y-3 relative overflow-hidden border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Risk Count</span>
              <div className="w-8 h-8 rounded-xl bg-accent-violet/10 text-accent-violet flex items-center justify-center border border-accent-violet/20">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              <AnimatedCounter value={lowRiskCount} />
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-violet-400 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Optimal Safety</span>
            </div>
          </Card>

        </div>

        {/* Render Active View Tab */}
        {activeView === 'overview' && (
          <div className="space-y-8">
            
            {/* Interactive Charts */}
            <AnalyticsCharts ideas={ideas} />

            {/* AI Opportunities Panel */}
            <AISuggestions />

            {/* Search & Portfolio Grid */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-[20px] border-slate-200 dark:border-slate-800">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ideas... (⌘K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-400 mr-2 hidden sm:inline">Risk:</span>
                  {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setRiskFilter(level)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                        riskFilter === level
                          ? 'bg-brand-600 text-white shadow-glow-primary'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {level === 'ALL' ? 'All Risks' : `${level}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Idea Cards */}
              {ideas.length === 0 ? (
                <EmptyState
                  title="No startup ideas validated yet"
                  description="Transform your raw thoughts into actionable startup blueprints using our AI engine."
                  actionHref="/"
                  actionText="Validate Your First Idea"
                />
              ) : filteredIdeas.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-[20px] space-y-2">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold">No matching ideas found</h3>
                  <p className="text-xs text-slate-500">Try clearing your search query or filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredIdeas.map((idea) => {
                    const score = idea.analysis?.profitability_score || 0;
                    const risk = idea.analysis?.risk_level || 'Medium';

                    const riskVariant = 
                      risk === 'Low' ? 'success' :
                      risk === 'Medium' ? 'warning' : 'danger';

                    return (
                      <Link key={idea._id} href={`/idea/${idea._id}`} className="block group">
                        <Card className="h-full flex flex-col justify-between space-y-4 relative border-slate-200 dark:border-slate-800">
                          
                          <div className="space-y-2.5">
                            <div className="flex items-start justify-between gap-3">
                              <h2 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                                {idea.title}
                              </h2>
                              <button
                                onClick={(e) => handleDelete(e, idea._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Idea"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {idea.description}
                            </p>
                          </div>

                          <div className="space-y-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-slate-400 font-medium">Profitability:</span>
                                <span className={`font-extrabold ${
                                  score >= 70 ? 'text-emerald-500' :
                                  score >= 40 ? 'text-amber-500' : 'text-rose-500'
                                }`}>
                                  {score}%
                                </span>
                              </div>
                              <Badge variant={riskVariant}>{risk} Risk</Badge>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{format(new Date(idea.createdAt), 'MMM d, yyyy')}</span>
                              </span>
                              <span className="flex items-center space-x-1 text-brand-500 font-semibold group-hover:translate-x-1 transition-transform">
                                <span>View Report</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>

                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <ActivityFeed ideas={ideas} />

          </div>
        )}

        {/* Tab View: Portfolio */}
        {activeView === 'portfolio' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Full Ideas Portfolio ({ideas.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <Link key={idea._id} href={`/idea/${idea._id}`}>
                  <Card className="h-full space-y-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{idea.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{idea.description}</p>
                    <div className="pt-2 flex justify-between items-center text-xs">
                      <Badge variant="cyan">Score: {idea.analysis?.profitability_score || 0}%</Badge>
                      <span className="text-brand-400 font-semibold">Open Report &rarr;</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tab View: Market Velocity */}
        {activeView === 'trends' && (
          <AnalyticsCharts ideas={ideas} />
        )}

        {/* Tab View: AI Opportunities */}
        {activeView === 'suggestions' && (
          <AISuggestions />
        )}

        {/* Tab View: Activity Feed */}
        {activeView === 'activity' && (
          <ActivityFeed ideas={ideas} />
        )}

      </main>

    </div>
  );
}
