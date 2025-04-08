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
  isCorrect?: boolean;
}

export function QuizQuestionCard({
  question,
  selectedOptionId,
  onOptionSelect,
  isCorrect,
}: QuizQuestionCardProps) {
  return (
    <Card className="w-full shadow-lg border-0 bg-white rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <CardTitle className="text-xl font-semibold text-slate-800">
          {question.questionText}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <RadioGroup
          key={question.id}
          value={selectedOptionId?.toString()}
          onValueChange={(value) =>
            onOptionSelect(question.id, parseInt(value, 10))
          }
          className="flex flex-col space-y-4"
          disabled={selectedOptionId !== undefined}
        >
          {question.options.map((option, index) => {
            const isSelected = selectedOptionId === index;
            const isCorrectOption = index === question.correctAnswer;
            const showFeedback = selectedOptionId !== undefined;

            return (
              <div
                key={`${question.id}-${index}`}
                className={cn(
                  "relative overflow-hidden rounded-xl border-2 transition-all duration-300",
                  !showFeedback &&
                    "hover:border-blue-200 hover:bg-blue-50/30 border-slate-200",
                  showFeedback &&
                    isCorrectOption &&
                    "border-green-500 bg-green-50",
                  showFeedback &&
                    isSelected &&
                    !isCorrectOption &&
                    "border-red-500 bg-red-50"
                )}
              >
                <div className="relative z-10 flex items-center p-4">
                  <RadioGroupItem
                    value={index.toString()}
                    id={option.id}
                    className={cn(
                      "transition-colors duration-300",
                      !showFeedback && "border-slate-300 text-blue-600",
                      showFeedback &&
                        isCorrectOption &&
                        "border-green-500 text-green-600",
                      showFeedback &&
                        isSelected &&
                        !isCorrectOption &&
                        "border-red-500 text-red-600"
                    )}
                    disabled={showFeedback}
                  />
                  <Label
                    htmlFor={option.id}
                    className={cn(
                      "flex-1 ml-4 font-medium transition-colors duration-300",
                      !showFeedback &&
                        "text-slate-700 cursor-pointer hover:text-slate-900",
                      showFeedback && isCorrectOption && "text-green-800",
                      showFeedback &&
                        isSelected &&
                        !isCorrectOption &&
                        "text-red-800"
                    )}
                  >
                    {option.text}
                  </Label>
                  {showFeedback && (isSelected || isCorrectOption) && (
                    <div className="ml-4 animate-in fade-in slide-in-from-right-5 duration-300">
                      {isCorrectOption ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                {showFeedback && (isSelected || isCorrectOption) && (
                  <div
                    className={cn(
                      "absolute inset-0 opacity-10 animate-in fade-in duration-300",
                      isCorrectOption ? "bg-green-500" : "bg-red-500"
                    )}
                  />
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
