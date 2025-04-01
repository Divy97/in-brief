"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractContentAction } from "@/app/actions";
import { type QuizData } from "@/types/quiz";

// --- Remove Mock Quiz Data ---
// const mockQuizData: QuizData = { ... }; // No longer needed

const QUIZ_DATA_SESSION_KEY = "quizData"; // Key for sessionStorage

// Define the expected state structure from the action
interface FormState {
  title: string | null;
  content: string | null;
  quizData?: QuizData | null; // Expect quizData from the action
  error?: string | null;
}

// Update initial state type
const initialState: FormState = {
  title: null,
  content: null,
  quizData: null,
  error: null,
};

// Separate component for the submit button to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating
        </>
      ) : (
        <>
          Generate
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

// Define view modes
type ViewMode = "form" | "loading" | "error";

export function UrlInputForm() {
  // Ensure useActionState uses the correct FormState type
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    extractContentAction,
    initialState
  );
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Effect to manage view transitions and navigation
  useEffect(() => {
    // 1. Transition TO 'loading'
    if (isPending && viewMode !== "loading") {
      setViewMode("loading");
      return;
    }

    // 2. Transition FROM 'loading'
    if (!isPending && viewMode === "loading") {
      // Check for success: Action finished, no error, and quizData is present
      if (state?.quizData && !state.error) {
        try {
          // Store the ACTUAL quiz data from the action state
          sessionStorage.setItem(
            QUIZ_DATA_SESSION_KEY,
            JSON.stringify(state.quizData) // Use state.quizData
          );
          // Navigate to the quiz page
          router.push("/quiz");
          // Reset viewMode back to form for when user navigates back
          setViewMode("form");
          formRef.current?.reset();
        } catch (error) {
          console.error("Failed to save quiz data to sessionStorage:", error);
          // Fallback to error state if sessionStorage fails
          setViewMode("error");
          // Optionally update state.error here if needed
        }
      } else {
        // Handle error state (explicit error OR success without quizData)
        console.error(
          "Action finished with error or missing quiz data:",
          state?.error
        );
        setViewMode("error");
        // The error message from the action (state.error) will be displayed
      }
    }
  }, [state, isPending, viewMode, router]);

  // handleReset is now only needed for the error view
  const handleResetFromError = () => {
    setViewMode("form");
    formRef.current?.reset();
  };

  // Render based on viewMode
  return (
    <div className="w-full flex flex-col items-center">
      {/* --- Form View --- */}
      {viewMode === "form" && (
        <section className="w-full max-w-2xl mx-auto mt-8">
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-4 p-8 rounded-lg border bg-white shadow-sm"
          >
            <h2 className="text-lg font-semibold">Enter URL</h2>
            <p className="text-sm text-slate-500">
              Paste the link to an article or YouTube video
            </p>
            <div className="flex gap-2">
              <Input
                name="url"
                required
                placeholder="https://example.com/article or https://youtube.com/watch?v=..."
                className="flex-1"
                disabled={isPending}
              />
              <SubmitButton />
            </div>
          </form>
        </section>
      )}

      {/* --- Loading View --- */}
      {viewMode === "loading" && (
        <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col items-center justify-center gap-4 p-8 rounded-lg border bg-slate-50 shadow-sm min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600">
            Extracting content & generating quiz...
          </p>
          <p className="text-sm text-slate-500">This might take a moment.</p>
        </div>
      )}

      {/* --- Error View --- */}
      {viewMode === "error" && (
        <div className="w-full max-w-2xl mx-auto mt-12 flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-red-200 bg-red-50 shadow-sm min-h-[200px]">
          <h3 className="text-lg font-semibold text-red-700">
            Generation Failed
          </h3>
          {/* Display the error message from the action state */}
          <p className="text-red-600 text-center">
            {state?.error || "An unknown error occurred during generation."}
          </p>
          <Button
            variant="outline"
            onClick={handleResetFromError}
            className="mt-4 border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
