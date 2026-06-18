import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronLeft, Lock, Trash2, Database, Eye } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="relative min-h-screen bg-obsidian-950 text-silver-100 font-sans py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-silver-400 opacity-50 hover:text-violet-400 transition-colors">
            <ChevronLeft size={14} />
            Back to Base
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[9px] font-mono font-bold uppercase tracking-wider mb-3">
                <Shield size={12} />
                Compliance Protocol Active
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
                Privacy <span className="text-violet-500 italic">Policy</span>
              </h1>
            </div>
            <p className="text-xs font-mono font-bold text-silver-400/30 uppercase tracking-widest self-end">
              Effective: June 17, 2026
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="glass-panel p-8 sm:p-12 rounded-lg space-y-10 border border-obsidian-800 shadow-2xl bg-obsidian-900/40">
          
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              1. Overview & Data Security
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              At <strong>Vault AI (InterviewPrep)</strong>, we prioritize the protection and security of your personal data. This document outlines how we collect, store, share, and manage your information when you access our mock interview preparation platform both via our web dashboard and Google Play Store mobile applications.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              2. Data We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="chrome-card p-6 rounded-md bg-obsidian-800/60 border border-obsidian-700">
                <Lock className="text-violet-400 mb-3" size={20} />
                <h3 className="font-mono font-bold uppercase tracking-wider text-xs text-white mb-2">Auth Metadata</h3>
                <p className="text-[11px] text-silver-400 leading-relaxed">
                  Email addresses, name variables, and profile pictures synchronized securely through Clerk identity providers.
                </p>
              </div>
              <div className="chrome-card p-6 rounded-md bg-obsidian-800/60 border border-obsidian-700">
                <Database className="text-violet-400 mb-3" size={20} />
                <h3 className="font-mono font-bold uppercase tracking-wider text-xs text-white mb-2">Practice Logs</h3>
                <p className="text-[11px] text-silver-400 leading-relaxed">
                  Pasted job descriptions, AI-generated questions, candidate answers, performance scoring, and feedback.
                </p>
              </div>
              <div className="chrome-card p-6 rounded-md bg-obsidian-800/60 border border-obsidian-700">
                <Eye className="text-violet-400 mb-3" size={20} />
                <h3 className="font-mono font-bold uppercase tracking-wider text-xs text-white mb-2">RAG Context</h3>
                <p className="text-[11px] text-silver-400 leading-relaxed">
                  Temporary, in-memory keyword indexing segments created from your uploaded job descriptions for the contextual chat.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              3. Processing via Artificial Intelligence
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              Your job descriptions and mock interview responses are securely processed via the <strong>Groq API</strong> using the <strong>Llama-3.3-70b-versatile</strong> model. These interactions are strictly query-response pipelines. Groq does not retain your transcripts or personal data to train public models.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-rose-500 rounded-full" />
              4. Data Retention & Permanent Deletion Policy
            </h2>
            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <Trash2 size={20} />
                <span className="font-mono font-bold uppercase tracking-widest text-xs">Purge Protection Enabled</span>
              </div>
              <p className="text-silver-300 text-sm leading-relaxed">
                In compliance with Google Play Store User Data policies, users can initiate immediate and permanent deletion of their account and all associated data.
              </p>
              <h4 className="font-mono font-bold uppercase tracking-wider text-xs text-white">How to execute deletion:</h4>
              <p className="text-silver-300 text-sm leading-relaxed">
                You can delete your account inside the mobile app settings or by clicking the <strong>Delete Account</strong> option next to your avatar in the web dashboard header. This action completely deletes:
              </p>
              <ul className="list-disc list-inside text-xs text-silver-400 space-y-2 pl-2">
                <li>Your profile and registration credentials in Clerk.</li>
                <li>Your primary User entity in our database.</li>
                <li>All historical mock sessions, generated questions, and cumulative performance scores.</li>
              </ul>
              <p className="text-[11px] text-rose-400 italic">
                *Caution: This operation is destructive and cannot be undone. All data is purged permanently from our database.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              5. Contacts & Inquiries
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              If you have any questions or data protection queries regarding our policies or third-party SDK implementations (Clerk, MongoDB), reach out via email: <span className="text-violet-400 font-bold">arbaazbaig98@gmail.com</span>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
