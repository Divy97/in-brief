import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Video,
  Youtube,
  Zap,
  Brain,
  Clock,
  Download,
  Users,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Direct Video Upload",
    description:
      "Upload videos directly from your device in multiple formats including MP4, MOV, and AVI.",
  },
  {
    icon: Youtube,
    title: "YouTube Integration",
    description:
      "Simply paste a YouTube URL and let us handle the rest. Support for public and unlisted videos.",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning models extract key points and generate comprehensive summaries.",
  },
  {
    icon: Clock,
    title: "Quick Processing",
    description:
      "Get your video summary in minutes, not hours. Real-time progress tracking included.",
  },
  {
    icon: Download,
    title: "Multiple Export Formats",
    description:
      "Export your summaries in various formats including PDF, Word, and plain text.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Share summaries with your team and collaborate on video content analysis.",
  },
  {
    icon: Lock,
    title: "Secure Processing",
    description:
      "Enterprise-grade security ensures your video content remains private and protected.",
  },
  {
    icon: Zap,
    title: "API Access",
    description:
      "Integrate video summarization directly into your workflow with our robust API.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 -z-10" />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Powerful Features for Video Summarization
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to transform long videos into concise,
              actionable summaries
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <Icon className="h-12 w-12 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 -z-10" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start summarizing your videos today with our powerful AI
              technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Try for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
