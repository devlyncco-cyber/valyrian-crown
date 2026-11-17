import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/common/Logo';
import { toast } from 'sonner';

export const AdminLogin: React.FC = () => {
  const { signIn, resetPassword, isAdmin } = useAuth();
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

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo variant="dark" showTagline={false} />
        <div className="mt-4 flex items-center justify-center gap-2 text-[#777777]">
          <Shield className="w-4 h-4 text-[#111111]" />
          <h2 className="text-xs uppercase font-mono tracking-widest text-[#111111]">
            Administrator Portal
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-[1px] border border-[#EAEAEA] space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-[1px] flex items-start gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isResetMode ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@valyriancrown.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsResetMode(true)}
                    className="text-[11px] text-[#777777] hover:text-[#111111] hover:underline"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
              >
                <span>{isLoading ? 'Verifying...' : 'Sign In as Administrator'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Registered Admin Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@valyriancrown.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              {resetSent ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[1px] text-emerald-800 text-xs">
                  A reset link has been dispatched to your email.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  Send Reset Link
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="w-full text-center text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111] pt-1"
              >
                Return to Login
              </button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-wider text-[#777777] hover:text-[#111111] transition-colors"
          >
            ← Return to ValyrianCrown Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
