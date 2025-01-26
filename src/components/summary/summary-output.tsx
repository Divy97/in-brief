"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { SummaryTab } from "./tabs/summary-tab";
import { KeyPointsTab } from "./tabs/key-points-tab";
import { TranscriptTab } from "./tabs/transcript-tab";
import { ProcessedVideoData } from "@/types/youtube";
import Image from "next/image";

interface SummaryOutputProps {
  videoData: ProcessedVideoData;
}

export function SummaryOutput({ videoData }: SummaryOutputProps) {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{videoData.title}</h2>
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground">
              {videoData.subtitles.length} segments
            </p>
          </div>
          <Image
            src={videoData.thumbnailUrl}
            alt={videoData.title}
            className="w-20 h-20 rounded-lg object-cover ring-2 ring-purple-500/20"
            width={80}
            height={80}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="key-points">Key Points</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>
          <TabsContent value="summary">
            <SummaryTab
              subtitles={videoData.subtitles}
              videoId={videoData.videoId}
            />
          </TabsContent>
          <TabsContent value="key-points">
            <KeyPointsTab subtitles={videoData.subtitles} />
          </TabsContent>
          <TabsContent value="transcript">
            <TranscriptTab subtitles={videoData.subtitles} />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
