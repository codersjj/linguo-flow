'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProgress, Lesson, Feedback } from '../types';
import { logout as logoutAction } from '@/actions/auth';

interface StoreContextType {
  user: User | null;
  progress: Record<string, UserProgress>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  skipLogin: () => void;
  markLessonComplete: (lessonId: string) => void;
  undoLessonComplete: (lessonId: string) => void;
  submitFeedback: (feedback: Feedback) => void;
  lessons: Lesson[];
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{
  children: ReactNode;
  initialUser: User | null;
  initialLessons: Lesson[];
}> = ({ children, initialUser, initialLessons }) => {
  // Use a ref to track if we've set the user from initialUser
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [lessons] = useState<Lesson[]>(initialLessons);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});

  // Initialize user from initialUser on mount and when it changes
  useEffect(() => {
    if (!isInitialized || initialUser !== user) {
      setUser(initialUser);
      setIsInitialized(true);
    }
  }, [initialUser]);

  const login = async (email: string, password: string) => {
    console.warn("Login should be handled by Server Actions");
  };

  const register = async (name: string, email: string, password: string) => {
    console.warn("Register should be handled by Server Actions");
  };

  const logout = async () => {
    // Call server action to clear session cookie
    await logoutAction();
    // Clear client-side user state
    setUser(null);
    // Redirect to auth page
    window.location.href = '/auth';
  };

  const skipLogin = () => {
    // Not supported
  };

  const markLessonComplete = (lessonId: string) => {
    // Handled by LessonClientWrapper
  };

  const undoLessonComplete = (lessonId: string) => {
    // Handled by LessonClientWrapper
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
      isLoading
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