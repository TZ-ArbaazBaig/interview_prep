import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ChevronLeft, AlertOctagon, Scale, ShieldAlert } from 'lucide-react';

const TermsAndConditions = () => {
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
                <FileText size={12} />
                User Agreement Active
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
                Terms & <span className="text-violet-500 italic">Conditions</span>
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
              1. Acceptance of Terms
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              By accessing or using the <strong>Vault AI (InterviewPrep)</strong> platform (via the web dashboard or our mobile application published on the Google Play Store), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please terminate your access to the service immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              2. Scope of Services & Fair Use
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              Vault AI provides automated mock interview generation, job description context extraction using RAG (Retrieval-Augmented Generation), scoring analytics, and interactive chats.
            </p>
            <p className="text-silver-300 text-sm leading-relaxed">
              You agree to use this platform for personal, non-commercial interview preparation. You must not attempt to scrape interview data, overload the API limits, inject malicious payloads, or abuse the free tiers of service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              3. AI Performance & Disclaimers
            </h2>
            <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-md space-y-3">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertOctagon size={20} />
                <span className="font-mono font-bold uppercase tracking-widest text-xs">AI Evaluation Disclaimer</span>
              </div>
              <p className="text-silver-300 text-sm leading-relaxed">
                All questions, evaluations, grading scores, and better answer models are generated dynamically by artificial intelligence. 
              </p>
              <ul className="list-disc list-inside text-xs text-silver-400 space-y-1 pl-2">
                <li>Scores and feedback are automated recommendations, not professional evaluations.</li>
                <li>We do not guarantee that practicing on our platform will secure employment or guarantee matching questions in live corporate interviews.</li>
                <li>AI models can occasionally hallucinate or output inaccurate text. Users should cross-reference suggestions with standard engineering best practices.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              4. User Accounts & Identity Checks
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              We leverage <strong>Clerk</strong> to handle user registration and secure session tokens. You are responsible for keeping your login credentials confidential. We reserve the right to suspend or terminate accounts that violate system protocols or engage in abusive activities.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              5. Limitation of Liability
            </h2>
            <div className="bg-obsidian-800/60 border border-obsidian-700 p-6 rounded-md flex gap-4">
              <div className="text-violet-400 flex-shrink-0">
                <Scale size={24} />
              </div>
              <p className="text-xs text-silver-400 leading-relaxed">
                Vault AI, its developers, and partners shall not be held liable for any indirect, incidental, or consequential damages resulting from your use of, or inability to use, our platform, including but not limited to server downtime, AI generation errors, or loss of historical performance logs.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              6. Modifications to Terms
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              We reserve the right to modify these Terms and Conditions at any time. Your continued use of the platform following modifications constitutes acceptance of the updated terms.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
