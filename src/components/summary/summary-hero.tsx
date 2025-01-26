"use client"

import { motion } from 'framer-motion';
import { Sparkles, Brain, Zap } from 'lucide-react';

export function SummaryHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4 mb-6"
    >
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Brain className="h-4 w-4 text-purple-500" />
        <span className="text-sm">AI-Powered Summaries</span>
      </motion.div>

      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
        Transform Videos into Insights
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <span>Smart Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          <span>Instant Results</span>
        </div>
      </div>
    </motion.div>
  );
}