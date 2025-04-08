import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SignUpPromptProps {
  onDismiss?: () => void;
}

export function SignUpPrompt({ onDismiss }: SignUpPromptProps) {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <Dialog
      open={isVisible}
      onOpenChange={(open) => {
        // Only allow closing via the "Maybe later" button
        if (!open) {
          handleDismiss();
        }
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-black/50" />
        <DialogContent className="p-0 border-none max-w-md">
          <Card className="w-full border-none shadow-lg bg-gradient-to-r from-slate-50 to-white">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-medium">
                Unlock More Insights
              </CardTitle>
              <CardDescription>
                Create a free account to access all features
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center gap-x-2 text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-green-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Create more quizzes
                </div>
                <div className="flex items-center gap-x-2 text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-green-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Track your progress over time
                </div>
                <div className="flex items-center gap-x-2 text-sm text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-green-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Get personalized recommendations
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={{
                    pathname: "/sign-up",
                    query: { redirect_to: pathname },
                  }}
                  className="flex-1"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Sign up free
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDismiss}
                >
                  Maybe later
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
