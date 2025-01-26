import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import { NextResponse } from "next/server";
import { summaryPrompt } from "@/lib/prompts/summary.prompt";
import { AIMessage } from "@langchain/core/messages";

interface APIErrorResponse {
  message?: string;
  code?: string;
  type?: string;
  [key: string]: unknown;
}

interface APIError extends Error {
  response?: {
    status: number;
    data: APIErrorResponse;
  };
  cause?: Error;
}

// Schema for the summary output
const summaryOutputSchema = z.object({
  overview: z.string().describe("A brief overview of the video content"),
  mainPoints: z
    .array(z.string())
    .describe("Array of main points discussed in the video"),
  keyQuotes: z
    .array(z.string())
    .describe("Array of important quotes from the transcript"),
  detailedSummary: z
    .string()
    .describe("A comprehensive summary of the content"),
});

// Input validation schema
const inputSchema = z.object({
  transcript: z.string(),
});

export async function POST(req: Request) {
  try {
    console.log("=== Starting summary generation ===");

    // Parse request body
    const body = await req.json();
    console.log("Request body received:", JSON.stringify(body, null, 2));

    // Validate input
    const { transcript } = inputSchema.parse(body);
    console.log("Transcript length:", transcript.length);
    console.log("First 100 chars of transcript:", transcript.slice(0, 100));

    // Initialize model
    console.log("Initializing Groq model...");
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      maxTokens: 4000,
    });
    console.log("Model initialized with config:", {
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      maxTokens: 4000,
    });

    // Log prompt template
    console.log(
      "Prompt template input variables:",
      summaryPrompt.inputVariables
    );
    console.log("Creating chain...");

    // Create the chain
    const chain = summaryPrompt.pipe(model);

    console.log("Chain created, invoking with transcript...");

    // Generate the summary
    const response = await chain.invoke({
      transcript,
    });

    console.log("Raw model response:", response);

    // Ensure response is an AIMessage
    if (!(response instanceof AIMessage)) {
      throw new Error("Unexpected response type from model");
    }

    // Parse the content as JSON
    const jsonContent = JSON.parse(response.content as string);
    console.log("Parsed JSON content:", jsonContent);

    // Validate against our schema
    const validatedResponse = summaryOutputSchema.parse(jsonContent);
    console.log("Validated response:", validatedResponse);

    return NextResponse.json(validatedResponse);
  } catch (err) {
    console.error("Error in summary generation:");

    const error = err as APIError;
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    if (error.cause) {
      console.error("Error cause:", error.cause);
    }

    if (error.response) {
      console.error("API Response error:", {
        status: error.response.status,
        data: error.response.data,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to generate summary",
        details: error.message,
        type: error.name,
        ...(error.response && { apiError: error.response }),
      },
      { status: 500 }
    );
  }
}
