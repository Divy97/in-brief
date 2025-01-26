"use client"

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, ListChecks, MessageSquare, Copy } from 'lucide-react';

export function SummaryContent() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="key-points">Key Points</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <motion.div {...fadeIn} className="prose dark:prose-invert max-w-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>5 min read</span>
              </div>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <p>
              This lecture covers advanced concepts in machine learning, focusing on neural networks
              and deep learning architectures. The key topics include backpropagation, convolutional
              neural networks, and practical applications in computer vision.
            </p>
            <p>
              The professor emphasizes the importance of understanding the mathematical foundations
              while also providing real-world examples of how these concepts are applied in industry.
            </p>
          </motion.div>
        </TabsContent>

        <TabsContent value="key-points" className="space-y-4">
          <motion.div {...fadeIn}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ListChecks className="h-4 w-4" />
                <span>6 key points</span>
              </div>
            </div>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                Introduction to neural network architectures
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                Backpropagation algorithm explained
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                Convolutional neural networks (CNNs)
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                Applications in computer vision
              </li>
              <li className="flex gap-2">
                <span className="font-bold">5.</span>
                Industry use cases and examples
              </li>
              <li className="flex gap-2">
                <span className="font-bold">6.</span>
                Future trends and developments
              </li>
            </ul>
          </motion.div>
        </TabsContent>

        <TabsContent value="transcript" className="space-y-4">
          <motion.div {...fadeIn}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>Full transcript</span>
              </div>
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="space-y-4 text-muted-foreground">
              <p>[00:00] Welcome to today's lecture on advanced machine learning concepts...</p>
              <p>[02:15] Let's start by understanding the architecture of neural networks...</p>
              <p>[05:30] The backpropagation algorithm is crucial for training deep networks...</p>
              <p>[08:45] Now, let's look at some practical applications in computer vision...</p>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}