import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import JobDescForm from '../components/JobDescForm';
import { useApi } from '../hooks/useApi';

const Home = () => {
  const navigate = useNavigate();
  const api = useApi();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (jobDescription) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post('/sessions', { jobDescription });
      navigate(`/practice/${data.sessionId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 pt-10 pb-20 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative w-full max-w-4xl text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-mono font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            AI Interview Generator Active
          </div>
          <h1 className="text-5xl sm:text-8xl font-display font-black tracking-tighter text-white leading-[0.9]">
            ACE YOUR <br />
            <span className="text-violet-500 italic uppercase">INTERVIEW.</span>
          </h1>
          <p className="text-silver-300 max-w-2xl mx-auto text-base sm:text-lg font-medium leading-relaxed">
            Paste any job description and let our AI generate tailored questions to help you practice and get hired faster.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full glass-panel p-1 rounded-xl shadow-2xl shadow-black/50"
        >
          <div className="bg-obsidian-900/40 rounded-lg p-6 sm:p-10 text-left">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              Job Description
            </h2>
            <JobDescForm onSubmit={handleSubmit} loading={loading} error={error} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
