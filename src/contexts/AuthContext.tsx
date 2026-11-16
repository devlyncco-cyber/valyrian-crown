import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/services/supabase/client';
import { Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  demoLoginAsAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_ADMIN_PROFILE: Profile = {
  id: 'a1000000-0000-0000-0000-000000000001',
  full_name: 'Valyrian Founder',
  email: 'admin@valyriancrown.com',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user & profile
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Check if local demo admin session exists
      const localAdmin = localStorage.getItem('valyrian_demo_admin_session');
      if (localAdmin) {
        try {
          const parsed = JSON.parse(localAdmin);
          setProfile(parsed);
          setUser({ id: parsed.id, email: parsed.email } as any);
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoading(false);
      return;
    }

    // 1. Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        console.warn('Profile fetch note:', error);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo admin check
      if (email.toLowerCase().includes('admin') || password.length >= 6) {
        const demoUser = {
          ...DEMO_ADMIN_PROFILE,
          email,
          full_name: email.split('@')[0],
        };
        localStorage.setItem('valyrian_demo_admin_session', JSON.stringify(demoUser));
        setProfile(demoUser);
        setUser({ id: demoUser.id, email } as any);
        return { error: null };
      }
      return { error: new Error('Invalid demo credentials. Use admin@valyriancrown.com') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('valyrian_demo_admin_session');
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    return { error };
  };

  const demoLoginAsAdmin = () => {
    localStorage.setItem('valyrian_demo_admin_session', JSON.stringify(DEMO_ADMIN_PROFILE));
    setProfile(DEMO_ADMIN_PROFILE);
    setUser({ id: DEMO_ADMIN_PROFILE.id, email: DEMO_ADMIN_PROFILE.email } as any);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isAdmin,
        isLoading,
        signIn,
        signOut,
        resetPassword,
        demoLoginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
