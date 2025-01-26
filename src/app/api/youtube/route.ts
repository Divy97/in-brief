import { NextRequest, NextResponse } from "next/server";
import { youtubeService } from "@/lib/services/youtube.service";

interface YouTubeServiceError extends Error {
  availableLanguages?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, lang = "en" } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      // Extract video ID from URL
      const videoId = await youtubeService.getVideoId(url);
      console.log("[YouTube API] Processing video:", videoId);

      // Get video metadata and subtitles concurrently
      const [metadata, subtitles] = await Promise.all([
        youtubeService.getVideoMetadata(videoId),
        youtubeService.getSubtitles(videoId, lang),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          ...metadata,
          subtitles,
        },
      });
    } catch (serviceError) {
      const error = serviceError as YouTubeServiceError;
      // Handle specific service errors
      console.error("[YouTube API] Service error:", {
        message: error.message,
        availableLanguages: error.availableLanguages,
      });

      // Return appropriate error response
      if (error.message.includes("Invalid YouTube URL")) {
        return NextResponse.json(
          { error: "Please provide a valid YouTube URL" },
          { status: 400 }
        );
      }

      if (error.message.includes("No captions found")) {
        return NextResponse.json(
          {
            error: "No captions available for this video",
            availableLanguages: error.availableLanguages,
          },
          { status: 404 }
        );
      }

      if (error.message.includes("Failed to fetch data")) {
        return NextResponse.json(
          {
            error: "Unable to access YouTube content. Please try again later.",
          },
          { status: 503 }
        );
      }

      // Generic service error
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error) {
    if (error instanceof Error) {
      // Handle request parsing errors
      console.error("[YouTube API] Request error:", error);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    // Handle unknown errors
    console.error("[YouTube API] Unknown error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
