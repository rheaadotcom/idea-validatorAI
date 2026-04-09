'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Loader2, Sparkles, LogIn } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return toast.error('Please fill in all fields');

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
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
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
    <div className="flex flex-col items-center justify-center space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Turn Your <span className="text-primary-600">Idea</span> Into a <span className="text-blue-600">Reality</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Get expert AI-powered analysis for your startup idea in seconds. 
          Real metrics, real competitors, real insights.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary-500 to-blue-500"></div>
        {status === 'loading' ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary-500" /></div>
        ) : session ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Startup Idea Title
              </label>
              <input
                type="text"
                placeholder="e.g. AI-Powered Personal Chef"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Describe your idea in detail
              </label>
              <textarea
                placeholder="How does it work? Who is it for? What problem does it solve?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none min-h-[150px]"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Validate Idea</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-12 space-y-6">
            <div className="bg-primary-100 dark:bg-primary-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-600">
              <Rocket className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Login to Validate Ideas</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Sign in to leverage our AI analyst and save your brilliant startup concepts to your personal dashboard.
              </p>
            </div>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary-500/30 transition-all active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5" />
              <span>Get Started</span>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
