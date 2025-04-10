import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './useToast';

const supabase = createClient();

interface UserProfile {
  quizzes_taken: number;
  last_quiz_at: string;
}

export interface UseQuizLimitsReturn {
  canCreateQuiz: boolean;
  remainingQuizzes: number;
  isLoading: boolean;
  checkQuizLimit: () => Promise<boolean>;
  incrementQuizCount: () => Promise<void>;
  getAnonymousQuizCount: () => number;
}

const DAILY_LIMIT = 1;
const ANONYMOUS_LIMIT = 1;

export function useQuizLimits(): UseQuizLimitsReturn {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get anonymous quiz count from localStorage
  const getAnonymousQuizCount = useCallback(() => {
    if (typeof window === 'undefined') return 0;
    const count = localStorage.getItem('anonymousQuizCount');
    const date = localStorage.getItem('anonymousQuizDate');
    const today = new Date().toISOString().split('T')[0];

    // Reset count if it's a new day
    if (date !== today) {
      localStorage.setItem('anonymousQuizCount', '0');
      localStorage.setItem('anonymousQuizDate', today);
      return 0;
    }

    return parseInt(count || '0');
  }, []);

  // Increment anonymous quiz count
  const incrementAnonymousCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    const count = getAnonymousQuizCount();
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('anonymousQuizCount', (count + 1).toString());
    localStorage.setItem('anonymousQuizDate', today);
  }, [getAnonymousQuizCount]);

  // Fetch user profile for authenticated users
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('quizzes_taken, last_quiz_at')
          .eq('id', user?.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        // Check if it's a new day since last quiz
        const lastQuizDate = data.last_quiz_at ? new Date(data.last_quiz_at).toISOString().split('T')[0] : null;
        const today = new Date().toISOString().split('T')[0];

        if (lastQuizDate !== today) {
          // Reset quiz count for new day
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({
              quizzes_taken: 0,
              last_quiz_at: new Date().toISOString()
            })
            .eq('id', user?.id);

          if (updateError) {
            console.error('Error resetting quiz count:', updateError);
            return;
          }

          setUserProfile({ quizzes_taken: 0, last_quiz_at: new Date().toISOString() });
        } else {
          setUserProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user?.id, isAuthenticated]);

  // Check if user can create a quiz
  const checkQuizLimit = useCallback(async () => {
    if (!isAuthenticated) {
      const anonymousCount = getAnonymousQuizCount();
      return anonymousCount < ANONYMOUS_LIMIT;
    }

    return (userProfile?.quizzes_taken || 0) < DAILY_LIMIT;
  }, [isAuthenticated, userProfile, getAnonymousQuizCount]);

  // Increment quiz count
  const incrementQuizCount = useCallback(async () => {
    if (!isAuthenticated) {
      incrementAnonymousCount();
      return;
    }

    try {
      const newCount = (userProfile?.quizzes_taken || 0) + 1;

      const { error } = await supabase
        .from('user_profiles')
        .update({
          quizzes_taken: newCount,
          last_quiz_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) {
        console.error('Error incrementing quiz count:', error);
        return;
      }

      setUserProfile(prev => ({
        ...prev!,
        quizzes_taken: newCount,
        last_quiz_at: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error incrementing quiz count:', error);
    }
  }, [isAuthenticated, userProfile, user?.id, incrementAnonymousCount]);

  const remainingQuizzes = isAuthenticated
    ? DAILY_LIMIT - (userProfile?.quizzes_taken || 0)
    : ANONYMOUS_LIMIT - getAnonymousQuizCount();

  return {
    canCreateQuiz: isAuthenticated 
      ? (userProfile?.quizzes_taken || 0) < DAILY_LIMIT
      : getAnonymousQuizCount() < ANONYMOUS_LIMIT,
    remainingQuizzes,
    isLoading,
    checkQuizLimit,
    incrementQuizCount,
    getAnonymousQuizCount,
  };
} 