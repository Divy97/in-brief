"use client";

import { useState, useMemo } from "react";
import { type QuizData, type UserAnswers } from "@/types/quiz"; // Import interfaces
import { QuizQuestionCard } from "./quiz-question-card";
import { QuizProgressBar } from "./quiz-progress-bar"; // Import progress bar
import { QuizResults } from "./quiz-results"; // Import QuizResults
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  RefreshCw,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils"; // Import cn utility for conditional classes

interface QuizContainerProps {
  quizData: QuizData;
  onQuizComplete: (answers: UserAnswers) => void; // Callback for when quiz is finished
  onReset: () => void; // Callback to reset to the form view
}

export function QuizContainer({
  quizData,
  onQuizComplete,
  onReset,
}: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [isComplete, setIsComplete] = useState(false); // State for showing results
  // State to control feedback visibility for the *current* question
  const [showFeedback, setShowFeedback] = useState(false);

  const totalQuestions = quizData.questions.length;

  // Memoize current question data for stability
  const currentQuestion = useMemo(() => {
    if (totalQuestions > 0 && currentQuestionIndex < totalQuestions) {
      return quizData.questions[currentQuestionIndex];
    }
    return null;
  }, [quizData.questions, currentQuestionIndex, totalQuestions]);

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // Calculate if the current answer (if any) is correct
  const isCurrentAnswerCorrect = useMemo(() => {
    if (!currentQuestion || !userAnswers[currentQuestion.id]) return undefined;
    return userAnswers[currentQuestion.id] === currentQuestion.correctOptionId;
  }, [currentQuestion, userAnswers]);

  // Handle option selection - hide feedback when a new option is chosen
  const handleOptionSelect = (questionId: string, optionId: string) => {
    setShowFeedback(false); // Hide feedback for previous state if user changes answer
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  // Handle moving to the next question or submitting
  const handleNextOrSubmit = () => {
    if (!currentQuestion) return;

    // 1. Show feedback for the current question
    setShowFeedback(true);

    // 2. Wait briefly to show feedback, then proceed
    setTimeout(() => {
      if (isLastQuestion) {
        // Submit the quiz
        console.log("Quiz Submitted!", userAnswers);
        setIsComplete(true);
        onQuizComplete(userAnswers);
      } else {
        // Move to the next question
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setShowFeedback(false); // Reset feedback visibility for the new question
      }
    }, 1500); // Show feedback for 1.5 seconds
  };

  // Handle previous question - simply move index, hide feedback
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setShowFeedback(false); // Ensure feedback is hidden when going back
    }
  };

  // Handle retake - reset everything including feedback
  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsComplete(false);
    setShowFeedback(false);
  };

  // --- Render Loading/Error/No Questions States ---
  if (totalQuestions === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-12 text-center p-8 border rounded-lg bg-slate-50">
        <p className="text-slate-600">
          No questions were generated for this content.
        </p>
        <Button onClick={onReset} variant="outline" className="mt-4">
          <Home className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    );
  }

  if (!currentQuestion) {
    // Should not happen if totalQuestions > 0, but good fallback
    return <div>Error loading question.</div>;
  }

  // --- Render Results View ---
  if (isComplete) {
    // Render the actual QuizResults component
    return (
      <QuizResults
        quizData={quizData}
        userAnswers={userAnswers}
        onRetake={handleRetakeQuiz}
        onGenerateNew={onReset} // onReset prop navigates home
      />
    );
  }

  // --- Render Question View ---
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header: Exit button */}
      <div className="flex justify-end items-center">
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          disabled={showFeedback} // Disable exit while feedback is showing
        >
          <Home className="mr-1.5 h-4 w-4" />
          Exit Quiz
        </Button>
      </div>

      {/* Progress Bar */}
      <QuizProgressBar
        current={currentQuestionIndex + 1}
        total={totalQuestions}
      />

      {/* Question Card - Pass feedback props */}
      <QuizQuestionCard
        question={currentQuestion}
        selectedOptionId={userAnswers[currentQuestion.id]}
        onOptionSelect={handleOptionSelect}
        showFeedback={showFeedback}
        isCorrect={isCurrentAnswerCorrect}
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || showFeedback} // Disable while feedback showing
          className="border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNextOrSubmit}
          className={cn(
            "text-white",
            // Change color based on feedback state if shown
            showFeedback &&
              isCurrentAnswerCorrect === true &&
              "bg-green-600 hover:bg-green-700",
            showFeedback &&
              isCurrentAnswerCorrect === false &&
              "bg-red-600 hover:bg-red-700",
            !showFeedback && "bg-blue-600 hover:bg-blue-700" // Default blue
          )}
          // Disable button if no answer selected OR if feedback is currently being shown
          disabled={!userAnswers[currentQuestion.id] || showFeedback}
        >
          {/* Change button text while feedback is showing */}
          {showFeedback ? (
            isLastQuestion ? (
              "Finishing..."
            ) : (
              "Next Question..."
            )
          ) : isLastQuestion ? (
            <>
              Submit Quiz <CheckCircle className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
