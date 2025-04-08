import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuizProgressBarProps {
  current: number; // Current question number (e.g., 1, 2, 3...)
  total: number; // Total number of questions
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  // Ensure total is not zero to avoid division by zero
  const progressValue = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Progress</span>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {Math.round(progressValue)}%
          </span>
        </div>
        <span className="text-sm font-medium text-slate-600">
          Question {current} of {total}
        </span>
      </div>
      <div
        className={cn(
          "w-full h-2.5 bg-slate-100 rounded-full overflow-hidden transition-all duration-300",
          progressValue === 100 && "bg-green-100"
        )}
      >
        <div
          className={cn(
            "h-full bg-blue-600 transition-all duration-300",
            progressValue === 100 && "bg-green-600"
          )}
          style={{ width: `${progressValue}%` }}
        />
      </div>
    </div>
  );
}
