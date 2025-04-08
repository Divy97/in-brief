import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './useAuth';

const supabase = createClient();

interface QuizUsage {
  quizzes_created: number;
  last_created_at: string;
  date: string;
}

export interface UseQuizLimitsReturn {
  canCreateQuiz: boolean;
  remainingQuizzes: number;
  isLoading: boolean;
  checkQuizLimit: () => Promise<boolean>;
  incrementQuizCount: () => Promise<void>;
  getAnonymousQuizCount: () => number;
}

const DAILY_LIMIT = 3;
const ANONYMOUS_LIMIT = 1;

export function useQuizLimits(): UseQuizLimitsReturn {
  const { user, isAuthenticated } = useAuth();
  const [quizUsage, setQuizUsage] = useState<QuizUsage | null>(null);
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

    return parseInt(count || '0', 10);
  }, []);

  // Increment anonymous quiz count
  const incrementAnonymousCount = useCallback(() => {
    if (typeof window === 'undefined') return;
    const count = getAnonymousQuizCount();
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('anonymousQuizCount', (count + 1).toString());
    localStorage.setItem('anonymousQuizDate', today);
  }, [getAnonymousQuizCount]);

  // Fetch quiz usage for authenticated users
  useEffect(() => {
    const fetchQuizUsage = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('quiz_usage')
          .select('quizzes_created, last_created_at, date')
          .eq('user_id', user?.id)
          .eq('date', today)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching quiz usage:', error);
          return;
        }

        setQuizUsage(data || { quizzes_created: 0, last_created_at: new Date().toISOString(), date: today });
      } catch (error) {
        console.error('Error fetching quiz usage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizUsage();
  }, [user?.id, isAuthenticated]);

  // Check if user can create a quiz
  const checkQuizLimit = useCallback(async () => {
    if (!isAuthenticated) {
      const anonymousCount = getAnonymousQuizCount();
      return anonymousCount < ANONYMOUS_LIMIT;
    }

    // For authenticated users, check if we need to reset the count for a new day
    const today = new Date().toISOString().split('T')[0];
    if (quizUsage && quizUsage.date !== today) {
      // It's a new day, reset the count
      const { error } = await supabase
        .from('quiz_usage')
        .upsert({
          user_id: user?.id,
          date: today,
          quizzes_created: 0,
          last_created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error resetting quiz usage:', error);
        return false;
      }

      setQuizUsage({
        quizzes_created: 0,
        last_created_at: new Date().toISOString(),
        date: today,
      });

      return true;
    }

    return (quizUsage?.quizzes_created || 0) < DAILY_LIMIT;
  }, [isAuthenticated, quizUsage, user?.id, getAnonymousQuizCount]);

  // Increment quiz count
  const incrementQuizCount = useCallback(async () => {
    if (!isAuthenticated) {
      incrementAnonymousCount();
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newCount = (quizUsage?.quizzes_created || 0) + 1;

    try {
      const { error } = await supabase
        .from('quiz_usage')
        .upsert({
          user_id: user?.id,
          date: today,
          quizzes_created: newCount,
          last_created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setQuizUsage({
        quizzes_created: newCount,
        last_created_at: new Date().toISOString(),
        date: today,
      });
    } catch (error) {
      console.error('Error incrementing quiz count:', error);
      throw error;
    }
  }, [isAuthenticated, quizUsage, user?.id, incrementAnonymousCount]);

  const remainingQuizzes = isAuthenticated
    ? DAILY_LIMIT - (quizUsage?.quizzes_created || 0)
    : ANONYMOUS_LIMIT - getAnonymousQuizCount();

  return {
    canCreateQuiz: isAuthenticated 
      ? (quizUsage?.quizzes_created || 0) < DAILY_LIMIT
      : getAnonymousQuizCount() < ANONYMOUS_LIMIT,
    remainingQuizzes,
    isLoading,
    checkQuizLimit,
    incrementQuizCount,
    getAnonymousQuizCount,
  };
} 