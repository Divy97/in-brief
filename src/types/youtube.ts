export interface VideoSubtitle {
  start?: string;
  dur?: string;
  text: string;
}

export interface VideoMetadata {
  title: string;
  thumbnailUrl: string;
  videoId: string;
}

export interface ProcessedVideoData extends VideoMetadata {
  subtitles: VideoSubtitle[];
}
