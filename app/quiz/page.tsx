"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizWrapper } from "./QuizWrapper";
import { useQuizManager } from "@/hooks/useQuizManager";
import { useAuthContext } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

interface QuizData {
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
  }>;
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { isAuthenticated } = useAuthContext();
  const { getQuizDetails, saveQuizResult } = useQuizManager();
  const { profile } = useProfile();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Get quiz ID from session storage
        const storedQuizId = sessionStorage.getItem("currentQuizId");
        if (!storedQuizId) {
          router.push("/");
          return;
        }
        setQuizId(storedQuizId);

        // Load quiz details from database
        const { quiz, questions } = await getQuizDetails(storedQuizId);

        setQuizData({
          title: quiz.title,
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correct_answer: q.correct_answer,
            explanation: q.explanation,
          })),
        });
      } catch (err: any) {
        console.error("Error loading quiz:", err);
        setError(err.message || "Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [router, getQuizDetails]);

  const handleQuizComplete = async (answers: Record<string, string>) => {
    if (!quizId || !quizData) return;

    try {
      // Calculate score
      const totalQuestions = quizData.questions.length;
      const correctAnswers = quizData.questions.reduce((count, q, index) => {
        return answers[index.toString()] === q.correct_answer
          ? count + 1
          : count;
      }, 0);
      const score = (correctAnswers / totalQuestions) * 100;

      // Save quiz result
      await saveQuizResult(quizId, score, answers);

      // Clear session storage
      sessionStorage.removeItem("currentQuizId");
      sessionStorage.removeItem("quizData");

      // Redirect to results or prompt sign up
      if (!isAuthenticated) {
        router.push("/sign-up?redirect_to=/profile");
      } else {
        router.push("/profile");
      }
    } catch (err: any) {
      console.error("Error saving quiz result:", err);
      setError(err.message || "Failed to save quiz result");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !quizData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container m-auto px-4 py-8">
      <QuizWrapper
        quizData={quizData}
        onComplete={handleQuizComplete}
        userProfile={profile}
      />
    </div>
  );
}
