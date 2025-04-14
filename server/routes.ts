import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { translationRequestSchema, Translation } from "@shared/schema";
import fetch from "node-fetch";

export async function registerRoutes(app: Express): Promise<Server> {
  // Translation API endpoint
  app.post("/api/translate", async (req, res) => {
    try {
      // Validate request body
      const result = translationRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request", 
          errors: result.error.errors 
        });
      }
      
      const { sourceText, sourceLanguage, targetLanguage } = result.data;
      
      // Don't translate if source and target are the same
      if (sourceLanguage === targetLanguage) {
        return res.json({ 
          translatedText: sourceText,
          detectedLanguage: null 
        });
      }
      
      // Call LibreTranslate API for translation
      const apiUrl = "https://libretranslate.de/translate";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: sourceText,
          source: sourceLanguage,
          target: targetLanguage,
          format: "text",
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Translation API error:", errorText);
        return res.status(502).json({ message: "Translation service unavailable" });
      }
      
      const data = await response.json() as { translatedText: string };
      
      // Save translation to history
      await storage.saveTranslation({
        sourceText,
        translatedText: data.translatedText,
        sourceLanguage,
        targetLanguage,
      });
      
      // Return the translation
      return res.json({
        translatedText: data.translatedText,
        detectedLanguage: null // LibreTranslate doesn't return detected language by default
      });
    } catch (error) {
      console.error("Translation error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Get translation history
  app.get("/api/translations/history", async (req, res) => {
    try {
      const history = await storage.getTranslationHistory(10); // Limit to last 10 translations
      return res.json(history);
    } catch (error) {
      console.error("Error fetching translation history:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Clear translation history
  app.delete("/api/translations/history", async (req, res) => {
    try {
      await storage.clearTranslationHistory();
      return res.json({ success: true });
    } catch (error) {
      console.error("Error clearing translation history:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
