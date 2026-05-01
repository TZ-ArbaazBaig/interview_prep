import React, { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isFormValid = email.includes('@') && password.length >= 8;

  const handleGoogleSignIn = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        navigate('/');
      } else {
        setError('Additional verification required.');
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-none">
            Vault <span className="text-violet-500 italic">AI</span>
          </h1>
          <p className="text-silver-400 text-sm font-medium tracking-wide">
            Welcome back. Please sign in to continue.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-lg space-y-6">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-3 px-4 rounded-sm font-bold text-sm hover:bg-gray-100 transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-obsidian-800"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-silver-600 uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-obsidian-800"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-500">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-800 border border-obsidian-700 rounded-sm px-4 py-3 text-silver-100 placeholder:text-silver-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                placeholder="name@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-500">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-obsidian-800 border border-obsidian-700 rounded-sm px-4 py-3 text-silver-100 placeholder:text-silver-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm pr-12"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-600 hover:text-violet-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-sm">
                <p className="text-rose-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-4 rounded-sm font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 ${
                isFormValid && !loading
                  ? 'bg-violet-500 text-white hover:bg-violet-600 shadow-violet-glow active:scale-95'
                  : 'bg-obsidian-700 text-silver-600 cursor-not-allowed grayscale'
              }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-obsidian-800">
            <p className="text-silver-500 text-[10px] font-mono font-bold uppercase tracking-widest">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-violet-400 hover:text-violet-300 transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
