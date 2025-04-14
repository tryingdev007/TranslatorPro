import { users, type User, type InsertUser } from "@shared/schema";
import { translations, type Translation, type InsertTranslation } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Translation related methods
  saveTranslation(translation: InsertTranslation): Promise<Translation>;
  getTranslationHistory(limit?: number): Promise<Translation[]>;
  clearTranslationHistory(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private translationHistory: Translation[];
  currentId: number;
  translationId: number;

  constructor() {
    this.users = new Map();
    this.translationHistory = [];
    this.currentId = 1;
    this.translationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const id = this.translationId++;
    const now = new Date();
    
    const translation: Translation = {
      ...insertTranslation,
      id,
      timestamp: now,
    };
    
    // Add to beginning of array (newest first)
    this.translationHistory.unshift(translation);
    
    // Keep only the last 50 translations
    if (this.translationHistory.length > 50) {
      this.translationHistory = this.translationHistory.slice(0, 50);
    }
    
    return translation;
  }
  
  async getTranslationHistory(limit?: number): Promise<Translation[]> {
    if (limit) {
      return this.translationHistory.slice(0, limit);
    }
    return this.translationHistory;
  }
  
  async clearTranslationHistory(): Promise<void> {
    this.translationHistory = [];
  }
}

export const storage = new MemStorage();
