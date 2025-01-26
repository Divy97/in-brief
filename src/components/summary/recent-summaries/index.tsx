"use client"

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { VideoCard } from './video-card';

const recentVideos = [
  {
    title: "Introduction to Machine Learning",
    channel: "Tech Academy",
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Web Development Basics",
    channel: "Code Masters",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Data Science Fundamentals",
    channel: "Data Insights",
    duration: "18:20",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
  }
];

export function RecentSummaries() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recent Summaries</h2>
          <p className="text-sm text-muted-foreground">Previously analyzed videos</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div className="grid gap-4">
        {recentVideos.map((video, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <VideoCard {...video} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}