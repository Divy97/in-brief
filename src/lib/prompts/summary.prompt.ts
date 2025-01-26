import { ChatPromptTemplate } from "@langchain/core/prompts";

// Log the creation of the prompt template
console.log("Creating summary prompt template...");

export const summaryPrompt = ChatPromptTemplate.fromTemplate(`
You are an expert video content analyzer and summarizer. Your task is to create a comprehensive yet concise summary of the video transcript provided.

TRANSCRIPT:
{transcript}

Analyze the transcript and provide a summary in the following JSON format (do not include any other text, just the JSON):

{{
  "overview": "A brief overview of the main topic and purpose",
  "mainPoints": ["Key point 1", "Key point 2", ...],
  "keyQuotes": ["Notable quote 1", "Notable quote 2", ...],
  "detailedSummary": "A comprehensive summary that ties everything together"
}}

Guidelines:
1. Captures the main points and key takeaways
2. Maintains the original context and intent
3. Is well-structured and easy to understand
4. Highlights important quotes or statements
5. Includes a brief overview at the beginning

Keep the tone professional and engaging. Focus on accuracy and clarity.
`);

// Log the created prompt template
console.log(
  "Summary prompt template created with input variables:",
  summaryPrompt.inputVariables
);
