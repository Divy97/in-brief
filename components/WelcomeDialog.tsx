"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Icons } from "./ui/icons";

const WELCOME_DIALOG_KEY = "welcome_dialog_shown";

const features = [
  {
    id: 1,
    text: "Generate quizzes from any article",
  },
  {
    id: 2,
    text: "Test your understanding",
  },
  {
    id: 3,
    text: "Track your progress",
  },
];

export function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { signInWithGoogle } = useAuthContext();

  useEffect(() => {
    const hasShown = localStorage.getItem(WELCOME_DIALOG_KEY);
    if (!hasShown) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem(WELCOME_DIALOG_KEY, "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to In-Brief!</DialogTitle>
          <DialogDescription className="pt-2">
            Generate interactive quizzes from any article to test your
            understanding and retention.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-center gap-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              signInWithGoogle();
              handleDismiss();
            }}
          >
            <Icons.google className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleDismiss}>
            Maybe Later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
