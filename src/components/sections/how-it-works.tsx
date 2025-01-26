"use client";

import { motion } from "framer-motion";
import { FileText, Youtube, Sparkles, Share2 } from "lucide-react";

const steps = [
  {
    icon: Youtube,
    title: "Paste YouTube URL",
    description:
      "Simply paste any YouTube video URL. We support videos of any length and language.",
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "AI Processing",
    description:
      "Our advanced AI analyzes the video content, transcribes audio, and identifies key points.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: FileText,
    title: "Smart Summary",
    description:
      "Get a concise, well-structured summary with main points, timestamps, and key insights.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Share2,
    title: "Share & Export",
    description:
      "Download in your preferred format (PDF, Word, Text) or share directly with your team.",
    color: "from-green-500 to-emerald-500",
  },
];

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="how-it-works" className="py-24 bg-background/50 w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center space-y-4 mb-16 max-w-4xl mx-auto"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            How
            <span className="gradient-text"> YTSummarizer </span>
            Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
            Transform any YouTube video into a clear, concise summary in just a
            few clicks. No sign-up required for basic usage.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent -z-10 transform -translate-x-8" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-heading font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon with Gradient Background */}
                <div
                  className={`mb-6 p-4 rounded-2xl bg-gradient-to-r ${step.color} transform transition-transform group-hover:scale-110 group-hover:rotate-3`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                    {step.title}
                  </h3>
                  <p className="font-sans text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-900/0 to-gray-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
