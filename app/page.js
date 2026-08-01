'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Rocket, Loader2, Sparkles, LogIn, TrendingUp, Users, Target, ShieldCheck, Presentation, 
  ArrowRight, CheckCircle2, Zap, BarChart3, ChevronRight, Layers, Flame, AlertCircle, 
  Check, Star, HelpCircle, ChevronDown, Cpu, Activity, ShieldAlert
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const SAMPLE_PRESETS = [
  {
    title: "AI Personal Chef App",
    desc: "Mobile app connecting users with AI meal plans & local prep chefs.",
  },
  {
    title: "Micro-SaaS Churn Analytics",
    desc: "Stripe bot predicting user cancellation risk 30 days in advance.",
  },
  {
    title: "Autonomous Code Security Agent",
    desc: "GitHub bot performing automated SAST audits & dependency patches.",
  },
  {
    title: "Telehealth Biofeedback Portal",
    desc: "Wearable-integrated stress tracking & licensed therapist matching.",
  }
];

const FEATURES = [
  {
    icon: TrendingUp,
    badge: "TAM & SAM Forecasts",
    title: "Global Market Sizing",
    desc: "Provides real-world estimates of TAM, SAM, and SOM alongside 5-year CAGR growth trajectories.",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400"
  },
  {
    icon: Users,
    badge: "Competitor Radar",
    title: "Competitor Intelligence",
    desc: "Identifies incumbents, market share, weaknesses, and maps your key unfair advantage.",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400"
  },
  {
    icon: Target,
    badge: "Strategic Matrix",
    title: "Dynamic SWOT Analysis",
    desc: "Generates a 4-quadrant matrix detailing Strengths, Weaknesses, Opportunities, and Threats.",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400"
  },
  {
    icon: Presentation,
    badge: "Investor Deck",
    title: "10-Slide Pitch Generator",
    desc: "Outputs complete investor slides covering Problem, Solution, Traction, Market, and Financials.",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400"
  },
  {
    icon: BarChart3,
    badge: "Risk Index",
    title: "Profitability & Risk Scoring",
    desc: "Calculates an objective 0-100% profitability score with a Low/Medium/High risk classification.",
    color: "from-rose-500/20 to-red-500/20 text-rose-400"
  },
  {
    icon: Cpu,
    badge: "Architecture Stack",
    title: "Recommended Tech Stack",
    desc: "Suggests optimal frontend, backend, database, AI models, and payment providers for your MVP.",
    color: "from-brand-500/20 to-indigo-500/20 text-brand-400"
  }
];

const TESTIMONIALS = [
  {
    quote: "IdeaValidator saved us 3 months of wasted engineering. We discovered our target market was too saturated before writing a line of code.",
    author: "Elena Rostova",
    role: "Y Combinator Founder",
    company: "DevFlow AI",
    avatar: "E"
  },
  {
    quote: "The 10-slide pitch deck generator gave us our exact seed round narrative. We raised $1.2M within 4 weeks.",
    author: "Marcus Chen",
    role: "CEO & Co-founder",
    company: "BioPulse Health",
    avatar: "M"
  },
  {
    quote: "The competitor radar mapped differentiation we hadn't even considered. Absolutely essential tool for indie hackers.",
    author: "David Miller",
    role: "Indie Hacker",
    company: "SaaSBuilder",
    avatar: "D"
  }
];

const FAQS = [
  {
    q: "How does Idea Validator AI evaluate my startup concept?",
    a: "Our AI engine analyzes your title and description against thousands of real-world market benchmarks, industry reports, competitor databases, and financial models to calculate market size, risk, and profitability score."
  },
  {
    q: "Do I need my own OpenAI API key?",
    a: "No! Idea Validator AI comes with built-in access to specialized GPT-4o models. If no key is set in environment, it runs in intelligent demonstration mode."
  },
  {
    q: "Can I export reports and pitch decks as PDF?",
    a: "Yes! Every validated report and 10-slide pitch deck can be exported as a clean, print-ready PDF for investor pitch meetings."
  },
  {
    q: "Is my startup idea kept private and secure?",
    a: "Yes. Your startup concepts are stored securely in your private account dashboard and are never shared or used to train public models."
  }
];

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  const handlePresetSelect = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
    toast.success(`Loaded preset: "${preset.title}"`, { icon: '✨' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.error('Please fill in both title and description');

    setLoading(true);
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        toast.error('Server returned an invalid response. Please try again.');
        return;
      }

      if (data.success) {
        if (data.demo) {
          toast('⚡ Demo Mode — AI API unavailable. Showing illustrative analysis.', {
            icon: '🔬',
            duration: 5000,
            style: { background: '#12141d', color: '#f8fafc', border: '1px solid #1e293b' },
          });
        } else {
          toast.success('Idea validated successfully!');
        }
        router.push(`/idea/${data.data._id}`);
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-32">

      {/* ───────────────────────────────────────────── */}
      {/* 1. HERO SECTION WITH FLOATING CARDS           */}
      {/* ───────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 flex flex-col items-center text-center space-y-10">
        
        {/* Ambient Glowing Background Blobs */}
        <div className="absolute -top-32 inset-x-0 h-[500px] bg-radial-gradient pointer-events-none -z-10 opacity-70" />
        <div className="absolute top-10 left-10 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />

        {/* Floating Glass Badges (Desktop decorative) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex items-center space-x-2 absolute top-24 left-4 glass-card px-4 py-2 rounded-2xl border-brand-500/30 text-xs font-semibold shadow-glow-primary pointer-events-none animate-bounce"
          style={{ animationDuration: '6s' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-200">Profitability: 92% (Unicorn Tier)</span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hidden lg:flex items-center space-x-2 absolute top-32 right-4 glass-card px-4 py-2 rounded-2xl border-accent-cyan/30 text-xs font-semibold shadow-glow-cyan pointer-events-none animate-bounce"
          style={{ animationDuration: '7s' }}
        >
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-200">Market TAM: $300B+ (14% CAGR)</span>
        </motion.div>

        {/* Hero Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="cyan" icon={Zap}>
            <span>Next.js 16 & OpenAI GPT-4o Powered Intelligence</span>
          </Badge>
        </motion.div>

        {/* Large Gradient Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6 max-w-4xl"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            Validate Your Startup Idea <br />
            <span className="text-gradient">Before You Build.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Get instant institutional-grade market forecasts, competitor radar positioning, SWOT matrix, and 10-slide investor decks in under 4 seconds.
          </p>
        </motion.div>

        {/* AI Input Form Command Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-3xl glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-glow-primary border border-slate-200 dark:border-slate-800/80 relative text-left"
        >
          <div className="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

          {/* Preset Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Quick Startup Presets
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">Click to load</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(preset)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 transition-all border border-slate-200/50 dark:border-slate-700/50 hover:scale-[1.02] active:scale-95"
                >
                  ✨ {preset.title}
                </button>
              ))}
            </div>
          </div>

          {status === 'loading' ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-xs text-slate-500 font-medium">Initializing AI Validation Models...</p>
            </div>
          ) : session ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  1. Startup Concept Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI-Powered Personal Chef App"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none text-sm font-medium transition-all"
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Describe the Solution & Target Market
                </label>
                <textarea
                  placeholder="What problem does it solve? Who pays for it? What is your core technology or differentiator?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none min-h-[120px] text-sm font-medium leading-relaxed resize-none transition-all"
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="shiny"
                size="lg"
                loading={loading}
                icon={Sparkles}
                className="w-full font-bold shadow-glow-primary"
              >
                {loading ? 'Running AI Market Simulation...' : 'Generate Full Validation Report'}
              </Button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto border border-brand-500/20 shadow-glow-primary">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to Generate Unlimited Reports</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Save concepts to your private portfolio, track profitability scores, and export PDF pitch decks.
                </p>
              </div>
              <Link href="/login" className="inline-block">
                <Button variant="shiny" size="lg" icon={LogIn}>
                  Sign In / Register Free
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 2. PROBLEM SECTION                             */}
      {/* ───────────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="danger" icon={ShieldAlert}>The Startup Dilemma</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why 90% of Early-Stage Startups Fail
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Founders waste months and thousands of dollars building software before discovering critical market flaws.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Building Without Validation",
              desc: "Spending 6 months coding an MVP only to realize there is zero market demand or paying customers.",
              icon: AlertCircle,
              color: "text-rose-500"
            },
            {
              title: "Blindsided by Incumbents",
              desc: "Ignoring existing competitors who possess larger distribution networks and superior capital.",
              icon: Users,
              color: "text-amber-500"
            },
            {
              title: "Unprepared Investor Pitching",
              desc: "Lacking realistic market TAM/SAM sizing and institutional SWOT metrics when presenting to VCs.",
              icon: Presentation,
              color: "text-cyan-500"
            }
          ].map((problem, idx) => (
            <Card key={idx} className="space-y-4">
              <problem.icon className={`w-8 h-8 ${problem.color}`} />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{problem.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{problem.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 3. HOW IT WORKS (3-STEP PROCESS)              */}
      {/* ───────────────────────────────────────────── */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 space-y-12 border-slate-200 dark:border-slate-800">
        <div className="text-center space-y-3">
          <Badge variant="cyan" icon={Zap}>Streamlined Workflow</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            From Idea to Investor Deck in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Prompt Your Concept",
              desc: "Enter your startup title, target problem, and proposed solution into our command input."
            },
            {
              step: "02",
              title: "AI Market Simulation",
              desc: "GPT-4o benchmark models evaluate market size, competitor moves, tech stack, and risk profile."
            },
            {
              step: "03",
              title: "Deploy & Pitch",
              desc: "Receive your objective profitability score, 4-quadrant SWOT matrix, and 10-slide investor deck."
            }
          ].map((item, idx) => (
            <div key={idx} className="space-y-4 relative">
              <div className="text-5xl font-black text-brand-500/20 font-mono">{item.step}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 4. AI FEATURES GRID                           */}
      {/* ───────────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="violet" icon={Layers}>Comprehensive Feature Suite</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered for High-Velocity Founders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <Card key={idx} className="space-y-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center border border-white/10`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <Badge variant="outline">{feat.badge}</Badge>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feat.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 5. TESTIMONIALS & SOCIAL PROOF                */}
      {/* ───────────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="cyan" icon={Star}>Trusted by 10,000+ Founders</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by Founders & Product Managers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <Card key={idx} className="space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.author}</h4>
                  <p className="text-[10px] text-slate-400">{t.role} • {t.company}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 6. PRICING TIERS                               */}
      {/* ───────────────────────────────────────────── */}
      <section className="space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="success" icon={Check}>Transparent Pricing</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple Plans for Every Stage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Free Tier */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <Badge variant="outline">Starter</Badge>
              <div className="text-3xl font-black text-slate-900 dark:text-white">$0 <span className="text-xs font-normal text-slate-400">/ forever</span></div>
              <p className="text-xs text-slate-500">Perfect for exploring your initial concepts.</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 3 AI Validations / month</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Basic Profitability Score</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Standard SWOT Matrix</li>
            </ul>
            <Link href="/register" className="block">
              <Button variant="outline" size="md" className="w-full">Get Started Free</Button>
            </Link>
          </Card>

          {/* Pro Tier (Popular) */}
          <Card className="space-y-6 border-brand-500/50 shadow-glow-primary relative">
            <div className="absolute -top-3 right-6">
              <Badge variant="cyan">Most Popular</Badge>
            </div>
            <div className="space-y-2">
              <Badge variant="cyan">Pro Founder</Badge>
              <div className="text-3xl font-black text-slate-900 dark:text-white">$29 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-500">For serious builders raising capital.</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited AI Validations</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Automated 10-Slide Pitch Decks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Print-Ready PDF Export</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Full Competitor Radar & Market TAM</li>
            </ul>
            <Link href="/register" className="block">
              <Button variant="shiny" size="md" className="w-full">Start Pro Trial</Button>
            </Link>
          </Card>

          {/* Enterprise Tier */}
          <Card className="space-y-6">
            <div className="space-y-2">
              <Badge variant="violet">Enterprise</Badge>
              <div className="text-3xl font-black text-slate-900 dark:text-white">$99 <span className="text-xs font-normal text-slate-400">/ month</span></div>
              <p className="text-xs text-slate-500">For venture studios & accelerators.</p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Everything in Pro</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated OpenAI Fine-tuned Models</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> REST API Access & Webhooks</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Team Seats & Multi-User Admin</li>
            </ul>
            <Link href="/register" className="block">
              <Button variant="outline" size="md" className="w-full">Contact Sales</Button>
            </Link>
          </Card>

        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 7. FAQ ACCORDION                               */}
      {/* ───────────────────────────────────────────── */}
      <section className="space-y-12 max-w-3xl mx-auto">
        <div className="text-center space-y-3">
          <Badge variant="cyan" icon={HelpCircle}>Frequently Asked Questions</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <Card key={idx} hoverEffect={false} className="p-5 border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-3 border-t border-slate-200/60 dark:border-slate-800/60 mt-3"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ───────────────────────────────────────────── */}
      {/* 8. CALL TO ACTION (CTA)                       */}
      {/* ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden glass-card rounded-3xl p-12 sm:p-16 text-center space-y-6 border-brand-500/40">
        <div className="absolute inset-0 bg-radial-gradient opacity-60 pointer-events-none" />
        <Badge variant="cyan" icon={Sparkles}>Instant Startup Intelligence</Badge>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Start Validating Your Startup Concept Today
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Stop guessing and start building with empirical market benchmarks and AI insights.
        </p>
        <div className="pt-4">
          <Link href={session ? "/dashboard" : "/register"}>
            <Button variant="shiny" size="xl" icon={ArrowRight}>
              {session ? "Open Your Dashboard" : "Start Validating Free Now"}
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
