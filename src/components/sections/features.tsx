"use client";

import { motion } from "framer-motion";
import { Youtube, Zap, Clock, Brain, Download, Lock } from "lucide-react";

const features = [
  {
    icon: Youtube,
    title: "YouTube Integration",
    description:
      "Simply paste any YouTube URL and get instant summaries. Works with public and unlisted videos.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning models extract key points and generate comprehensive summaries.",
  },
  {
    icon: Clock,
    title: "Quick Processing",
    description:
      "Get your video summary in minutes, not hours. Real-time progress tracking included.",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description:
      "Export your summaries in various formats including PDF, Word, and plain text.",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description:
      "Enterprise-grade security ensures your video content remains private and protected.",
  },
  {
    icon: Zap,
    title: "API Access",
    description:
      "Integrate video summarization directly into your workflow with our robust API.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-background w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center space-y-4 mb-16 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Everything you need to
            <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              understand video content
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform provides all the tools you need to extract valuable
            insights from video content quickly and efficiently.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative group"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-colors" />
                <div className="relative p-6 space-y-4 flex flex-col items-center text-center">
                  <div className="p-3 w-fit rounded-lg bg-background border">
                    <Icon className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
