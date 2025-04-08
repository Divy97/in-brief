import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User, AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useToast } from './useToast';

const supabase = createClient();

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const router = useRouter();
  const { toast } = useToast();

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
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [toast]);

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      router.refresh();
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: 'Please check your credentials and try again',
      });
      setError(error as AuthError);
      return false;
    }
  }, [router, toast]);

  const signUp = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
        return false;
      }
      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      });
      return true;
    } catch (error) {
      setError(error as AuthError);
      return false;
    }
  }, [toast]);

  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Out Failed",
          description: error.message,
        });
        return false;
      }
      router.refresh();
      return true;
    } catch (error) {
      setError(error as AuthError);
      return false;
    }
  }, [router, toast]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/protected/reset-password`,
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Password Reset Failed",
          description: error.message,
        });
        return false;
      }
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for the password reset link.",
      });
      return true;
    } catch (error) {
      setError(error as AuthError);
      return false;   
    }
  }, [toast]);

  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    try {
      setError(null);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toast({
          variant: "destructive",
          title: "Password Update Failed",
          description: error.message,
        });
        return false;
      }
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      router.push('/');
      return true;
    } catch (error) {
      setError(error as AuthError);
      return false;
    }
  }, [router, toast]);

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