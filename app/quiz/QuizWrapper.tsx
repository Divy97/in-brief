"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserProfile } from "@/hooks/useProfile";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface QuizData {
  title: string;
  questions: Array<{
    question: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
  }>;
}

interface QuizWrapperProps {
  quizData: QuizData;
  onComplete: (answers: Record<string, string>) => void;
  userProfile: UserProfile | null;
}

export function QuizWrapper({
  quizData,
  onComplete,
  userProfile,
}: QuizWrapperProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress =
    ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  const hasAnsweredCurrent =
    selectedAnswers[currentQuestionIndex] !== undefined;
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (hasAnsweredCurrent) return; // Prevent changing answer after selection

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      onComplete(selectedAnswers);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(
        selectedAnswers[currentQuestionIndex - 1] !== undefined
      );
    }
  };

  const isCorrect =
    hasAnsweredCurrent &&
    selectedAnswers[currentQuestionIndex] === currentQuestion.correct_answer;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {quizData.title}
        </h1>
        <p className="text-sm text-slate-600">
          Question {currentQuestionIndex + 1} of {quizData.questions.length}
        </p>
        <Progress value={progress} className="mt-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <h2 className="text-lg font-medium mb-4">{currentQuestion.question}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <Button
              key={index}
              variant={
                hasAnsweredCurrent
                  ? option === currentQuestion.correct_answer
                    ? "secondary"
                    : option === selectedAnswers[currentQuestionIndex]
                      ? "destructive"
                      : "outline"
                  : "outline"
              }
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleAnswerSelect(option)}
              disabled={hasAnsweredCurrent}
            >
              {option}
            </Button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && currentQuestion.explanation && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              isCorrect ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <p
              className={`text-sm ${
                isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!hasAnsweredCurrent}>
          {isLastQuestion ? (
            "Complete Quiz"
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* User Progress */}
      {userProfile && (
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            You've completed {userProfile.quizzes_taken} quizzes
          </p>
        </div>
      )}
    </div>
  );
}
