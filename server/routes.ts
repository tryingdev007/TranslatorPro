import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translationRequestSchema, translationResponseSchema, languageSchema } from "@shared/schema";
import { z } from "zod";
import fetch from "node-fetch";

const LIBRE_TRANSLATE_API = "https://libretranslate.de/";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get available languages
  app.get("/api/languages", async (req, res) => {
    try {
      const response = await fetch(`${LIBRE_TRANSLATE_API}languages`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch languages: ${response.statusText}`);
      }
      
      const data = await response.json();
      const languages = z.array(languageSchema).parse(data);
      
      res.json(languages);
    } catch (error) {
      console.error("Error fetching languages:", error);
      res.status(500).json({ 
        message: "Failed to fetch available languages" 
      });
    }
  });

  // Translate text
  app.post("/api/translate", async (req, res) => {
    try {
      const validatedData = translationRequestSchema.parse(req.body);
      
      const response = await fetch(`${LIBRE_TRANSLATE_API}translate`, {
        method: "POST",
        body: JSON.stringify({
          q: validatedData.q,
          source: validatedData.source,
          target: validatedData.target,
          format: "text",
        }),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Add to translation history
      const translation = await storage.addTranslation({
        sourceText: validatedData.q,
        translatedText: data.translatedText,
        sourceLanguage: validatedData.source,
        targetLanguage: validatedData.target,
        detectedLanguage: data.detectedLanguage?.language,
        detectedConfidence: data.detectedLanguage?.confidence 
          ? Math.round(data.detectedLanguage.confidence * 100) 
          : undefined,
        userId: undefined // No user authentication in this version
      });
      
      res.json({
        translatedText: data.translatedText,
        detectedLanguage: data.detectedLanguage
      });
    } catch (error) {
      console.error("Translation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid translation request", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : "Translation failed" 
        });
      }
    }
  });

  // Detect language
  app.post("/api/detect", async (req, res) => {
    try {
      const schema = z.object({ q: z.string().nonempty("Text to detect is required") });
      const { q } = schema.parse(req.body);
      
      const response = await fetch(`${LIBRE_TRANSLATE_API}detect`, {
        method: "POST",
        body: JSON.stringify({ q }),
        headers: { "Content-Type": "application/json" }
      });
      
      if (!response.ok) {
        throw new Error(`Language detection failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Detection error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid detection request", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: error instanceof Error ? error.message : "Language detection failed" 
        });
      }
    }
  });

  // Get recent translations
  app.get("/api/translations/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const translations = await storage.getRecentTranslations(limit);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching recent translations:", error);
      res.status(500).json({ 
        message: "Failed to fetch recent translations" 
      });
    }
  });

  // Saved phrases
  app.get("/api/saved-phrases", async (req, res) => {
    try {
      const savedPhrases = await storage.getSavedPhrases();
      res.json(savedPhrases);
    } catch (error) {
      console.error("Error fetching saved phrases:", error);
      res.status(500).json({ 
        message: "Failed to fetch saved phrases" 
      });
    }
  });

  app.post("/api/saved-phrases", async (req, res) => {
    try {
      const schema = z.object({
        sourceText: z.string().nonempty(),
        translatedText: z.string().nonempty(),
        sourceLanguage: z.string().nonempty(),
        targetLanguage: z.string().nonempty(),
      });
      
      const validatedData = schema.parse(req.body);
      
      const savedPhrase = await storage.addSavedPhrase({
        ...validatedData,
        userId: undefined // No user authentication in this version
      });
      
      res.status(201).json(savedPhrase);
    } catch (error) {
      console.error("Error saving phrase:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid saved phrase data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Failed to save phrase" 
        });
      }
    }
  });

  app.delete("/api/saved-phrases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSavedPhrase(id);
      
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Saved phrase not found" });
      }
    } catch (error) {
      console.error("Error deleting saved phrase:", error);
      res.status(500).json({ 
        message: "Failed to delete saved phrase" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
