"use client";

import { motion } from "framer-motion";
import { SubtitleItem } from "@/lib/services/youtube.service";
import { LightbulbIcon } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface KeyPointsTabProps {
  subtitles: SubtitleItem[];
}

export function KeyPointsTab({ subtitles }: KeyPointsTabProps) {
  // For now, select every 10th subtitle as a key point
  const keyPoints = subtitles.filter((_, index) => index % 10 === 0);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Key points from the video:
      </p>
      {keyPoints.map((point, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
        >
          <LightbulbIcon className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-sm">{point.text}</p>
            <span className="text-xs font-medium text-muted-foreground mt-1 block">
              {formatTime(point.start)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
