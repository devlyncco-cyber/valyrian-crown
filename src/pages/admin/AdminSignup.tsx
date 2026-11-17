import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/common/Logo';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { toast } from 'sonner';

export const AdminSignup: React.FC = () => {
  const { signUpAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // If already authenticated as admin, offer direct dashboard redirect
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUpAdmin(email.trim(), password, fullName.trim());

      if (error) {
        setErrorMsg(error.message);
        toast.error(`Setup error: ${error.message}`);
      } else {
        setIsSuccess(true);
        toast.success('Administrator account registered successfully!');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo variant="dark" showTagline={false} />
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-[1px] bg-white border border-[#EAEAEA] text-[#111111] text-xs font-mono tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Initial Admin Setup</span>
        </div>
        <h2 className="mt-2 text-xl font-heading font-medium uppercase tracking-tight text-[#111111]">
          Create Administrator Account
        </h2>
        <p className="text-xs text-[#777777] mt-1 max-w-sm mx-auto">
          Register the primary brand administrator in Supabase Authentication to grant full dashboard privileges.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm rounded-[1px] border border-[#EAEAEA] space-y-6">
          {/* Temporary Notice */}
          <div className="p-3.5 bg-[#FAFAF8] border border-[#EAEAEA] rounded-[1px] text-[#111111] text-xs leading-relaxed flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-[#111111] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-[#111111]">
                Setup Note
              </p>
              <p className="text-[11px] text-[#777777] mt-0.5">
                This page creates an account with <code className="font-mono text-[#111111]">role: 'admin'</code> in your database. Once registered, sign into the console.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-[1px] flex items-start gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-[1px] bg-[#FAFAF8] text-[#111111] border border-[#EAEAEA] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-heading font-medium text-[#111111] uppercase tracking-wider">
                Admin Account Registered
              </h3>
              <p className="text-xs text-[#777777] leading-relaxed max-w-xs mx-auto">
                Your administrator profile has been created with email <strong className="text-[#111111]">{email}</strong>.
              </p>
              {isSupabaseConfigured && (
                <p className="text-[11px] text-[#777777]">
                  If email confirmation is enabled in Supabase, verify your inbox. Otherwise, log in immediately.
                </p>
              )}
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Proceed to Admin Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Valyrian Founder"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <User className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Admin Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. founder@valyriancrown.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <Mail className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Create Password * (min. 6 characters)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-[#111111] mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#EAEAEA] rounded-[1px] text-xs text-[#111111] placeholder:text-[#777777]/60 focus:outline-none focus:border-[#111111]"
                  />
                  <Lock className="w-4 h-4 text-[#777777] absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#262626] text-white rounded-[1px] text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-40 mt-2"
              >
                <span>{isLoading ? 'Creating Administrator...' : 'Create Admin Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
            <Link
              to="/admin/login"
              className="text-[#777777] hover:text-[#111111] transition-colors uppercase tracking-wider"
            >
              Sign In Instead
            </Link>
            <Link
              to="/"
              className="text-[#777777] hover:text-[#111111] transition-colors uppercase tracking-wider"
            >
              Storefront →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
