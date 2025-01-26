"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SubtitleItem } from "@/lib/services/youtube.service";
import { SummaryService } from "@/lib/services/summary.service";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

interface SummaryTabProps {
  subtitles: SubtitleItem[];
  videoId: string;
}

interface SummaryData {
  overview: string;
  mainPoints: string[];
  keyQuotes: string[];
  detailedSummary: string;
}

export function SummaryTab({ subtitles, videoId }: SummaryTabProps) {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Combine all subtitles into a transcript
        const transcript = subtitles.map((s) => s.text).join(" ");

        const result = await SummaryService.generateSummary({
          transcript,
          videoId,
          userId: session?.user?.id || "",
        });

        setSummary({
          overview: result.overview,
          mainPoints: result.mainPoints,
          keyQuotes: result.keyQuotes,
          detailedSummary: result.detailedSummary,
        });
      } catch (err) {
        console.error("Error generating summary:", err);
        setError("Failed to generate summary. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (subtitles.length > 0 && session?.user?.id) {
      generateSummary();
    }
  }, [subtitles, videoId, session?.user?.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-16 w-5/6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-4 text-muted-foreground">
        <p>Please sign in to generate a summary.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-semibold">Overview</h3>
        <p className="text-sm text-muted-foreground">{summary.overview}</p>
      </motion.div>

      {/* Main Points */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-semibold">Main Points</h3>
        <ul className="space-y-2">
          {summary.mainPoints.map((point, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Key Quotes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-semibold">Key Quotes</h3>
        <div className="space-y-2">
          {summary.keyQuotes.map((quote, index) => (
            <motion.blockquote
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="text-sm italic border-l-2 border-primary/50 pl-4 py-1"
            >
              {quote}
            </motion.blockquote>
          ))}
        </div>
      </motion.div>

      {/* Detailed Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-2"
      >
        <h3 className="text-lg font-semibold">Detailed Summary</h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
          {summary.detailedSummary}
        </p>
      </motion.div>
    </div>
  );
}
