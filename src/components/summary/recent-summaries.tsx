"use client"

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Youtube, Clock, ArrowRight } from 'lucide-react';

const recentVideos = [
  {
    title: "Introduction to Machine Learning",
    channel: "Tech Academy",
    duration: "15:30",
    thumbnail: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=200&h=120"
  },
  {
    title: "Web Development Basics",
    channel: "Code Masters",
    duration: "12:45",
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=200&h=120"
  },
  {
    title: "Data Science Fundamentals",
    channel: "Data Insights",
    duration: "18:20",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200&h=120"
  }
];

export function RecentSummaries() {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50 border-primary/10">
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
        
        <div className="space-y-4">
          {recentVideos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="flex gap-4 items-center">
                <div className="relative flex-shrink-0">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-24 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Youtube className="h-3.5 w-3.5 text-red-500" />
                    <p className="text-xs text-muted-foreground truncate">
                      {video.channel} • {video.duration}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
}