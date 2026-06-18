import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Trash2, Mail, Clock, ShieldAlert, AlertTriangle } from 'lucide-react';

const DeleteAccount = () => {
  return (
    <div className="relative min-h-screen bg-obsidian-950 text-silver-100 font-sans py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-6 text-center md:text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-silver-400 opacity-50 hover:text-violet-400 transition-colors">
            <ChevronLeft size={14} />
            Back to Base
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-mono font-bold uppercase tracking-wider mb-3">
                <ShieldAlert size={12} />
                Account Deletion Request
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tighter uppercase leading-none">
                Delete <span className="text-rose-500 italic">Account</span>
              </h1>
            </div>
            <p className="text-xs font-mono font-bold text-silver-400/30 uppercase tracking-widest self-end">
              Effective: June 17, 2026
            </p>
          </div>
        </div>

        {/* Content Panel */}
        <div className="glass-panel p-8 sm:p-12 rounded-lg space-y-10 border border-obsidian-800 shadow-2xl bg-obsidian-900/40">
          
          {/* Overview */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-rose-500 rounded-full" />
              Account Deletion
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              At <strong>Vault AI (InterviewPrep)</strong>, we respect your right to control your personal data. If you wish to delete your account and all associated data, you can request deletion at any time — even if you have uninstalled the app or no longer have access to your password.
            </p>
          </section>

          {/* How to Request Deletion */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              How to Request Account Deletion
            </h2>
            <div className="space-y-6">
              <div className="chrome-card p-6 rounded-md bg-obsidian-800/60 border border-obsidian-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-1">
                    <Mail size={20} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-mono font-bold uppercase tracking-wider text-xs text-white">Send an Email Request</h3>
                    <p className="text-[11px] text-silver-400 leading-relaxed">
                      To request the deletion of your account and all associated data, send an email to:
                    </p>
                    <a 
                      href="mailto:arbaazbaig98@gmail.com?subject=Account%20Deletion%20Request%20-%20Vault%20AI&body=Hi%2C%0A%0AI%20would%20like%20to%20request%20the%20deletion%20of%20my%20Vault%20AI%20account%20and%20all%20associated%20data.%0A%0AMy%20registered%20email%3A%20%5Byour%20email%20here%5D%0A%0AThank%20you."
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-sm bg-violet-500/10 border border-violet-500/20 text-violet-400 font-mono font-bold text-xs uppercase tracking-widest hover:bg-violet-500/20 hover:text-violet-300 transition-all"
                    >
                      <Mail size={14} />
                      arbaazbaig98@gmail.com
                    </a>
                    <p className="text-[11px] text-silver-500 leading-relaxed">
                      Please include the email address you used to register your Vault AI account so we can locate and process your request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="chrome-card p-6 rounded-md bg-obsidian-800/60 border border-obsidian-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 mt-1">
                    <Trash2 size={20} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-mono font-bold uppercase tracking-wider text-xs text-white">In-App Deletion</h3>
                    <p className="text-[11px] text-silver-400 leading-relaxed">
                      If you still have access to your account, you can delete it directly from the app's Settings page or via the "Delete Account" button in the web dashboard footer. This will immediately and permanently remove all your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Processing Timeline */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              Processing Timeline
            </h2>
            <div className="chrome-card p-6 rounded-md bg-obsidian-800/60 border border-obsidian-700">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                  <Clock size={20} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-mono font-bold uppercase tracking-wider text-xs text-white">7 Business Days</h3>
                  <p className="text-[11px] text-silver-400 leading-relaxed">
                    Email-based deletion requests will be processed and completed within <strong className="text-white">7 business days</strong> of receipt. You will receive a confirmation email once your data has been permanently removed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What Gets Deleted */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-rose-500 rounded-full" />
              Data That Will Be Permanently Deleted
            </h2>
            <div className="bg-rose-500/5 border border-rose-500/20 p-6 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <AlertTriangle size={20} />
                <span className="font-mono font-bold uppercase tracking-widest text-xs">Irreversible Action</span>
              </div>
              <p className="text-silver-300 text-sm leading-relaxed">
                Upon account deletion, the following data is <strong className="text-rose-400">permanently and irreversibly</strong> removed from our systems:
              </p>
              <ul className="list-disc list-inside text-xs text-silver-400 space-y-2 pl-2">
                <li>Your profile and registration credentials in Clerk authentication.</li>
                <li>Your primary user entity in our MongoDB database.</li>
                <li>All historical mock interview sessions and generated questions.</li>
                <li>All performance evaluations, scores, and AI-generated feedback.</li>
                <li>Any RAG context or temporary data associated with your account.</li>
              </ul>
              <p className="text-[11px] text-rose-400 italic">
                *This operation is destructive and cannot be undone. All data is purged permanently from our database and authentication provider.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-3">
              <div className="h-4 w-1 bg-violet-500 rounded-full" />
              Questions?
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed">
              If you have any questions about the deletion process or our data handling practices, please reach out via email: <a href="mailto:arbaazbaig98@gmail.com" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">arbaazbaig98@gmail.com</a>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
