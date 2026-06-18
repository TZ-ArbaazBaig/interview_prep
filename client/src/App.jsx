import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { useApi } from './hooks/useApi';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Practice from './pages/Practice';
import MockInterview from './pages/MockInterview';
import History from './pages/History';
import Results from './pages/Results';
import Chat from './pages/Chat';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import DeleteAccount from './pages/DeleteAccount';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

/* ── Footer with Delete Account ──────────────────────────── */
function AppFooter() {
  const navigate = useNavigate();
  const { user } = useUser();
  const api = useApi();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      // 1. Delete all user data in MongoDB (evaluations → questions → sessions → user)
      await api.delete('/users');

      // 2. Delete the Clerk user profile (auto logs out)
      await user.delete();

      setShowDeleteModal(false);
      navigate('/sign-in');
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleteError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <footer className="border-t border-slate-900 py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-5">
          {/* Policy links */}
          <div className="flex justify-center gap-6 text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
            <Link to="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link>
            <span className="opacity-20">•</span>
            <Link to="/terms" className="hover:text-violet-400 transition-colors">Terms & Conditions</Link>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Vault AI. Built for developers by developers.
          </p>

          {/* Delete Account — at the very bottom */}
          <div className="pt-4 border-t border-slate-900/60">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-sm transition-all"
              id="delete-account-btn"
            >
              <Trash2 size={14} />
              Delete Account
            </button>
          </div>
        </div>
      </footer>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-panel max-w-md w-full p-8 rounded-lg border border-obsidian-700 bg-obsidian-900/90 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-display font-black text-white uppercase tracking-wider">
                Delete Account?
              </h2>
              <p className="text-sm text-silver-300 leading-relaxed">
                This will <strong className="text-rose-400">permanently</strong> delete your profile, all practice sessions, question history, evaluations, and scores. This action <strong className="text-rose-400">cannot be undone</strong>.
              </p>
            </div>

            {deleteError && (
              <div className="mt-4 p-4 rounded-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wide">
                {deleteError}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <button
                disabled={deleteLoading}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-sm font-mono font-bold uppercase tracking-widest text-[10px] bg-obsidian-800 text-silver-200 border border-obsidian-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteLoading}
                onClick={handleDeleteAccount}
                className="flex-1 py-3 rounded-sm font-display font-black uppercase tracking-widest text-xs bg-rose-500 text-white hover:bg-rose-600 shadow-rose-glow flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Main App ────────────────────────────────────────────── */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - sign in and sign up */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        
        {/* All other routes are protected */}
        <Route path="/*" element={
          <>
            <SignedIn>
              <div className="min-h-screen bg-obsidian-950 font-sans">
                <Navbar />
                <main className="relative">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/practice/:sessionId" element={<Practice />} />
                    <Route path="/mock/:sessionId" element={<MockInterview />} />
                    <Route path="/results/:sessionId" element={<Results />} />
                    <Route path="/chat/:sessionId" element={<Chat />} />
                  </Routes>
                </main>
                
                {/* Global Footer with Delete Account at bottom */}
                <AppFooter />
              </div>
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn 
                signInFallbackRedirectUrl="/sign-in"
                signInForceRedirectUrl="/"
              />
            </SignedOut>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

