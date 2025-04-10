"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractContentAction } from "./actions";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Sparkles } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useQuizManager } from "@/hooks/useQuizManager";
import { useQuizLimits } from "@/hooks/useQuizLimits";
import { SignUpPrompt } from "@/components/auth/SignUpPrompt";
import { QuizLimitDialog } from "@/components/QuizLimitDialog";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const router = useRouter();

  const { isAuthenticated } = useAuthContext();
  const { createQuiz, saveQuizQuestions } = useQuizManager();
  const { canCreateQuiz, remainingQuizzes } = useQuizLimits();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!canCreateQuiz) {
      if (!isAuthenticated) {
        setShowSignUpPrompt(true);
      } else {
        setShowLimitDialog(true);
      }
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await extractContentAction({} as any, formData);

      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.quizData) {
        // Transform questions to match our database schema
        const transformedQuestions = response.quizData.questions.map(
          (q: any) => ({
            quiz_id: "", // This will be set after quiz creation
            question: q.questionText,
            options: q.options.map((opt: any) => opt.text),
            correct_answer:
              q.options.find((opt: any) => opt.id === q.correctOptionId)
                ?.text || "",
            explanation: q.explanation || "",
          })
        );

        // Create quiz in database
        const quizId = await createQuiz({
          title: response.quizData.title || "Untitled Quiz",
          description: response.quizData.description || "",
          topic: "General",
          difficulty: "medium",
          is_public: false,
        });

        // Save quiz questions
        await saveQuizQuestions(quizId, transformedQuestions);

        // Store quiz ID in session for the quiz page
        sessionStorage.setItem("currentQuizId", quizId);
        router.push("/quiz");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[94vh] flex items-center justify-center bg-gradient-to-b from-white to-slate-50 px-4 py-6 sm:px-6 mt-14">
      <WelcomeDialog />
      {showSignUpPrompt && (
        <SignUpPrompt onDismiss={() => setShowSignUpPrompt(false)} />
      )}
      <QuizLimitDialog
        isOpen={showLimitDialog}
        onClose={() => setShowLimitDialog(false)}
      />
      <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent leading-tight">
            Transform Articles into Interactive Quizzes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
            Enhance your learning experience by converting any article into an
            engaging quiz
          </p>
        </div>

        <Card className="p-4 sm:p-6 shadow-lg border-slate-200">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="Paste any article URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 h-10 sm:h-12 text-base sm:text-lg"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="h-10 sm:h-12 px-4 sm:px-6 text-base font-medium whitespace-nowrap"
                size="lg"
              >
                {isLoading ? (
                  "Generating..."
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Quiz <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-2 sm:p-3 rounded-md">
                {error}
              </p>
            )}
          </form>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center sm:block text-center space-x-3 sm:space-x-0 sm:space-y-2 p-3 sm:p-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center sm:mx-auto">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="flex-1 sm:flex-none">
              <h3 className="font-medium">Any Article</h3>
              <p className="text-sm text-slate-600">
                Works with any readable online article
              </p>
            </div>
          </div>
          <div className="flex items-center sm:block text-center space-x-3 sm:space-x-0 sm:space-y-2 p-3 sm:p-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center sm:mx-auto">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="flex-1 sm:flex-none">
              <h3 className="font-medium">AI-Powered</h3>
              <p className="text-sm text-slate-600">
                Smart questions generated from content
              </p>
            </div>
          </div>
          <div className="flex items-center sm:block text-center space-x-3 sm:space-x-0 sm:space-y-2 p-3 sm:p-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-100 flex items-center justify-center sm:mx-auto">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <div className="flex-1 sm:flex-none">
              <h3 className="font-medium">Learn Better</h3>
              <p className="text-sm text-slate-600">
                Reinforce knowledge through quizzes
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-600 bg-slate-100 py-2 px-4 rounded-full inline-block">
            {isAuthenticated
              ? `✨ You have ${remainingQuizzes} quizzes remaining today`
              : "✨ Try one quiz for free! Sign up to create more quizzes"}
          </p>
        </div>
      </div>
    </main>
  );
}
