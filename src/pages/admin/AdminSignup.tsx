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
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo variant="white" showTagline={false} />
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-heading font-medium tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5" />
          <span>Temporary Initial Admin Setup</span>
        </div>
        <h2 className="mt-2 text-xl font-heading font-bold uppercase tracking-tight text-white">
          Create Real Administrator
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
          Register the primary brand administrator in Supabase Authentication to grant full dashboard privileges.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-neutral-900 py-8 px-6 sm:px-10 shadow-2xl rounded-xl border border-neutral-800 space-y-6">
          {/* Temporary Notice */}
          <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-lg text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold text-amber-300">
                Setup Note
              </p>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                This page creates an account with <code className="font-bold">role: 'admin'</code> in your database. Once completed, you can manage the catalogue and invite other admins from inside the dashboard.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded flex items-start gap-2.5 text-red-200 text-xs">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider">
                Admin Account Registered!
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">
                Your administrator profile has been created with email <strong className="text-neutral-200">{email}</strong>.
              </p>
              {isSupabaseConfigured && (
                <p className="text-[11px] text-neutral-500">
                  If email confirmation is enabled in your Supabase project, check your inbox. Otherwise, you can log in right now.
                </p>
              )}
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="w-full py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury transition-all"
                >
                  <span>Proceed to Admin Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Valyrian Founder"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
                  Admin Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. founder@valyriancrown.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-heading font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-brand-gold"
                  />
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-black rounded font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-luxury transition-all disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Administrator...' : 'Create Admin Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs font-heading">
            <Link
              to="/admin/login"
              className="text-neutral-400 hover:text-brand-gold transition-colors"
            >
              Already have an account? Sign In
            </Link>
            <Link
              to="/"
              className="text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Storefront →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
