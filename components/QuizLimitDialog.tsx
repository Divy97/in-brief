"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "./ui/icons";

interface QuizLimitDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuizLimitDialog({ isOpen, onClose }: QuizLimitDialogProps) {
  const handleEmailClick = () => {
    window.open(
      "mailto:divyparekh1810@gmail.com?subject=Request%20for%20Quiz%20Limit%20Increase&body=Hi%2C%20I%20would%20like%20to%20request%20an%20increase%20in%20my%20daily%20quiz%20limit.",
      "_blank"
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Daily Quiz Limit Reached</DialogTitle>
          <DialogDescription className="pt-2">
            Thank you for using In-Brief! You've reached your daily quiz limit.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            We limit the number of quizzes to ensure quality and prevent misuse.
            Need more? Contact us to request an increase in your daily limit.
          </p>
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            variant="default"
            className="w-full"
            onClick={handleEmailClick}
          >
            <Icons.mail className="mr-2 h-4 w-4" />
            Request Limit Increase
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            I'll Try Tomorrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
