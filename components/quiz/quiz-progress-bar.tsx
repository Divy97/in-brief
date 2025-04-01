import { Progress } from "@/components/ui/progress";

interface QuizProgressBarProps {
  current: number; // Current question number (e.g., 1, 2, 3...)
  total: number; // Total number of questions
}

export function QuizProgressBar({ current, total }: QuizProgressBarProps) {
  // Ensure total is not zero to avoid division by zero
  const progressValue = total > 0 ? ((current - 1) / total) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between text-sm text-slate-600">
        <span>Progress</span>
        <span>
          Question {current} / {total}
        </span>
      </div>
      <Progress
        value={progressValue}
        className="w-full h-2 [&>*]:bg-blue-600"
      />
    </div>
  );
}
