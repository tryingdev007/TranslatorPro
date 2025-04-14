import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Translation history
export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  sourceText: text("source_text").notNull(),
  translatedText: text("translated_text").notNull(),
  sourceLanguage: text("source_language").notNull(),
  targetLanguage: text("target_language").notNull(),
  detectedLanguage: text("detected_language"),
  detectedConfidence: integer("detected_confidence"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranslationSchema = createInsertSchema(translations).omit({
  id: true,
  createdAt: true,
});

export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;

// Saved phrases
export const savedPhrases = pgTable("saved_phrases", {
  id: serial("id").primaryKey(),
  sourceText: text("source_text").notNull(),
  translatedText: text("translated_text").notNull(),
  sourceLanguage: text("source_language").notNull(),
  targetLanguage: text("target_language").notNull(),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedPhraseSchema = createInsertSchema(savedPhrases).omit({
  id: true,
  createdAt: true,
});

export type InsertSavedPhrase = z.infer<typeof insertSavedPhraseSchema>;
export type SavedPhrase = typeof savedPhrases.$inferSelect;

// Languages schema
export const languageSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type Language = z.infer<typeof languageSchema>;

// Translation request schema
export const translationRequestSchema = z.object({
  q: z.string().nonempty("Text to translate is required"),
  source: z.string(),
  target: z.string().nonempty("Target language is required"),
});

export type TranslationRequest = z.infer<typeof translationRequestSchema>;

// Translation response schema
export const translationResponseSchema = z.object({
  translatedText: z.string(),
  detectedLanguage: z.object({
    language: z.string().optional(),
    confidence: z.number().optional()
  }).optional()
});

export type TranslationResponse = z.infer<typeof translationResponseSchema>;
