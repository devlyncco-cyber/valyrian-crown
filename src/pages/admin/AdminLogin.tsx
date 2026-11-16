import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/common/Logo';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { toast } from 'sonner';

export const AdminLogin: React.FC = () => {
  const { signIn, demoLoginAsAdmin, resetPassword, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  // If already logged in as admin, redirect to dashboard
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Invalid administrator credentials');
        toast.error('Sign-in failed. Please check your credentials.');
      } else {
        toast.success('Welcome back, Administrator!');
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your administrator email.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        setResetSent(true);
        toast.success('Password reset link sent to your email.');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLoginAsAdmin();
    toast.success('Signed in with Demo Administrator privileges!');
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo variant="white" showTagline={false} />
        <div className="mt-4 flex items-center justify-center gap-2 text-brand-gold">
          <Shield className="w-5 h-5" />
          <h2 className="text-sm font-heading font-bold uppercase tracking-widest text-neutral-200">
            Administrator Portal
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-neutral-900 py-8 px-6 sm:px-10 shadow-2xl rounded-xl border border-neutral-800 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded flex items-start gap-2.5 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isResetMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@valyriancrown.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] font-heading text-brand-gold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In as Administrator'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Registered Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@valyriancrown.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              {resetSent ? (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded text-emerald-300 text-xs">
                  A reset link has been dispatched to your email.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-heading font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Send Reset Link
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full text-center text-xs font-heading text-neutral-400 hover:text-white"
              >
                Return to Login
              </button>
            </form>
          )}

          {/* Quick Demo Bypass */}
          <div className="pt-4 border-t border-neutral-800">
            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full py-2.5 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/80 rounded font-heading text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-brand-gold" />
              <span>Enter in One-Click Admin Mode</span>
            </button>
            {!isSupabaseConfigured && (
              <p className="text-[10px] text-neutral-500 text-center mt-2 leading-relaxed">
                Supabase credentials not yet provided in .env. Click above to explore full admin CRUD with local data persistence.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-heading text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            ← Return to ValyrianCrown Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
