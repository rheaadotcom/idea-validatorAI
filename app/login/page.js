'use client';

import { useState } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Lightbulb, LogIn, Lock, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const router = useRouter();

  // Load CSRF token on mount
  useEffect(() => {
    (async () => {
      const token = await getCsrfToken();
      setCsrfToken(token ?? '');
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      csrfToken,
    });

    if (res?.error) {
      toast.error('Invalid email or password');
      setLoading(false);
    } else {
      toast.success('Logged in successfully!');
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="py-12 flex flex-col items-center justify-center min-h-[75vh]">
      <Card className="w-full max-w-md p-8 sm:p-10 space-y-8 glass-card border-slate-200 dark:border-slate-800 shadow-glow-primary relative">
        <div className="absolute -top-px inset-x-8 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center mx-auto border border-brand-500/20 shadow-glow-primary">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to access your validated startup reports</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
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
            icon={LogIn}
            className="w-full pt-3"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        {/* Footer link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-brand-500 hover:underline font-semibold">
            Create one free →
          </Link>
        </p>
      </Card>
    </div>
  );
}
