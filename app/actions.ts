"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import OpenAI from "openai";
import { type QuizData } from "@/types/quiz";
import Parser from "rss-parser";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirect_to")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  // Check if we have an anonymous session
  const { data: { session } } = await supabase.auth.getSession();
  const isAnonymousUser = session?.user && !session.user.email;

  if (isAnonymousUser) {
    // If we have an anonymous user, update their email and password
    const { error: updateError } = await supabase.auth.updateUser({
      email,
      password,
      data: {
        email_confirmed: true,
      }
    });

    if (updateError) {
      console.error(updateError.code + " " + updateError.message);
      return encodedRedirect("error", "/sign-up", updateError.message);
    }

    // Redirect to the quiz page or specified redirect URL
    return redirect(redirectTo || "/quiz");
  } else {
    // For new users, create a new account
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          email_confirmed: true,
        },
      },
    });

    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/sign-up", error.message);
    }

    // Sign in the user immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return encodedRedirect("error", "/sign-up", signInError.message);
    }

    // Redirect to the quiz page or specified redirect URL
    return redirect(redirectTo || "/quiz");
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// ==============================
// to extract content from the blog url
// ==============================
interface ExtractedContent {
  title: string | null;
  content: string | null;
  htmlContent?: string | null;
  error?: string | null;
}

const parser = new Parser({
  customFields: {
    item: [
      ["content:encoded", "fullContent"],
      ["description", "rssDescription"],
    ],
  },
});

async function extractViaRSS(url: string): Promise<ExtractedContent | null> {
  console.log(`Attempting RSS extraction for: ${url}`);
  try {
    const feed = await parser.parseURL(url);
    if (feed?.items?.length > 0) {
      const item = feed.items[0];
      const content =
        item.fullContent ||
        item.content ||
        item.contentSnippet ||
        item.rssDescription;
      console.log(`RSS extraction successful for: ${url}`);
      return {
        title: item.title ?? null,
        content: content ? stripHtml(content) : null,
        htmlContent: content ?? null,
        error: null,
      };
    }
  } catch (error) {
    console.warn(`Direct RSS parsing failed for ${url}:`, error);
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "QuizifyBot/1.0" },
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch page for feed discovery: ${response.statusText}`
      );
      return null;
    }
    const html = await response.text();
    const doc = new JSDOM(html, { url });

    const feedLink = doc.window.document.querySelector<HTMLLinkElement>(
      'link[rel="alternate"][type="application/rss+xml"], link[rel="alternate"][type="application/atom+xml"]'
    )?.href;

    if (feedLink) {
      const absoluteFeedLink = new URL(feedLink, url).toString();
      console.log(`Found feed link: ${absoluteFeedLink}. Attempting parse...`);
      const feed = await parser.parseURL(absoluteFeedLink);
      if (feed?.items?.length > 0) {
        const matchingItem =
          feed.items.find((item) => item.link === url) ?? feed.items[0];
        const content =
          matchingItem.fullContent ||
          matchingItem.content ||
          matchingItem.contentSnippet ||
          matchingItem.rssDescription;
        console.log(
          `RSS extraction via discovered feed successful for: ${url}`
        );
        return {
          title: matchingItem.title ?? null,
          content: content ? stripHtml(content) : null,
          htmlContent: content ?? null,
          error: null,
        };
      }
    }
  } catch (error) {
    console.warn(`Feed discovery and parsing failed for ${url}:`, error);
  }

  console.log(`RSS extraction failed for: ${url}. Falling back to scraping.`);
  return null;
}

async function scrapeBlogContent(url: string): Promise<ExtractedContent> {
  console.log(`Attempting HTML scraping for: ${url}`);
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "QuizifyBot/1.0 (+http://localhost:3000/bot)",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }
    const html = await response.text();
    const doc = new JSDOM(html, { url });

    if (doc.window.document.body.textContent?.includes("Enable JavaScript")) {
      console.warn(`JavaScript might be required for ${url}`);
    }

    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article || !article.content) {
      throw new Error("Readability could not parse the article content.");
    }

    console.log(`HTML scraping successful for: ${url}`);
    return {
      title: article.title || null,
      content: article.textContent || null,
      htmlContent: article.content || null,
      error: null,
    };
  } catch (error: any) {
    console.error(`HTML scraping failed for ${url}:`, error);
    return {
      title: null,
      content: null,
      error: `Failed to scrape content: ${error.message}`,
    };
  }
}

function stripHtml(html: string): string {
  try {
    const doc = new JSDOM(`<body>${html}</body>`);
    return doc.window.document.body.textContent || "";
  } catch (e) {
    console.error("Error stripping HTML:", e);
    return html.replace(/<[^>]*>?/gm, "");
  }
}

// --- Zod Schema for URL validation ---
const UrlSchema = z.string().url({ message: "Please enter a valid URL." });

// --- Define the expected state structure returned by the action ---
interface FormState {
  title: string | null;
  content: string | null; // Extracted content
  quizData?: QuizData | null; // Generated quiz data from LLM
  error?: string | null; // Error messages
}

// --- OpenAI Client Initialization for OpenRouter ---
// Ensure OPENROUTER_API_KEY is set in your .env.local
const openrouterApiKey = process.env.OPENROUTER_API_KEY;

if (!openrouterApiKey) {
  console.error("OPENROUTER_API_KEY is not set in environment variables.");
  // Potentially throw an error or handle this case appropriately
  // For now, we'll let actions fail if the key is missing.
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // OpenRouter endpoint
  apiKey: openrouterApiKey,
});

// --- Helper Function to Generate Quiz using LLM ---
async function generateQuizWithLLM(
  content: string,
  title: string | null
): Promise<QuizData | null> {
  if (!openai.apiKey) {
    throw new Error("OpenRouter API key not configured.");
  }

  const model = "openai/gpt-3.5-turbo"; // Or choose another model like "anthropic/claude-3-haiku" etc.
  const maxTokens = 1500; // Adjust as needed

  // --- System Prompt ---
  const systemPrompt = `You are an expert quiz generator. Given the following text content, create a multiple-choice quiz with 3-5 questions. Each question should have 4 options. Ensure one option is clearly the correct answer based *only* on the provided text.

    Output the quiz *only* as a valid JSON object following this exact structure:
    {
      "title": "Quiz based on: [Use the provided title or a concise summary of the content]",
      "questions": [
        {
          "id": "q1", // Unique ID like q1, q2, etc.
          "questionText": "The text of the first question?",
          "options": [
            { "id": "q1-opt1", "text": "Option 1 text" },
            { "id": "q1-opt2", "text": "Option 2 text" },
            { "id": "q1-opt3", "text": "Option 3 text" },
            { "id": "q1-opt4", "text": "Option 4 text" }
          ],
          "correctOptionId": "q1-optX" // The id of the correct option (e.g., "q1-opt2")
        },
        // give 5 - 7 more questions
      ]
    }

    Do not include any explanations, introductory text, or markdown formatting outside the JSON object. The entire response must be only the JSON object.`;

  // --- User Prompt ---
  const userPrompt = `Generate a quiz based on the following content (Title: ${title || "Untitled"}):\n\n---\n\n${content}\n\n---`;

  try {
    console.log(`Requesting quiz generation from ${model}...`);
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" }, // Request JSON output if model supports it
      temperature: 0.5, // Adjust creativity (lower for factual)
      max_tokens: maxTokens,
    });

    const jsonResponse = completion.choices[0]?.message?.content;

    if (!jsonResponse) {
      throw new Error("LLM returned an empty response.");
    }

    console.log("LLM Raw Response:", jsonResponse);

    // --- Parse and Validate JSON ---
    let parsedQuizData: any;
    try {
      parsedQuizData = JSON.parse(jsonResponse);
    } catch (parseError) {
      console.error("Failed to parse LLM JSON response:", parseError);
      console.error("Raw response was:", jsonResponse);
      throw new Error("Failed to parse quiz data from LLM response.");
    }

    // Basic validation (can be enhanced with Zod later if needed)
    if (
      !parsedQuizData ||
      typeof parsedQuizData !== "object" ||
      !parsedQuizData.title ||
      !Array.isArray(parsedQuizData.questions) ||
      parsedQuizData.questions.length === 0
    ) {
      console.error("Invalid quiz data structure received:", parsedQuizData);
      throw new Error("Received invalid quiz data structure from LLM.");
    }

    // Further validation for questions and options can be added here

    console.log("Successfully parsed QuizData.");
    return parsedQuizData as QuizData; // Cast to our type
  } catch (error: any) {
    console.error("Error calling OpenRouter API:", error);
    // Refine error message based on potential API errors
    if (error.response) {
      console.error("API Response Status:", error.response.status);
      console.error("API Response Data:", error.response.data);
    }
    throw new Error(`Failed to generate quiz: ${error.message}`);
  }
}

// --- Main Server Action ---
export async function extractContentAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const url = formData.get("url");

  // --- 1. Validate URL ---
  const validatedUrl = UrlSchema.safeParse(url);
  if (!validatedUrl.success) {
    return {
      title: null,
      content: null,
      quizData: null,
      error: validatedUrl.error.errors[0]?.message ?? "Invalid URL provided.",
    };
  }

  // --- 2. Fetch and Extract Content ---
  let article: { title: string; content: string; textContent: string };
  try {
    const response = await fetch(validatedUrl.data);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    const doc = new JSDOM(html, { url: validatedUrl.data });

    // Use Readability to extract the main content
    const reader = new Readability(doc.window.document);
    const extracted = reader.parse();

    if (!extracted || !extracted.content || !extracted.textContent) {
      throw new Error("Could not extract content using Readability.");
    }
    article = {
      title: extracted.title || "",
      content: extracted.content, // HTML content
      textContent: extracted.textContent, // Plain text content
    };
    console.log(`Extracted Title: ${article.title}`);
    console.log(`Extracted Text Content Length: ${article.textContent.length}`);
  } catch (error: any) {
    console.error("Error fetching or parsing URL:", error);
    return {
      title: null,
      content: null,
      quizData: null,
      error: `Failed to fetch or parse content: ${error.message}`,
    };
  }

  // --- 3. Generate Quiz using LLM ---
  try {
    // Use textContent for the LLM prompt as it's cleaner
    const generatedQuiz = await generateQuizWithLLM(
      article.textContent,
      article.title
    );

    if (!generatedQuiz) {
      throw new Error("Quiz generation returned null.");
    }

    // --- 4. Return Success State with Quiz Data ---
    return {
      title: article.title,
      content: article.textContent, // Return text content for potential future use
      quizData: generatedQuiz,
      error: null,
    };
  } catch (error: any) {
    console.error("Error during quiz generation step:", error);
    return {
      title: article.title, // Still return title/content if extraction worked
      content: article.textContent,
      quizData: null,
      error: `Quiz generation failed: ${error.message}`,
    };
  }
}
