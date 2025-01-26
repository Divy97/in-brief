"use client"

import { motion } from 'framer-motion';
import { Loader2, Brain, Sparkles, FileText } from 'lucide-react';

export function ProcessingAnimation() {
  const steps = [
    { icon: Brain, text: "Analyzing video content..." },
    { icon: Sparkles, text: "Generating insights..." },
    { icon: FileText, text: "Creating summary..." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-lg" />
      
      <div className="relative backdrop-blur-sm rounded-lg p-8 space-y-8">
        <div className="flex justify-center">
          <div className="relative">
            <motion.div 
              className="h-20 w-20 rounded-full"
              style={{
                background: "linear-gradient(45deg, #8B5CF6, #3B82F6)",
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((Step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <Step.icon className="h-5 w-5" />
              <span>{Step.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}