"use client";

import { motion } from "framer-motion";
import { SubtitleItem } from "@/lib/services/youtube.service";
import { formatTime } from "@/lib/utils";

interface TranscriptTabProps {
  subtitles: SubtitleItem[];
}

export function TranscriptTab({ subtitles }: TranscriptTabProps) {
  return (
    <div className="space-y-4">
      {subtitles.map((subtitle, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="p-3 rounded-lg bg-muted/50"
        >
          <p className="text-sm">
            <span className="text-xs font-medium text-muted-foreground">
              {formatTime(subtitle.start)}
            </span>
            <span className="mx-2">→</span>
            {subtitle.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
