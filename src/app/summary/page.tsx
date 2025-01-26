"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProcessingAnimation } from "@/components/summary/processing-animation";
import { SummaryOutput } from "@/components/summary/summary-output";
import { SummaryHero } from "@/components/summary/summary-hero";
import { RecentSummaries } from "@/components/summary/recent-summaries";
import { FeatureShowcase } from "@/components/summary/feature-showcase";
import { UrlInput } from "@/components/summary/url-input";
import { ProcessedVideoData } from "@/types/youtube";

export default function SummaryPage() {
  const [videoData, setVideoData] = useState<ProcessedVideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10" />

      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Hero and Input Section */}
          <div className="max-w-4xl mx-auto">
            <SummaryHero />
            <UrlInput
              onVideoData={setVideoData}
              onProcessingStart={() => setIsLoading(true)}
              onProcessingEnd={() => setIsLoading(false)}
            />
          </div>

          {/* Processing and Results */}
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-4xl mx-auto"
              >
                <ProcessingAnimation />
              </motion.div>
            )}

            {videoData && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="max-w-4xl mx-auto"
              >
                <SummaryOutput videoData={videoData} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Summaries and Features Section */}
          {!videoData && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-8 mt-12"
            >
              <RecentSummaries />
              <FeatureShowcase />
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
