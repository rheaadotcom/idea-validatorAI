'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trash2, ChevronRight, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
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
    if (!confirm('Are you sure you want to delete this idea?')) return;

    try {
      const res = await fetch(`/api/ideas/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Idea deleted');
        setIdeas(ideas.filter((i) => i._id !== id));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="loader text-primary-600"></div>
        <p className="text-gray-500 font-medium">Loading your ideas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-gray-500">View and manage your validated startup ideas</p>
        </div>
        <Link 
          href="/" 
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20"
        >
          New Validation
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">No ideas yet</h2>
          <p className="text-gray-500 mt-2">Start by validating your first startup idea!</p>
          <Link href="/" className="text-primary-600 font-semibold mt-4 inline-block hover:underline">
            Validate an idea &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Link 
              key={idea._id} 
              href={`/idea/${idea._id}`}
              className="group bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all hover:-translate-y-1 relative"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold group-hover:text-primary-600 transition-colors line-clamp-1">
                    {idea.title}
                  </h2>
                  <button 
                    onClick={(e) => handleDelete(e, idea._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm">
                  {idea.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                  <div className="flex items-center text-xs text-gray-400 space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{format(new Date(idea.createdAt), 'MMM d, yyyy')}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BarChart3 className="w-3 h-3" />
                      <span>Score: {idea.analysis?.profitability_score}%</span>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
              
              {/* Risk Badge on Card */}
              <div className={`absolute top-0 right-12 px-2 py-1 text-[10px] font-bold rounded-b-md ${
                idea.analysis?.risk_level === 'Low' ? 'bg-green-100 text-green-700' :
                idea.analysis?.risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {idea.analysis?.risk_level} Risk
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
