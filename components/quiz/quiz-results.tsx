import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, RotateCcw, Award, Check, X, History } from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

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

interface QuizResultsProps {
  quizData: QuizData;
  userAnswers: Record<string, number>;
  onRetake: () => void;
  onReset: () => void;
}

export function QuizResults({
  quizData,
  userAnswers,
  onRetake,
  onReset,
}: QuizResultsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  // Calculate score
  const correctAnswers = quizData.questions.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;
  const totalQuestions = quizData.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Determine feedback message based on score
  const feedbackMessage = useMemo(() => {
    if (score === 100) return "Perfect Score! Outstanding!";
    if (score >= 80) return "Excellent Job!";
    if (score >= 60) return "Good Effort!";
    if (score >= 40) return "Keep Practicing!";
    return "Better Luck Next Time!";
  }, [score]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">Quiz Results</h1>
        <p className="mt-2 text-slate-600">
          You scored {score}% ({correctAnswers} out of {totalQuestions} correct)
        </p>
      </div>

      <div className="space-y-4">
        {quizData.questions.map((question, index) => {
          const isCorrect = userAnswers[question.id] === question.correctAnswer;
          const userAnswer = userAnswers[question.id];

          return (
            <Card key={question.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-500">
                      Question {index + 1}
                    </span>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {question.questionText}
                    </h2>
                  </div>
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>

                <div className="grid gap-2">
                  {question.options.map((option, index) => {
                    const isSelected = userAnswer === index;
                    const isCorrectOption = index === question.correctAnswer;

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-center rounded-lg border p-4",
                          isCorrectOption
                            ? "border-green-500 bg-green-50"
                            : isSelected
                              ? "border-red-500 bg-red-50"
                              : "border-slate-200"
                        )}
                      >
                        <span
                          className={cn(
                            "mr-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium",
                            isCorrectOption
                              ? "border-green-500 text-green-700"
                              : isSelected
                                ? "border-red-500 text-red-700"
                                : "border-slate-300 text-slate-600"
                          )}
                        >
                          {String.fromCharCode(65 + parseInt(option.id, 10))}
                        </span>
                        <span
                          className={cn(
                            isCorrectOption
                              ? "text-green-700"
                              : isSelected
                                ? "text-red-700"
                                : "text-slate-600"
                          )}
                        >
                          {option.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={onRetake} variant="outline">
          <RotateCcw className="mr-2 h-4 w-4" />
          Retake Quiz
        </Button>
        <Button onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Another Quiz
        </Button>
        {isAuthenticated ? (
          <Button onClick={() => router.push("/profile")} variant="outline">
            <History className="mr-2 h-4 w-4" />
            View Quiz History
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/sign-up?redirect_to=/profile")}
            variant="outline"
          >
            <History className="mr-2 h-4 w-4" />
            Sign Up to Save Progress
          </Button>
        )}
      </div>
    </div>
  );
}
