export type Stage = 'intermediate' | 'advanced' | 'movies';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  stage: Stage;
  type: 'audio' | 'video' | 'mixed' | 'text';
  duration: string;
  thumbnail: string; // URL
  mediaUrl: string; // URL to audio/video
  transcript: string;
  textContent?: string | null;
}

export interface UserProgress {
  lessonId: string;
  isCompleted: boolean;
  lastReviewedDate: string; // ISO Date string
  reviewCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Stored in mock DB
  isGuest?: boolean;
}

export interface Feedback {
  lessonId: string;
  content: string;
  type: 'correction' | 'suggestion';
}