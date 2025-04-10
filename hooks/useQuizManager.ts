import { useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useQuizLimits } from './useQuizLimits';
import { toast } from './useToast';

const supabase = createClient();

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  topic: string;
  difficulty: string;
  is_public: boolean;
  created_at: string;
  user_id?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  user_id?: string;
  score: number;
  answers: Record<string, string>;
  created_at: string;
}

export function useQuizManager() {
  const { user, isAuthenticated } = useAuthContext();
  const { incrementQuizCount, checkQuizLimit } = useQuizLimits();

  // Create a new quiz
  const createQuiz = useCallback(async (
    quizData: Omit<Quiz, 'id' | 'created_at' | 'user_id'>
  ): Promise<string> => {
    const canCreate = await checkQuizLimit();
    if (!canCreate) {
      throw new Error('Quiz creation limit reached');
    }

    const quizInsertData = {
      ...quizData,
      user_id: user?.id,
    };

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert(quizInsertData)
      .select('id')
      .single();

    if (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }

    await incrementQuizCount();
    return quiz?.id;
  }, [user?.id, checkQuizLimit, incrementQuizCount]);

  // Save quiz questions
  const saveQuizQuestions = useCallback(async (
    quizId: string,
    questions: Omit<QuizQuestion, 'id'>[]
  ) => {
    const { error } = await supabase
      .from('quiz_questions')
      .insert(questions.map(q => ({ ...q, quiz_id: quizId })));

    if (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  // Save quiz result
  const saveQuizResult = useCallback(async (
    quizId: string,
    score: number,
    answers: Record<string, string>
  ) => {
    const { error } = await supabase
      .from('questionnaire_results')
      .insert({
        quiz_id: quizId,
        user_id: user?.id,
        score,
        answers,
        questionnaire_type: 'quiz'
      });

    if (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
      throw error;
    }
  }, [user?.id]);

  // Get quiz details
  const getQuizDetails = useCallback(async (quizId: string) => {
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError) throw quizError;

    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId);

    if (questionsError) throw questionsError;

    return { quiz, questions };
  }, []);

  // Get user's quiz history
  const getUserQuizHistory = useCallback(async () => {
    if (!isAuthenticated) return [];

    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questionnaire_results (
          score,
          created_at
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Something went wrong',
        description: 'Please try again later',
        variant: 'destructive',
      });
      return [];
    }

    return data;
  }, [user?.id, isAuthenticated]);

  return {
    createQuiz,
    saveQuizQuestions,
    saveQuizResult,
    getQuizDetails,
    getUserQuizHistory,
  };
} 