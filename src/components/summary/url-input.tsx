"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Youtube, Loader2, Sparkles } from "lucide-react";
import { ProcessedVideoData } from "@/types/youtube";
import { useToast } from "@/hooks/use-toast";

interface UrlInputProps {
  onVideoData: (data: ProcessedVideoData) => void;
  onProcessingStart: () => void;
  onProcessingEnd: () => void;
}

export function UrlInput({
  onVideoData,
  onProcessingStart,
  onProcessingEnd,
}: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      onProcessingStart();

      const response = await fetch("/api/youtube", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to process video");
      }

      onVideoData(result.data);
      setUrl("");

      toast({
        title: "Success",
        description: "Video processed successfully!",
      });
    } catch (error) {
      console.error("Error processing video:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process video",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      onProcessingEnd();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 backdrop-blur-sm bg-card/50 border-primary/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-primary"
          >
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-bold">Summarize Any YouTube Video</h2>
            <Sparkles className="h-5 w-5" />
          </motion.div>

          <div className="flex gap-3">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Youtube className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className="pl-10 h-12 bg-background/50 backdrop-blur-sm border-primary/10 focus:border-primary/30 transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isProcessing}
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
            <Button
              type="submit"
              disabled={isProcessing || !url}
              className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Summarize"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
