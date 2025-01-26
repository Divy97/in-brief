"use client"

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export function FeatureCard({ Icon, title, description, color, bgColor }: FeatureCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
        <div className={`absolute inset-0 ${bgColor} opacity-10 transition-opacity group-hover:opacity-20`} />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={`h-12 w-12 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <h3 className="text-sm font-medium mb-2">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}