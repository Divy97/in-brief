"use client"

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, Settings, Maximize } from 'lucide-react';

export function PreviewMockup() {
  return (
    <div className="relative">
      <Card className="relative bg-card/50 backdrop-blur border-primary/10 shadow-2xl overflow-hidden">
        {/* Video Player Mockup */}
        <div className="aspect-video bg-zinc-900 relative">
          {/* Video Thumbnail */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80")',
              backgroundBlendMode: 'overlay',
            }}
          >
            <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better text contrast */}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Video Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full w-2/3 bg-red-500" />
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Pause className="h-5 w-5 hover:text-white/80 cursor-pointer" />
                <Volume2 className="h-5 w-5 hover:text-white/80 cursor-pointer" />
                <span className="text-sm">2:30 / 3:45</span>
              </div>
              <div className="flex items-center gap-4">
                <Settings className="h-5 w-5 hover:text-white/80 cursor-pointer" />
                <Maximize className="h-5 w-5 hover:text-white/80 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Interface */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                YT
              </div>
              <div>
                <h4 className="font-medium text-sm">Advanced Machine Learning Concepts</h4>
                <p className="text-xs text-muted-foreground">Tech University</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-primary/10 rounded-full w-full animate-pulse" />
              <div className="h-2 bg-primary/10 rounded-full w-4/5 animate-pulse" />
              <div className="h-2 bg-primary/10 rounded-full w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </Card>

      {/* Processing Status */}
      <motion.div
        className="absolute -top-6 -right-6 p-4 bg-card rounded-lg shadow-lg border border-primary/10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm">Processing video...</span>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-full blur-2xl" />
    </div>
  );
}