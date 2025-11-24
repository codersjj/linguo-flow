'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserProgress, Lesson, Feedback } from '../types';
import { MOCK_LESSONS } from '../constants/lessons';
import { db } from '../lib/db';

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

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<Record<string, UserProgress>>({});
  const [lessons] = useState<Lesson[]>(MOCK_LESSONS);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Session
  useEffect(() => {
    const initSession = async () => {
      const storedUser = localStorage.getItem('linguo_session_user'); // Only strictly session data here
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch data from "DB"
        if (!parsedUser.isGuest) {
          try {
            const userProgress = await db.progress.findByUser(parsedUser.email);
            setProgress(userProgress);
          } catch (err) {
            console.error("Failed to load progress from DB", err);
          }
        }
      }
      setIsLoading(false);
    };

    initSession();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API Call to /api/auth/login
    const foundUser = await db.users.findByEmail(email);

    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      localStorage.setItem('linguo_session_user', JSON.stringify(foundUser));

      // Load their progress
      const userProgress = await db.progress.findByUser(foundUser.email);
      setProgress(userProgress);
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API Call to /api/auth/register
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      isGuest: false
    };

    await db.users.create(newUser);

    setUser(newUser);
    localStorage.setItem('linguo_session_user', JSON.stringify(newUser));
    setProgress({});
  };

  const skipLogin = () => {
    const guestUser = { id: 'guest', name: 'Guest', email: '', isGuest: true };
    setUser(guestUser);
    localStorage.setItem('linguo_session_user', JSON.stringify(guestUser));
    setProgress({});
  };

  const logout = () => {
    setUser(null);
    setProgress({});
    localStorage.removeItem('linguo_session_user');
  };

  const markLessonComplete = async (lessonId: string) => {
    // 1. Optimistic Update
    const today = new Date().toISOString().split('T')[0];
    let newProgressItem: UserProgress;

    setProgress(prev => {
      const current = prev[lessonId];

      if (!current) {
        newProgressItem = {
          lessonId,
          isCompleted: true,
          lastReviewedDate: today,
          reviewCount: 1
        };
      } else {
        const lastDate = current.lastReviewedDate.split('T')[0];
        if (lastDate !== today) {
          newProgressItem = {
            ...current,
            lastReviewedDate: today,
            reviewCount: current.reviewCount + 1
          };
        } else {
          newProgressItem = current;
        }
      }

      return { ...prev, [lessonId]: newProgressItem };
    });

    // 2. Persist to DB
    if (user && !user.isGuest) {
      // @ts-ignore - Variable is definitely assigned inside setState callback logic but TS can't see it easily here
      // In a real app we'd structure this to avoid the ignore, but sticking to logic:
      if (newProgressItem!) {
        await db.progress.upsert(user.email, newProgressItem);
      }
    }
  };

  const undoLessonComplete = async (lessonId: string) => {
    const today = new Date().toISOString().split('T')[0];

    let shouldDelete = false;
    let updatedItem: UserProgress | null = null;

    setProgress(prev => {
      const current = prev[lessonId];
      if (!current) return prev;

      // Only allow undo if the action was done today
      if (current.lastReviewedDate.split('T')[0] !== today) {
        return prev;
      }

      if (current.reviewCount <= 1) {
        // Remove completely
        shouldDelete = true;
        const { [lessonId]: _, ...rest } = prev;
        return rest;
      } else {
        // Decrement
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        updatedItem = {
          ...current,
          reviewCount: current.reviewCount - 1,
          lastReviewedDate: yesterdayString
        };

        return {
          ...prev,
          [lessonId]: updatedItem
        };
      }
    });

    // DB Sync
    if (user && !user.isGuest) {
      if (shouldDelete) {
        await db.progress.delete(user.email, lessonId);
      } else if (updatedItem) {
        await db.progress.upsert(user.email, updatedItem);
      }
    }
  };

  const submitFeedback = (feedback: Feedback) => {
    console.log("Feedback submitted to DB:", feedback);
    // In a real app: await db.feedback.create(feedback);
    alert("Feedback received! Thank you for helping us improve.");
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