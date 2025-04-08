import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { QuestionnaireTracker } from "@/utils/questionnaire-tracker";
import { QuestionnaireResult } from "@/types/questionnaire";

export function useQuestionnaireState() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasCompletedFree, setHasCompletedFree] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [userResults, setUserResults] = useState<QuestionnaireResult[]>([]);

  useEffect(() => {
    // Check auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        // Load user's questionnaire results
        const results = await QuestionnaireTracker.getUserResults(
          session.user.id
        );
        setUserResults(results);
      } else {
        setUserResults([]);
      }
    });

    // Check local questionnaire status
    setHasCompletedFree(QuestionnaireTracker.hasCompletedFree());
    setShowPrompt(QuestionnaireTracker.shouldShowPrompt());
    setIsLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const markQuestionnaireComplete = async (
    type: string,
    answers: Record<string, any>
  ) => {
    if (!hasCompletedFree) {
      QuestionnaireTracker.markFreeCompleted();
      setHasCompletedFree(true);
      setShowPrompt(true);
    }

    await QuestionnaireTracker.saveResult({
      questionnaire_type: type,
      answers,
      userId: user?.id,
    });

    if (user) {
      const results = await QuestionnaireTracker.getUserResults(user.id);
      setUserResults(results);
    }
  };

  const dismissPrompt = () => {
    QuestionnaireTracker.dismissPrompt();
    setShowPrompt(false);
  };

  return {
    isLoading,
    user,
    hasCompletedFree,
    showPrompt,
    userResults,
    markQuestionnaireComplete,
    dismissPrompt,
  };
}
