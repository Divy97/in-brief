import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from './useToast';

const supabase = createClient();

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  quizzes_taken: number;
  last_quiz_at: string | null;
  is_premium: boolean;
  subscription_tier: string;
  subscription_expires_at: string | null;
}

export interface UserPreferences {
  email_notifications: boolean;
  quiz_difficulty: string;
  theme: string;
}

export function useProfile() {
  const { user, isAuthenticated } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user profile and preferences
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details
          });
          
          // Only throw non-404 errors
          if (profileError.code !== 'PGRST116') {
            throw profileError;
          }
        }

        // If profile doesn't exist, create it
        if (!profileData) {
          console.log('Creating new profile for user:', user.id);
          const { data: newProfile, error: createError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              email: user.email,
              display_name: user.email?.split('@')[0],
              quizzes_taken: 0,
              is_premium: false,
              subscription_tier: 'free',
            })
            .select()
            .single();

          if (createError) {
            console.error('Profile creation error:', {
              code: createError.code,
              message: createError.message,
              details: createError.details
            });
            throw createError;
          }
          setProfile(newProfile);
        } else {
          setProfile(profileData);
        }

        // Fetch preferences
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (prefsError) {
          console.error('Preferences fetch error:', {
            code: prefsError.code,
            message: prefsError.message,
            details: prefsError.details
          });
          
          // Only throw non-404 errors
          if (prefsError.code !== 'PGRST116') {
            throw prefsError;
          }
        }

        // If preferences don't exist, create them
        if (!prefsData) {
          console.log('Creating new preferences for user:', user.id);
          const { data: newPrefs, error: createPrefsError } = await supabase
            .from('user_preferences')
            .insert({
              user_id: user.id,
              email_notifications: true,
              quiz_difficulty: 'medium',
              theme: 'dark',
            })
            .select()
            .single();

          if (createPrefsError) {
            console.error('Preferences creation error:', {
              code: createPrefsError.code,
              message: createPrefsError.message,
              details: createPrefsError.details
            });
            throw createPrefsError;
          }
          setPreferences(newPrefs);
        } else {
          setPreferences(prefsData);
        }
      } catch (err: any) {
        console.error('Profile/Preferences error:', {
          name: err.name,
          message: err.message,
          code: err.code,
          details: err.details,
          stack: err.stack
        });
        setError(err instanceof Error ? err : new Error(err.message || 'Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isAuthenticated]);

  // Update profile
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error updating profile',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      setProfile(data);
    } catch (err) {
      console.error('Error updating profile:', err);
      return;
    }
  }, [user?.id]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error updating preferences',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      setPreferences(data);
    } catch (err) {
      console.error('Error updating preferences:', err);
      return;
    }
  }, [user?.id]);

  return {
    profile,
    preferences,
    loading,
    error,
    updateProfile,
    updatePreferences,
  };
} 