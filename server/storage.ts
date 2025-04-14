import { 
  InsertTranslation, 
  Translation, 
  InsertSavedPhrase, 
  SavedPhrase, 
  User,
  InsertUser, 
  Language
} from "@shared/schema";

// Storage interface for our application
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Translation history
  getRecentTranslations(limit?: number): Promise<Translation[]>;
  getUserTranslations(userId: number, limit?: number): Promise<Translation[]>;
  addTranslation(translation: InsertTranslation): Promise<Translation>;
  
  // Saved phrases
  getSavedPhrases(userId?: number): Promise<SavedPhrase[]>;
  addSavedPhrase(phrase: InsertSavedPhrase): Promise<SavedPhrase>;
  deleteSavedPhrase(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private translations: Map<number, Translation>;
  private savedPhrases: Map<number, SavedPhrase>;
  private userIdCounter: number;
  private translationIdCounter: number;
  private savedPhraseIdCounter: number;

  constructor() {
    this.users = new Map();
    this.translations = new Map();
    this.savedPhrases = new Map();
    this.userIdCounter = 1;
    this.translationIdCounter = 1;
    this.savedPhraseIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Translation history methods
  async getRecentTranslations(limit: number = 5): Promise<Translation[]> {
    const translations = Array.from(this.translations.values());
    return translations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getUserTranslations(userId: number, limit: number = 5): Promise<Translation[]> {
    const translations = Array.from(this.translations.values())
      .filter(t => t.userId === userId);
    
    return translations
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async addTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const id = this.translationIdCounter++;
    const translation: Translation = { 
      ...insertTranslation, 
      id, 
      createdAt: new Date() 
    };
    this.translations.set(id, translation);
    return translation;
  }

  // Saved phrases methods
  async getSavedPhrases(userId?: number): Promise<SavedPhrase[]> {
    const phrases = Array.from(this.savedPhrases.values());
    
    if (userId !== undefined) {
      return phrases
        .filter(p => p.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return phrases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async addSavedPhrase(insertPhrase: InsertSavedPhrase): Promise<SavedPhrase> {
    const id = this.savedPhraseIdCounter++;
    const phrase: SavedPhrase = { 
      ...insertPhrase, 
      id, 
      createdAt: new Date() 
    };
    this.savedPhrases.set(id, phrase);
    return phrase;
  }

  async deleteSavedPhrase(id: number): Promise<boolean> {
    return this.savedPhrases.delete(id);
  }
}

export const storage = new MemStorage();
