"use client"

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, BookmarkPlus } from 'lucide-react';

export function SummaryHeader() {
  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Advanced Machine Learning Concepts</h1>
            <p className="text-muted-foreground">Tech University • 1.2M views</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}