export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration: number;
  summary?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Summary {
  id: string;
  videoId: string;
  content: string;
  createdAt: Date;
}
