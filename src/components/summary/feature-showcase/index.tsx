"use client"

import { motion } from 'framer-motion';
import { Brain, Sparkles, Clock, Youtube, FileText, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const leftFeatures = [
  {
    title: "AI-powered video analysis",
    description: "Advanced algorithms for content understanding"
  },
  {
    title: "Unique summary generation",
    description: "Personalized and contextual summaries"
  },
  {
    title: "Multi-format output",
    description: "Get key points, transcripts, and insights"
  },
  {
    title: "Smart content processing",
    description: "Context-aware information extraction"
  }
];

const rightFeatures = [
  {
    title: "Basic content analysis",
    description: "Standard text processing capabilities"
  },
  {
    title: "Template-based summaries",
    description: "Pre-defined summary structures"
  },
  {
    title: "Limited output options",
    description: "Basic text summaries only"
  },
  {
    title: "Simple processing",
    description: "Basic keyword extraction"
  }
];

export function FeatureShowcase() {
  return (
    <Card className="overflow-hidden backdrop-blur-sm bg-card/50 border-primary/10">
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Why Choose YTSummarizer</h2>
          <p className="text-sm text-muted-foreground">Compare our features with alternatives</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - YTSummarizer */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-3 bg-purple-500/10 rounded-lg">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="font-medium text-purple-500">YTSummarizer</h3>
            </div>
            <div className="space-y-4">
              {leftFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Others */}
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-500/10 rounded-lg">
              <Youtube className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-500">Other Tools</h3>
            </div>
            <div className="space-y-4">
              {rightFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-gray-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}