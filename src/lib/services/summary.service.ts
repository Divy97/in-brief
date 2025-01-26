export interface GenerateSummaryInput {
  transcript: string;
  videoId: string;
  userId: string;
}

export interface Summary {
  id: string;
  overview: string;
  mainPoints: string[];
  keyQuotes: string[];
  detailedSummary: string;
  videoId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export class SummaryService {
  static async generateSummary(input: GenerateSummaryInput): Promise<Summary> {
    try {
      // Call our summary generation API
      const response = await fetch("/api/summary/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: input.transcript,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Summary generation failed:", errorData);
        throw new Error(errorData.details || "Failed to generate summary");
      }

      const summaryData = await response.json();

      // Return the summary with temporary ID
      return {
        id: "temp-" + Date.now(),
        overview: summaryData.overview,
        mainPoints: summaryData.mainPoints,
        keyQuotes: summaryData.keyQuotes,
        detailedSummary: summaryData.detailedSummary,
        videoId: input.videoId,
        userId: input.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error in generateSummary:", error);
      throw error;
    }
  }
}
