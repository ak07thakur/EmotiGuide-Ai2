
export enum Emotion {
  HAPPY = 'Happy',
  SAD = 'Sad',
  ANGRY = 'Angry',
  NEUTRAL = 'Neutral',
  SURPRISED = 'Surprised',
  STRESSED = 'Stressed'
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  major?: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  emotion: Emotion;
  timestamp: number;
  confidence: number;
  note?: string;
}

export interface CareerAdvice {
  title: string;
  description: string;
  steps: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
