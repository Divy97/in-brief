"use client";

import { useState } from "react";
import { QuizQuestionCard } from "./quiz-question-card";
import { QuizResults } from "./quiz-results";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface QuizContainerProps {
  quizData: QuizData;
  onQuizComplete: (answers: Record<string, number>) => void;
  onReset: () => void;
}

export function QuizContainer({
  quizData,
  onQuizComplete,
  onReset,
}: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const answeredQuestions = Object.keys(userAnswers).length;

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleOptionSelect = (questionId: string, optionId: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleQuizComplete = () => {
    setIsComplete(true);
    onQuizComplete(userAnswers);
  };

  const isQuestionAnswered = (questionId: string) => {
    return questionId in userAnswers;
  };

  const isAnswerCorrect = (questionId: string) => {
    const question = quizData.questions.find((q) => q.id === questionId);
    return question && userAnswers[questionId] === question.correctAnswer;
  };

  // --- Render Loading/Error/No Questions States ---
  if (totalQuestions === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
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
        onRetake={() => {
          setUserAnswers({});
          setCurrentQuestionIndex(0);
          setIsComplete(false);
        }}
        onReset={onReset}
      />
    );
  }

  // --- Render Question View ---
  return (
    <div className="h-[88vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">{quizData.title}</h1>
        <div className="flex flex-wrap justify-center gap-2">
          {quizData.questions.map((question, index) => (
            <Button
              key={question.id}
              variant="outline"
              className={cn(
                "h-10 w-10 p-0",
                index === currentQuestionIndex && "border-2 border-blue-500",
                isQuestionAnswered(question.id) &&
                  isAnswerCorrect(question.id) &&
                  "bg-green-100 text-green-700 hover:bg-green-200",
                isQuestionAnswered(question.id) &&
                  !isAnswerCorrect(question.id) &&
                  "bg-red-100 text-red-700 hover:bg-red-200"
              )}
              onClick={() => handleQuestionNavigation(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {currentQuestion && (
        <QuizQuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          selectedOptionId={
            isQuestionAnswered(currentQuestion.id)
              ? userAnswers[currentQuestion.id]
              : undefined
          }
          onOptionSelect={(questionId: string, optionIndex: number) =>
            handleOptionSelect(questionId, optionIndex)
          }
          isCorrect={
            isQuestionAnswered(currentQuestion.id) &&
            isAnswerCorrect(currentQuestion.id)
          }
        />
      )}

      {answeredQuestions === totalQuestions && (
        <div className="flex justify-center mt-10">
          <Button onClick={handleQuizComplete}>Complete Quiz</Button>
        </div>
      )}
    </div>
  );
}
