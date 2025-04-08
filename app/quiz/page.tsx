"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizManager } from "@/hooks/useQuizManager";
import { useAuthContext } from "@/contexts/AuthContext";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { Icons } from "@/components/ui/icons";

interface QuizQuestion {
  id: string;
  questionText: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  correctAnswer: number;
}

interface QuizData {
  title: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { isAuthenticated } = useAuthContext();
  const { getQuizDetails, saveQuizResult } = useQuizManager();

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
            id: q.id,
            questionText: q.question,
            options: q.options.map((opt: string, index: number) => ({
              id: `${q.id}-${index}`,
              text: opt,
            })),
            correctAnswer: q.options.findIndex(
              (opt: string) => opt === q.correct_answer
            ),
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

  const handleQuizComplete = async (answers: Record<string, number>) => {
    if (!quizId || !quizData) return;

    try {
      // Calculate score
      const totalQuestions = quizData.questions.length;
      const correctAnswers = quizData.questions.reduce((count, q) => {
        return answers[q.id] === q.correctAnswer ? count + 1 : count;
      }, 0);
      const score = (correctAnswers / totalQuestions) * 100;

      // Convert answers to strings for database
      const stringAnswers = Object.entries(answers).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: value.toString(),
        }),
        {} as Record<string, string>
      );

      // Save quiz result
      await saveQuizResult(quizId, score, stringAnswers);

      // Clear session storage
      sessionStorage.removeItem("currentQuizId");
    } catch (err: any) {
      console.error("Error saving quiz result:", err);
      setError(err.message || "Failed to save quiz result");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-14">
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
      <div className="container mx-auto px-4 py-8 mt-14">
        <div className="flex justify-center">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4 py-6 sm:px-6 mt-14">
      <QuizContainer
        quizData={quizData}
        onQuizComplete={handleQuizComplete}
        onReset={() => router.push("/")}
      />
    </div>
  );
}
