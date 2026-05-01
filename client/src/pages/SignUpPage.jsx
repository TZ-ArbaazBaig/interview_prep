import React, { useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApi } from '../hooks/useApi';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const api = useApi();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  
  const navigate = useNavigate();

  const isCodeValid = code.length === 6;

  // Real-time password strength checks
  const passwordChecks = {
    length: password.length >= 10,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);
  const isFormValid = firstName.trim() && lastName.trim() && email.includes('@') && isPasswordStrong;

  const handleGoogleSignUp = () => {
    if (!isLoaded) return;
    signUp.authenticateWithRedirect({
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
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError('');

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        
        // Sync to MongoDB
        try {
          await api.post('/users/sync', {
            email,
            firstName,
            lastName
          });
        } catch (syncErr) {
          console.error('Failed to sync user to DB:', syncErr);
        }
        
        navigate('/');
      } else {
        setError('Verification failed.');
      }
    } catch (err) {
      setError(err.errors ? err.errors[0].message : 'Invalid code.');
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
            {pendingVerification ? 'Verify your email' : 'Create your account to start.'}
          </p>
        </div>

        {!pendingVerification ? (
          <div className="glass-panel p-8 rounded-lg space-y-6">
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-obsidian-800 border border-obsidian-700 rounded-sm px-4 py-3 text-silver-100 placeholder:text-silver-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-obsidian-800 border border-obsidian-700 rounded-sm px-4 py-3 text-silver-100 placeholder:text-silver-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

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
                  Password (Min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-obsidian-800 border border-obsidian-700 rounded-sm px-4 py-3 text-silver-100 placeholder:text-silver-600 focus:outline-none focus:border-violet-500/50 transition-all text-sm pr-12"
                    placeholder="Create a password"
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
                
                {/* Password Strength Checklist */}
                {password.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-2">
                    <p className={`text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 ${passwordChecks.length ? 'text-emerald-400' : 'text-silver-600'}`}>
                      {passwordChecks.length ? '✓' : '○'} 10+ Characters
                    </p>
                    <p className={`text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 ${passwordChecks.upper ? 'text-emerald-400' : 'text-silver-600'}`}>
                      {passwordChecks.upper ? '✓' : '○'} Uppercase
                    </p>
                    <p className={`text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 ${passwordChecks.number ? 'text-emerald-400' : 'text-silver-600'}`}>
                      {passwordChecks.number ? '✓' : '○'} Number
                    </p>
                    <p className={`text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 ${passwordChecks.special ? 'text-emerald-400' : 'text-silver-600'}`}>
                      {passwordChecks.special ? '✓' : '○'} Symbol
                    </p>
                  </div>
                )}
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
                    Sign Up <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-4 border-t border-obsidian-800">
              <p className="text-silver-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-violet-400 hover:text-violet-300 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="glass-panel p-8 rounded-lg space-y-6">
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-2">
                <ShieldCheck size={24} />
              </div>
              <p className="text-xs font-medium text-silver-300 px-4">
                Enter the code sent to <span className="text-white font-bold">{email}</span>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-silver-500 text-center block">
                6-Digit Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-obsidian-800 border border-obsidian-700 rounded-sm px-4 py-4 text-center text-2xl font-display font-black tracking-[0.5em] text-violet-400 placeholder:text-silver-700 focus:outline-none focus:border-violet-500/50 transition-all"
                placeholder="000000"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-sm">
                <p className="text-rose-400 font-mono text-[10px] uppercase tracking-widest leading-relaxed text-center">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isCodeValid || loading}
              className={`w-full py-4 rounded-sm font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all duration-500 ${
                isCodeValid && !loading
                  ? 'bg-violet-500 text-white hover:bg-violet-600 shadow-violet-glow active:scale-95'
                  : 'bg-obsidian-700 text-silver-600 cursor-not-allowed grayscale'
              }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Verify Account <ArrowRight size={18} />
                </>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => setPendingVerification(false)}
              className="w-full text-[10px] font-mono font-bold uppercase tracking-widest text-silver-500 hover:text-violet-400 transition-colors"
            >
              Back to Registration
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
