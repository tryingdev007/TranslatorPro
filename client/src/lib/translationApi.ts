import { z } from "zod";
import { Language, TranslationRequest, TranslationResponse } from "@shared/schema";

// Translation APIs
export async function fetchLanguages(): Promise<Language[]> {
  const response = await fetch("/api/languages");
  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.statusText}`);
  }
  return response.json();
}

export async function translateText(request: TranslationRequest): Promise<TranslationResponse> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Translation failed with status: ${response.status}`);
  }
  
  return response.json();
}

export async function detectLanguage(text: string): Promise<{ language: string; confidence: number }[]> {
  const response = await fetch("/api/detect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ q: text }),
  });
  
  if (!response.ok) {
    throw new Error(`Language detection failed: ${response.statusText}`);
  }
  
  return response.json();
}
