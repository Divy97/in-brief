import { useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  RefreshCw,
  RotateCcw,
  Award,
  Check,
  X,
  History,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import dynamic from "next/dynamic";

// Dynamically import Confetti to avoid SSR issues
const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

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

// Mock resources data - Replace with real data in production
const RESOURCES = [
  {
    title: "LinkedIn Profile Writing Guide",
    description:
      "Learn how to write a compelling LinkedIn profile that stands out.",
    url: "https://www.linkedin.com/business/talent/blog/product-tips/linkedin-profile-writing-guide",
  },
  {
    title: "LinkedIn Profile Best Practices",
    description:
      "Expert tips and tricks for optimizing your LinkedIn presence.",
    url: "https://www.linkedin.com/help/linkedin/answer/112133/optimize-your-linkedin-profile",
  },
  {
    title: "Personal Branding on LinkedIn",
    description: "Build your personal brand and increase your visibility.",
    url: "https://business.linkedin.com/marketing-solutions/blog/linkedin-company-pages/2017/5-steps-to-strengthen-your-personal-brand-on-linkedin",
  },
];

export function QuizResults({
  quizData,
  userAnswers,
  onRetake,
  onReset,
}: QuizResultsProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [showConfetti, setShowConfetti] = useState(true);

  // Calculate score
  const correctAnswers = quizData.questions.filter(
    (q) => userAnswers[q.id] === q.correctAnswer
  ).length;
  const totalQuestions = quizData.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Determine feedback message and color based on score
  const feedback = useMemo(() => {
    if (score === 100)
      return {
        message: "Perfect Score! Outstanding!",
        color: "text-green-600",
        description: "You've mastered this topic! Keep up the excellent work!",
      };
    if (score >= 80)
      return {
        message: "Excellent Job!",
        color: "text-blue-600",
        description: "You're doing great! Just a few minor points to review.",
      };
    if (score >= 60)
      return {
        message: "Good Effort!",
        color: "text-yellow-600",
        description:
          "You're on the right track. Keep practicing to improve further.",
      };
    if (score >= 40)
      return {
        message: "Keep Practicing!",
        color: "text-orange-600",
        description: "You're making progress. Review the topics and try again.",
      };
    return {
      message: "Better Luck Next Time!",
      color: "text-red-600",
      description: "Don't give up! Review the materials and keep learning.",
    };
  }, [score]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto  px-4 pb-8">
      {showConfetti && score > 60 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={score * 2}
        />
      )}

      {/* Score Card */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
          <CardDescription className="text-lg">
            {quizData.title}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{score}%</span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-slate-100"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (352 * score) / 100}
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    score >= 80
                      ? "text-green-500"
                      : score >= 60
                        ? "text-blue-500"
                        : score >= 40
                          ? "text-yellow-500"
                          : "text-red-500"
                  )}
                />
              </svg>
            </div>
            <div className="text-center">
              <h3 className={cn("text-2xl font-bold mb-2", feedback.color)}>
                {feedback.message}
              </h3>
              <p className="text-slate-600">{feedback.description}</p>
              <p className="mt-2 text-slate-700">
                You got {correctAnswers} out of {totalQuestions} questions
                correct
              </p>
            </div>
          </div>

          {/* Questions Review */}
          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Question Review
            </h3>
            {quizData.questions.map((question, index) => {
              const isCorrect =
                userAnswers[question.id] === question.correctAnswer;
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
                        const isCorrectOption =
                          index === question.correctAnswer;

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
                              {String.fromCharCode(
                                65 + parseInt(option.id, 10)
                              )}
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

          {/* Resources Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Additional Resources
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {RESOURCES.map((resource, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Learn More
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={onRetake}
              variant="outline"
              className="min-w-[140px]"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake Quiz
            </Button>
            <Button onClick={onReset} className="min-w-[140px]">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Another Quiz
            </Button>
            {isAuthenticated ? (
              <Button
                onClick={() => router.push("/profile")}
                variant="outline"
                className="min-w-[140px]"
              >
                <History className="mr-2 h-4 w-4" />
                View History
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/sign-up?redirect_to=/profile")}
                variant="outline"
                className="min-w-[140px]"
              >
                <Award className="mr-2 h-4 w-4" />
                Sign Up to Save Progress
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
