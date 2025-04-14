import { useState } from "react";

export interface TranslationState {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  isTranslating: boolean;
  hasError: boolean;
  detectedLanguage: string | null;
  showNotification: boolean;
}

export const useTranslation = () => {
  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [sourceLanguage, setSourceLanguage] = useState<string>("en");
  const [targetLanguage, setTargetLanguage] = useState<string>("es");
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  return {
    sourceText,
    setSourceText,
    translatedText,
    setTranslatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isTranslating,
    setIsTranslating,
    hasError,
    setHasError,
    detectedLanguage,
    setDetectedLanguage,
    showNotification,
    setShowNotification,
  };
};
