import axios, { AxiosError } from "axios";
import he from "he";
import { find } from "lodash";
import striptags from "striptags";
import { SocksProxyAgent } from "socks-proxy-agent";

const SOCKS_PROXY_URL = process.env.SOCKS_PROXY_URL;

console.log(
  "[YouTube Service] Initializing with proxy:",
  SOCKS_PROXY_URL ? "✓" : "✗"
);

// Create proxy agent only if URL is available
const proxyAgent = SOCKS_PROXY_URL
  ? new SocksProxyAgent(SOCKS_PROXY_URL, { keepAlive: true })
  : undefined;

async function fetchData(url: string) {
  console.log("[YouTube Service] Fetching data from:", url);
  try {
    // Try with proxy first if available
    if (proxyAgent) {
      try {
        const { data } = await axios.get<string>(url, {
          httpsAgent: proxyAgent,
        });
        console.log("[YouTube Service] Data fetched successfully with proxy");
        return data;
      } catch (proxyError) {
        console.warn(
          "[YouTube Service] Proxy fetch failed, trying direct connection:",
          proxyError
        );
        // If proxy fails, fall back to direct connection
      }
    }

    // Direct connection (no proxy)
    const { data } = await axios.get<string>(url);
    console.log("[YouTube Service] Data fetched successfully without proxy");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("[YouTube Service] Network error:", {
        status: error.response?.status,
        message: error.message,
        cause: error.cause,
      });
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
    console.error("[YouTube Service] Unexpected error:", error);
    throw error;
  }
}

function parseSubtitles(transcript: string) {
  console.log("[YouTube Service] Parsing subtitles");
  const subtitles = transcript
    .replace('<?xml version="1.0" encoding="utf-8" ?><transcript>', "")
    .replace("</transcript>", "")
    .split("</text>")
    .filter((line: string) => line && line.trim())
    .map((line: string) => {
      const startRegex = /start="([\d.]+)"/;
      const durRegex = /dur="([\d.]+)"/;

      const startMatch = startRegex.exec(line);
      const start = startMatch?.at(1);

      const durMatch = durRegex.exec(line);
      const dur = durMatch?.at(1);

      const htmlText = line
        .replace(/<text.+>/, "")
        .replace(/&amp;/gi, "&")
        .replace(/<\/?[^>]+(>|$)/g, "");

      const decodedText = he.decode(htmlText);
      const text = striptags(decodedText);

      return {
        start,
        dur,
        text,
      };
    });

  console.log(`[YouTube Service] Parsed ${subtitles.length} subtitle segments`);
  return subtitles;
}

interface CaptionTrack {
  baseUrl: string;
  name: { simpleText: string };
  vssId: string;
  languageCode: string;
  kind: string;
  isTranslatable: boolean;
  trackName: string;
}

export interface SubtitleItem {
  start?: string;
  dur?: string;
  text: string;
}

export class YouTubeService {
  private readonly YOUTUBE_BASE_URL = "https://youtube.com/watch";

  public async getVideoId(url: string): Promise<string> {
    console.log("[YouTube Service] Extracting video ID from:", url);
    const videoIdMatch = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})(?:\?|&|\/|$)/);
    if (!videoIdMatch) {
      console.error("[YouTube Service] Invalid YouTube URL");
      throw new Error("Invalid YouTube URL");
    }
    console.log("[YouTube Service] Extracted video ID:", videoIdMatch[1]);
    return videoIdMatch[1];
  }

  public async getSubtitles(
    videoId: string,
    lang = "en"
  ): Promise<SubtitleItem[]> {
    console.log(
      `[YouTube Service] Getting subtitles for video: ${videoId}, language: ${lang}`
    );
    const data = await fetchData(`${this.YOUTUBE_BASE_URL}?v=${videoId}`);

    if (!data.includes("captionTracks")) {
      console.error("[YouTube Service] No caption tracks found in response");
      throw new Error(`Could not find captions for video: ${videoId}`);
    }

    const regex = /"captionTracks":(\[.*?\])/;
    const match = regex.exec(data);

    if (!match) {
      console.error("[YouTube Service] Failed to extract caption tracks data");
      throw new Error("Failed to extract caption tracks");
    }

    console.log("[YouTube Service] Parsing caption tracks data");
    const { captionTracks } = JSON.parse(`{${match[0]}}`);

    // Log available languages
    const availableLanguages = (captionTracks as CaptionTrack[]).map(
      (track) => `${track.languageCode} (${track.kind})`
    );
    console.log("[YouTube Service] Available languages:", availableLanguages);

    // Try to find subtitles in this order:
    // 1. Regular subtitles in requested language
    // 2. Auto-generated subtitles in requested language
    // 3. Any available subtitles
    const subtitle =
      // Try regular subtitles in requested language
      find(captionTracks, { vssId: `.${lang}` }) ||
      // Try auto-generated subtitles in requested language
      find(captionTracks, { vssId: `a.${lang}` }) ||
      // Try finding any track that matches the language code
      find(captionTracks, ({ languageCode }) => languageCode === lang) ||
      // If nothing found, use the first available track
      captionTracks[0];

    if (!subtitle || !subtitle.baseUrl) {
      console.error(`[YouTube Service] No captions found`);
      const error = new Error(
        `No captions found for video: ${videoId}`
      ) as Error & {
        availableLanguages?: string[];
      };
      error.availableLanguages = availableLanguages;
      throw error;
    }

    console.log("[YouTube Service] Using subtitle track:", {
      language: subtitle.languageCode,
      kind: subtitle.kind,
      name: subtitle.name?.simpleText,
    });

    const transcript = await fetchData(subtitle.baseUrl);
    return parseSubtitles(transcript);
  }

  public async getVideoMetadata(videoId: string) {
    console.log("[YouTube Service] Getting metadata for video:", videoId);
    const data = await fetchData(`${this.YOUTUBE_BASE_URL}?v=${videoId}`);

    // Extract title
    const titleMatch = data.match(/"title":"([^"]+)"/);
    const title = titleMatch ? he.decode(titleMatch[1]) : "";
    console.log("[YouTube Service] Extracted title:", title);

    // Extract thumbnail
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    console.log("[YouTube Service] Thumbnail URL:", thumbnailUrl);

    return {
      title,
      thumbnailUrl,
      videoId,
    };
  }
}

export const youtubeService = new YouTubeService();
