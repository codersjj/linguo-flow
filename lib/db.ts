import { User, UserProgress } from '../types';

/**
 * MOCK DATABASE ADAPTER
 * This mimics a PostgreSQL client interaction.
 * In a real Next.js app, this would use 'pg' or Prisma/Drizzle.
 */

const DELAY = 300; // Simulate network latency

class Database {
  private delay() {
    return new Promise(resolve => setTimeout(resolve, DELAY));
  }

  // Generic helper to simulate a SQL table storage
  private getTable<T>(tableName: string): T[] {
    try {
      const data = localStorage.getItem(`pg_db_${tableName}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  private saveTable<T>(tableName: string, data: T[]) {
    localStorage.setItem(`pg_db_${tableName}`, JSON.stringify(data));
  }

  // --- USERS TABLE OPERATIONS ---
  
  public users = {
    create: async (user: User): Promise<User> => {
      await this.delay();
      const users = this.getTable<User>('users');
      if (users.some(u => u.email === user.email)) {
        throw new Error("User with this email already exists");
      }
      users.push(user);
      this.saveTable('users', users);
      return user;
    },

    findByEmail: async (email: string): Promise<User | null> => {
      await this.delay();
      const users = this.getTable<User>('users');
      return users.find(u => u.email === email) || null;
    }
  };

  // --- PROGRESS TABLE OPERATIONS ---
  // Schema conceptually: { userEmail, lessonId, isCompleted, lastReviewedDate, reviewCount }

  public progress = {
    findByUser: async (email: string): Promise<Record<string, UserProgress>> => {
      await this.delay();
      const allRows = this.getTable<UserProgress & { userEmail: string }>('progress');
      const userRows = allRows.filter(row => row.userEmail === email);
      
      // Convert normalized rows back to the Record<lessonId, UserProgress> format for the frontend
      return userRows.reduce((acc, row) => {
        const { userEmail, ...progress } = row;
        acc[progress.lessonId] = progress;
        return acc;
      }, {} as Record<string, UserProgress>);
    },

    upsert: async (email: string, progress: UserProgress): Promise<void> => {
      await this.delay(); // fast write
      const allRows = this.getTable<UserProgress & { userEmail: string }>('progress');
      const index = allRows.findIndex(r => r.userEmail === email && r.lessonId === progress.lessonId);
      
      const newRow = { ...progress, userEmail: email };
      
      if (index >= 0) {
        allRows[index] = newRow;
      } else {
        allRows.push(newRow);
      }
      this.saveTable('progress', allRows);
    },

    delete: async (email: string, lessonId: string): Promise<void> => {
      await this.delay();
      let allRows = this.getTable<UserProgress & { userEmail: string }>('progress');
      allRows = allRows.filter(r => !(r.userEmail === email && r.lessonId === lessonId));
      this.saveTable('progress', allRows);
    }
  };
}

export const db = new Database();