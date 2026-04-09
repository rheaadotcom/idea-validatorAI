'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Printer, Target, Users, TrendingUp, ShieldAlert, Cpu, Award, Layers, Presentation, Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function IdeaDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPitch, setGeneratingPitch] = useState(false);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await fetch(`/api/ideas/${id}`);
        const data = await res.json();
        if (data.success) {
          setIdea(data.data);
        } else {
          toast.error(data.error || 'Idea not found');
          router.push('/dashboard');
        }
      } catch (error) {
        toast.error('Failed to load idea');
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  const generatePitchDeck = async () => {
    setGeneratingPitch(true);
    try {
      const res = await fetch(`/api/ideas/${id}/pitch`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setIdea({ ...idea, pitchDeck: data.data });
        toast.success('Pitch Deck generated!');
      } else {
        toast.error(data.error || 'Failed to generate pitch deck');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setGeneratingPitch(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        <p className="text-gray-500 font-medium">Fetching analysis...</p>
      </div>
    );
  }

  if (!idea) return null;

  const { analysis, pitchDeck } = idea;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-500 hover:text-primary-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4 mr-2" />
          Export as PDF
        </button>
      </motion.div>

      {/* Main Content Card */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {/* Title Section */}
        <div className="p-8 md:p-12 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-primary-600 font-bold tracking-wider text-xs uppercase">Startup Idea Analysis</span>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                {idea.title}
              </h1>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-400 text-sm mb-2 font-medium">Profitability Score</span>
              <div className="flex items-center space-x-3">
                <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.profitability_score}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-primary-600"
                  />
                </div>
                <span className="text-2xl font-bold text-primary-600">{analysis.profitability_score}%</span>
              </div>
            </div>
          </div>
          <p className="mt-8 text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic border-l-4 border-primary-200 pl-4">
            "{idea.description}"
          </p>
        </div>

        {/* Analysis Grid */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section: Problem & Market */}
          <div className="space-y-10">
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3 text-primary-600">
                <Target className="w-6 h-6" />
                <h3 className="text-xl font-bold">The Problem</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {analysis.problem}
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3 text-blue-600">
                <Users className="w-6 h-6" />
                <h3 className="text-xl font-bold">Target Customer</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {analysis.customer}
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3 text-indigo-600">
                <TrendingUp className="w-6 h-6" />
                <h3 className="text-xl font-bold">Market Opportunity</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {analysis.market}
              </p>
            </motion.section>
          </div>

          {/* Section: Competitors & Tech */}
          <div className="space-y-10">
            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3 text-red-600">
                <ShieldAlert className="w-6 h-6" />
                <h3 className="text-xl font-bold">Risk Assessment</h3>
              </div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-bold ${getRiskColor(analysis.risk_level)}`}>
                {analysis.risk_level} Risk Level
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-2">
                {analysis.justification}
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3 text-amber-600">
                <Layers className="w-6 h-6" />
                <h3 className="text-xl font-bold">Competitors</h3>
              </div>
              <div className="space-y-3">
                {analysis.competitor.map((comp, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                    <p className="font-bold text-gray-900 dark:text-white">{comp.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="text-primary-600 font-semibold italic">Differentiator:</span> {comp.difference}
                    </p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <div className="flex items-center space-x-3 text-emerald-600">
                <Cpu className="w-6 h-6" />
                <h3 className="text-xl font-bold">Suggested Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.tech_stack.map((tech, idx) => (
                  <span 
                    key={idx}
                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1 rounded-lg text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-8 bg-gray-50 dark:bg-gray-800/30 border-y border-gray-100 dark:border-gray-800">
          <div className="flex items-start space-x-4">
            <div className="bg-primary-600 p-2 rounded-lg mt-1">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Analyst Verdict</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Based on current market trends and the proposed solution, this idea shows 
                <span className="font-bold mx-1 text-primary-600 underline decoration-2 underline-offset-4">
                  {analysis.profitability_score > 70 ? 'strong potential' : 
                   analysis.profitability_score > 40 ? 'moderate potential' : 'challenging viability'}
                </span> 
                in the current landscape. Focus on the core differentiator to gain early traction.
              </p>
            </div>
          </div>
        </div>
        
        {/* Pitch Deck Section */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center space-x-3 text-purple-600">
              <Presentation className="w-6 h-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">AI Pitch Deck</h3>
            </div>
            {!pitchDeck && (
              <button
                onClick={generatePitchDeck}
                disabled={generatingPitch}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-purple-500/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 no-print"
              >
                {generatingPitch ? <span className="flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Generating...</span> : 'Generate 10-Slide Deck'}
              </button>
            )}
          </div>

          {pitchDeck && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {pitchDeck.slides?.map((slide) => (
                <div key={slide.slide_number} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-bl-[100px] -z-0"></div>
                  <div className="relative z-10">
                    <span className="text-purple-600 font-black text-4xl opacity-20 absolute -top-4 -left-2">
                      {slide.slide_number}
                    </span>
                    <h4 className="font-bold text-lg mb-3 pl-6">{slide.title}</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-6">
                      {slide.content}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
