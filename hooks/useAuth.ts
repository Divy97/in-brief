import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient();

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();

  // Initialize user session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error initializing auth:', error);
        setError(error as AuthError);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.refresh();
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  }, [router]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.refresh();
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  }, [router]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/protected/reset-password`,
      });
      if (error) throw error;
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      router.push('/');
    } catch (error) {
      setError(error as AuthError);
      throw error;
    }
  }, [router]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };
} 