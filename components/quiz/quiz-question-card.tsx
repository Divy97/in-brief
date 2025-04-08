import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type QuizQuestion } from "@/types/quiz"; // Import the interface
import { cn } from "@/lib/utils"; // Import cn utility for conditional classes
import { CheckCircle2, XCircle } from "lucide-react"; // Icons for feedback

interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedOptionId?: number;
  onOptionSelect: (questionId: string, optionIndex: number) => void;
  showFeedback: boolean;
  isCorrect?: boolean;
}

export function QuizQuestionCard({
  question,
  selectedOptionId,
  onOptionSelect,
  showFeedback,
  isCorrect,
}: QuizQuestionCardProps) {
  return (
    <Card className="w-full shadow-sm border border-slate-200 bg-white mt-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
          <span>{question.questionText}</span>
          {/* Show feedback icon in header if feedback is active */}
          {showFeedback && isCorrect === true && (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          )}
          {showFeedback && isCorrect === false && (
            <XCircle className="h-6 w-6 text-red-600" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOptionId?.toString()}
          onValueChange={(value) =>
            onOptionSelect(question.id, parseInt(value, 10))
          }
          className="flex flex-col space-y-3"
          disabled={showFeedback} // Disable radio group when feedback is shown
        >
          {question.options.map((option, index) => {
            const isSelected = selectedOptionId === index;
            const isCorrectOption = question.correctAnswer === index;

            return (
              <div
                key={option.id}
                // Apply conditional styling using cn
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-md border border-slate-200 transition-colors",
                  // Base hover/checked styles when feedback is NOT shown
                  !showFeedback &&
                    "hover:bg-slate-50 cursor-pointer has-[[data-state=checked]]:bg-slate-100 has-[[data-state=checked]]:border-slate-300",
                  // Feedback styles when feedback IS shown
                  showFeedback &&
                    isCorrectOption &&
                    "border-green-500 bg-green-50 text-green-800", // Correct answer style
                  showFeedback &&
                    isSelected &&
                    !isCorrectOption &&
                    "border-red-500 bg-red-50 text-red-800", // Incorrectly selected answer style
                  showFeedback &&
                    !isSelected &&
                    !isCorrectOption &&
                    "opacity-70", // Fade out other incorrect options
                  showFeedback && "cursor-default" // Remove pointer cursor when feedback shown
                )}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={option.id}
                  className={cn(
                    "border-slate-300 text-blue-600 focus:ring-blue-500",
                    // Style radio button based on feedback
                    showFeedback &&
                      isCorrectOption &&
                      "border-green-600 text-green-600",
                    showFeedback &&
                      isSelected &&
                      !isCorrectOption &&
                      "border-red-600 text-red-600"
                  )}
                  disabled={showFeedback} // Also disable individual items
                />
                <Label
                  htmlFor={option.id}
                  className={cn(
                    "font-normal text-slate-700 flex-1",
                    !showFeedback && "cursor-pointer", // Only pointer when active
                    showFeedback &&
                      isCorrectOption &&
                      "font-medium text-green-800",
                    showFeedback &&
                      isSelected &&
                      !isCorrectOption &&
                      "font-medium text-red-800",
                    showFeedback && "cursor-default"
                  )}
                >
                  {option.text}
                </Label>
                {/* Add icons directly to the option for feedback */}
                {showFeedback && isSelected && isCorrectOption && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />
                )}
                {showFeedback && isSelected && !isCorrectOption && (
                  <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                )}
                {showFeedback && !isSelected && isCorrectOption && (
                  <span className="text-xs text-green-700 ml-auto">
                    (Correct Answer)
                  </span>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
