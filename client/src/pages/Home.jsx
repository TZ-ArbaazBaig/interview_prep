import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, Award, Zap } from 'lucide-react';
import JobDescForm from '../components/JobDescForm';
import { useApi } from '../hooks/useApi';

const Home = () => {
  const navigate = useNavigate();
  const { request, loading, error } = useApi();

  const handleGenerateQuestions = async (jobDescription) => {
    try {
      const data = await request({
        method: 'POST',
        url: '/sessions',
        data: { jobDescription }
      });
      navigate(`/practice/${data.sessionId}`);
    } catch (err) {
      // Error handled by useApi
    }
  };

  const features = [
    {
      icon: <Target className="text-primary-400" size={24} />,
      title: "Role-Specific",
      desc: "Questions generated specifically for your target job description."
    },
    {
      icon: <Sparkles className="text-primary-400" size={24} />,
      title: "AI Feedback",
      desc: "Get real-time scores and improvement suggestions for your answers."
    },
    {
      icon: <Award className="text-primary-400" size={24} />,
      title: "Model Answers",
      desc: "Learn what a perfect answer looks like with AI-generated examples."
    },
    {
      icon: <Zap className="text-primary-400" size={24} />,
      title: "Fast Tracking",
      desc: "Prepare for any interview in minutes instead of days."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-24 space-y-8 animate-in">
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl text-parchment-50 font-serif italic">
          Master the <br className="hidden sm:block" /> 
          <span className="text-copper-500 font-sans not-italic">Technical Art</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-parchment-200/40 leading-relaxed font-light tracking-wide">
          An elite AI-driven preparation chamber. Refine your narrative, sharpen your logic, and command the room.
        </p>
      </div>

      {/* Form Section */}
      <div className="mb-32">
        <div className="relative rounded-xl bg-ink-800/40 p-1 border border-ink-700 shadow-2xl overflow-hidden">
          <div className="rounded-lg bg-ink-900/60 p-6 sm:p-12 backdrop-blur-sm">
            <JobDescForm 
              onSubmit={handleGenerateQuestions} 
              loading={loading} 
              error={error} 
            />
          </div>
          
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -left-24 -z-10 h-96 w-96 bg-copper-900/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-24 -right-24 -z-10 h-96 w-96 bg-copper-700/5 blur-[120px] rounded-full" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="p-8 rounded-lg bg-ink-800/20 border border-ink-800 hover:border-copper-900/30 transition-all duration-700 group cursor-default">
            <div className="mb-6 p-4 rounded-md bg-ink-800 w-fit group-hover:bg-copper-700/10 group-hover:text-copper-500 transition-all duration-500 text-parchment-200/20">
              {f.icon}
            </div>
            <h3 className="text-xs font-black text-parchment-50 mb-3 uppercase tracking-[0.2em]">{f.title}</h3>
            <p className="text-xs text-parchment-200/30 leading-relaxed font-medium uppercase tracking-wider">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
