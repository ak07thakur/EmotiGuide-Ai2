
import React from 'react';
import { Emotion } from './types';

export const EMOTION_COLORS: Record<Emotion, string> = {
  [Emotion.HAPPY]: '#22c55e', // Green-500
  [Emotion.SAD]: '#3b82f6',   // Blue-500
  [Emotion.ANGRY]: '#ef4444', // Red-500
  [Emotion.NEUTRAL]: '#94a3b8', // Slate-400
  [Emotion.SURPRISED]: '#f59e0b', // Amber-500
  [Emotion.STRESSED]: '#8b5cf6', // Violet-500
};

export const MOOD_MUSIC: Record<Emotion, { title: string; artist: string; url: string; category: string }> = {
  [Emotion.HAPPY]: { title: 'Sunshine Vibes', artist: 'Happy Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', category: 'Party & Upbeat' },
  [Emotion.SAD]: { title: 'Melancholy Rain', artist: 'Nature Sounds', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', category: 'Calm & Soothing' },
  [Emotion.ANGRY]: { title: 'Deep Focus', artist: 'Zen Masters', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', category: 'Relaxation' },
  [Emotion.NEUTRAL]: { title: 'Lo-Fi Study', artist: 'Study Girl', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', category: 'Study Music' },
  [Emotion.SURPRISED]: { title: 'Upbeat Energy', artist: 'Future Bass', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', category: 'High Energy' },
  [Emotion.STRESSED]: { title: 'Peaceful Meditation', artist: 'Inner Peace', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', category: 'Stress Relief' },
};
