"use client"

import { motion } from 'framer-motion';
import { Youtube, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VideoCardProps {
  title: string;
  channel: string;
  duration: string;
  thumbnail: string;
}

export function VideoCard({ title, channel, duration, thumbnail }: VideoCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/10">
      <div className="relative aspect-video">
        <img 
          src={thumbnail} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ArrowRight className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <Youtube className="h-3.5 w-3.5 text-red-500" />
          <p className="text-xs text-muted-foreground truncate">
            {channel} • {duration}
          </p>
        </div>
      </div>
    </Card>
  );
}