"use client"

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Brain, Sparkles, Clock, Youtube, Zap, FileText } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced algorithms extract key insights",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get summaries in seconds",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    icon: FileText,
    title: "Comprehensive Summary",
    description: "Key points and full transcripts",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    icon: Zap,
    title: "Time Saver",
    description: "Focus on what matters most",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10"
  }
];

export function FeatureShowcase() {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50 border-primary/10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Features</h2>
            <p className="text-sm text-muted-foreground">What makes us special</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {features.map((Feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
                <div className={`h-10 w-10 rounded-lg ${Feature.bgColor} flex items-center justify-center`}>
                  <Feature.icon className={`h-5 w-5 ${Feature.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                    {Feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}