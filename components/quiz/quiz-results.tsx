import { useMemo } from "react";
import { type QuizData, type UserAnswers } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Use Progress for score visualization
import { RefreshCw, RotateCcw, Award, Check, X } from "lucide-react"; // Icons

interface QuizResultsProps {
  quizData: QuizData;
  userAnswers: UserAnswers;
  onRetake: () => void;
  onGenerateNew: () => void;
}

export function QuizResults({
  quizData,
  userAnswers,
  onRetake,
  onGenerateNew,
}: QuizResultsProps) {
  // Calculate score
  const { score, totalQuestions, percentage } = useMemo(() => {
    let correctAnswers = 0;
    const total = quizData.questions.length;
    quizData.questions.forEach((q) => {
      if (q.correctOptionId && userAnswers[q.id] === q.correctOptionId) {
        correctAnswers++;
      }
    });
    const perc = total > 0 ? Math.round((correctAnswers / total) * 100) : 0;
    return { score: correctAnswers, totalQuestions: total, percentage: perc };
  }, [quizData, userAnswers]);

  // Determine feedback message based on score
  const feedbackMessage = useMemo(() => {
    if (percentage === 100) return "Perfect Score! Outstanding!";
    if (percentage >= 80) return "Excellent Job!";
    if (percentage >= 60) return "Good Effort!";
    if (percentage >= 40) return "Keep Practicing!";
    return "Better Luck Next Time!";
  }, [percentage]);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 shadow-lg border border-slate-200">
      <CardHeader className="text-center">
        <Award className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
        <CardTitle className="text-2xl font-bold text-slate-800">
          Quiz Complete!
        </CardTitle>
        <CardDescription className="text-lg text-slate-600 pt-1">
          {feedbackMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Score Display */}
        <div className="text-center">
          <p className="text-sm text-slate-500">Your Score</p>
          <p className="text-4xl font-bold text-blue-600">
            {score} / {totalQuestions}
          </p>
          <p className="text-sm text-slate-500">({percentage}%)</p>
        </div>

        {/* Progress Bar for Score */}
        <div className="w-3/4">
          <Progress value={percentage} className="h-3 [&>*]:bg-blue-600" />
        </div>

        {/* Optional: Detailed Results Summary (Example) */}
        {/*
        <div className="w-full mt-4 border-t pt-4">
            <h4 className="text-md font-semibold mb-2 text-slate-700">Summary:</h4>
            <ul className="space-y-1 text-sm">
                {quizData.questions.map((q, index) => {
                    const userAnswerId = userAnswers[q.id];
                    const isCorrect = q.correctOptionId === userAnswerId;
                    return (
                        <li key={q.id} className="flex items-center gap-2">
                            {isCorrect ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                            <span>Question {index + 1}: {isCorrect ? 'Correct' : 'Incorrect'}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
        */}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full justify-center">
          <Button
            onClick={onRetake}
            variant="outline"
            className="border-blue-300 text-blue-600 hover:bg-blue-50 flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retake Quiz
          </Button>
          <Button
            onClick={onGenerateNew} // Navigates home
            variant="outline"
            className="border-slate-300 text-slate-600 hover:bg-slate-50 flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Generate New Quiz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
