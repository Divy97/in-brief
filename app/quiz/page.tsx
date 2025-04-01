"use client"; // This page needs client-side logic for sessionStorage and state

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { type QuizData, type UserAnswers } from "@/types/quiz";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUIZ_DATA_SESSION_KEY = "quizData"; // Use the same key

export default function QuizPage() {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(QUIZ_DATA_SESSION_KEY);
      if (storedData) {
        const parsedData: QuizData = JSON.parse(storedData);
        // Basic validation (check if it has questions array)
        if (parsedData && Array.isArray(parsedData.questions)) {
          setQuizData(parsedData);
        } else {
          console.error("Invalid quiz data found in sessionStorage.");
          setError("Failed to load quiz data. Please try generating again.");
        }
      } else {
        // No data found, maybe direct navigation or data expired
        setError("No quiz data found. Please generate a quiz first.");
        // Optional: Redirect back immediately
        // router.replace('/');
      }
    } catch (err) {
      console.error("Failed to load or parse quiz data:", err);
      setError("An error occurred while loading the quiz.");
    } finally {
      setIsLoading(false);
    }

    // Optional: Clear sessionStorage when the user navigates away from the quiz page
    // This prevents stale data if they use back/forward buttons later.
    // return () => {
    //   sessionStorage.removeItem(QUIZ_DATA_SESSION_KEY);
    // };
  }, []); // Removed router dependency as it's not needed here anymore

  const handleQuizComplete = (answers: UserAnswers) => {
    console.log("Quiz completed on page:", answers);
    // TODO: Implement results display or navigation
    // Maybe store results in sessionStorage and navigate to /quiz/results
    // For now, we just show the completion state within QuizContainer
    sessionStorage.removeItem(QUIZ_DATA_SESSION_KEY); // Clean up after completion
  };

  const handleResetAndNavigateHome = () => {
    sessionStorage.removeItem(QUIZ_DATA_SESSION_KEY); // Clean up storage
    router.push("/"); // Navigate to homepage
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => router.push("/")} variant="outline">
          Go Home
        </Button>
      </div>
    );
  }

  if (!quizData) {
    // Should ideally be caught by the error state, but as a fallback:
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <p className="text-slate-600 mb-4">Could not load quiz.</p>
        <Button onClick={() => router.push("/")} variant="outline">
          Go Home
        </Button>
      </div>
    );
  }

  // --- Updated Render Logic ---
  return (
    // Use padding on the main container for spacing
    <main className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      {/* Quiz Header Section */}
      <div className="mb-8 md:mb-12 text-center border-b pb-4">
        <p className="text-sm text-slate-500 mb-1">Quiz based on:</p>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          {quizData.title}
        </h1>
      </div>

      {/* Quiz Container Wrapper (centers the container) */}
      <div className="flex justify-center">
        <QuizContainer
          quizData={quizData}
          onQuizComplete={handleQuizComplete}
          onReset={handleResetAndNavigateHome}
        />
      </div>
    </main>
  );
}
