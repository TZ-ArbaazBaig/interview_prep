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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-primary-200 to-primary-500">
          Ace Your Next <br className="hidden sm:block" /> Technical Interview
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
          Paste a job description and our AI will generate tailored interview questions and provide expert-level feedback on your practice answers.
        </p>
      </div>

      {/* Form Section */}
      <div className="mb-24">
        <div className="relative rounded-3xl bg-slate-900/50 p-1 ring-1 ring-slate-800 shadow-2xl">
          <div className="rounded-[22px] bg-slate-950 p-6 sm:p-10">
            <JobDescForm 
              onSubmit={handleGenerateQuestions} 
              loading={loading} 
              error={error} 
            />
          </div>
          
          {/* Decorative gradients */}
          <div className="absolute -top-12 -left-12 -z-10 h-64 w-64 bg-primary-500/10 blur-[100px]" />
          <div className="absolute -bottom-12 -right-12 -z-10 h-64 w-64 bg-primary-600/10 blur-[100px]" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-colors group">
            <div className="mb-4 p-3 rounded-xl bg-slate-800 w-fit group-hover:bg-primary-500/10 transition-colors">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
