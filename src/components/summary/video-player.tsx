"use client"

import { Card } from '@/components/ui/card';
import { Play, Pause, Volume2, Settings, Maximize } from 'lucide-react';

export function VideoPlayer() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-zinc-900 relative">
        {/* Video Thumbnail */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80")',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
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
    </Card>
  );
}