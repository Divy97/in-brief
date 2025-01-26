"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Newspaper,
  Video,
  Users,
  Book,
} from "lucide-react";

const useCases = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Quickly grasp concepts from educational videos and lectures.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Briefcase,
    title: "Professionals",
    description:
      "Stay updated with industry talks and conference presentations.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Newspaper,
    title: "Researchers",
    description: "Extract insights from interviews and research presentations.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Video,
    title: "Content Creators",
    description: "Research and analyze trending content in your niche.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "Teams",
    description: "Share knowledge from video content across your organization.",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Book,
    title: "Educators",
    description: "Create quick summaries of educational content for students.",
    color: "from-yellow-500 to-orange-500",
  },
];

export function UseCases() {
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
            Perfect for
            <span className="block bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              every use case
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From students to professionals, our platform helps everyone save
            time and extract value from video content.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-6 space-y-4 flex flex-col items-center text-center">
                  <div
                    className={`p-3 w-fit rounded-lg bg-gradient-to-r ${useCase.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
