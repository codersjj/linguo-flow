'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProgress, Lesson, Feedback } from '../types';
import { logout as logoutAction } from '@/actions/auth';
import { markLessonComplete as markLessonCompleteAction, undoLessonComplete as undoLessonCompleteAction } from '@/actions/progress';

interface StoreContextType {
  user: User | null;
  progress: Record<string, UserProgress> | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  skipLogin: () => void;
  markLessonComplete: (lessonId: string) => void;
  undoLessonComplete: (lessonId: string) => void;
  submitFeedback: (feedback: Feedback) => void;
  lessons: Lesson[];
  isLoading: boolean;
  isLoggingOut: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{
  children: ReactNode;
  initialUser: User | null;
  initialLessons: Lesson[];
  initialProgress: Record<string, UserProgress>;
}> = ({ children, initialUser, initialLessons, initialProgress }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [lessons] = useState<Lesson[]>(initialLessons);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [progress, setProgress] = useState<Record<string, UserProgress> | null>(null);

  useEffect(() => {
    if (isLoggingOut) return;
    if (!isInitialized || initialUser !== user) {
      setUser(initialUser);
      setIsInitialized(true);
    }
  }, [initialUser, isLoggingOut]);

  // Sync progress when initialProgress changes (e.g., after login)
  useEffect(() => {
    if (isLoggingOut) return;
    if (initialProgress) {
      setProgress(initialProgress);
    }
  }, [initialProgress, isLoggingOut]);

  const login = async (email: string, password: string) => {
    console.warn("Login should be handled by Server Actions");
  };

  const register = async (name: string, email: string, password: string) => {
    console.warn("Register should be handled by Server Actions");
  };

  const logout = async () => {
    // Set logging out state to prevent navbar from showing "Sign In" button
    setIsLoggingOut(true);
    try {
      // Clear session on server first
      await logoutAction();
      // Redirect to auth page
      window.location.href = '/auth';
      // Intentionally do not reset isLoggingOut to prevent UI flicker during redirect
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  const skipLogin = () => {
    // Not supported
  };

  const markLessonComplete = async (lessonId: string) => {
    const today = new Date().toISOString();

    // Optimistic update
    setProgress(prev => {
      const existing = prev?.[lessonId];
      if (existing) {
        const lastDate = new Date(existing.lastReviewedDate).toDateString();
        const todayDate = new Date().toDateString();

        if (lastDate !== todayDate) {
          return {
            ...prev,
            [lessonId]: {
              ...existing,
              reviewCount: existing.reviewCount + 1,
              lastReviewedDate: today
            }
          };
        }
        return prev;
      } else {
        return {
          ...prev,
          [lessonId]: {
            id: Date.now(),
            userId: user?.id || 'guest',
            lessonId,
            isCompleted: true,
            lastReviewedDate: today,
            reviewCount: 1
          }
        };
      }
    });

    if (user) {
      await markLessonCompleteAction(lessonId);
    }
  };

  const undoLessonComplete = async (lessonId: string) => {
    // Optimistic update
    setProgress(prev => {
      const existing = prev?.[lessonId];
      if (!existing) return prev;

      if (existing.reviewCount > 1) {
        // Set lastReviewedDate to yesterday to prevent button flashing
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        return {
          ...prev,
          [lessonId]: {
            ...existing,
            reviewCount: existing.reviewCount - 1,
            lastReviewedDate: yesterday.toISOString()
          }
        };
      } else {
        const newProgress = { ...prev };
        delete newProgress[lessonId];
        return newProgress;
      }
    });

    if (user) {
      await undoLessonCompleteAction(lessonId);
    }
  };

  const submitFeedback = (feedback: Feedback) => {
    console.log("Feedback submitted:", feedback);
  };

  return (
    <StoreContext.Provider value={{
      user,
      progress,
      login,
      register,
      logout,
      skipLogin,
      markLessonComplete,
      undoLessonComplete,
      submitFeedback,
      lessons,
      isLoading,
      isLoggingOut
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};