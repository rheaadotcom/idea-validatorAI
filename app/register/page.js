'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Lightbulb, UserPlus, Lock, Mail, User as UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created! Logging in...');
        await signIn('credentials', { redirect: false, email, password });
        router.push('/dashboard');
        router.refresh();
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex flex-col items-center justify-center min-h-[75vh]">
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-8 glass-card border-slate-200 dark:border-slate-800 shadow-glow-primary relative">
        <div className="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto border border-brand-500/20 shadow-glow-primary">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Create Free Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join 10,000+ founders validating ideas with AI</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="founder@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Password (min 6 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 outline-none text-xs font-medium"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="shiny"
            size="lg"
            loading={loading}
            icon={UserPlus}
            className="w-full pt-3"
          >
            {loading ? 'Creating Account...' : 'Get Started Free'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-500 hover:underline font-semibold">
            Sign in &rarr;
          </Link>
        </p>
      </Card>
    </div>
  );
}
