import React, { createContext, useContext } from "react";
import { useTranslation, TranslationState } from "@/hooks/useTranslation";

// Define the shape of the context
type TranslationContextType = TranslationState & {
  setSourceText: (text: string) => void;
  setTranslatedText: (text: string) => void;
  setSourceLanguage: (lang: string) => void;
  setTargetLanguage: (lang: string) => void;
  setIsTranslating: (isTranslating: boolean) => void;
  setHasError: (hasError: boolean) => void;
  setDetectedLanguage: (lang: string | null) => void;
  setShowNotification: (show: boolean) => void;
};

// Create context with a default undefined value
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Provider component
export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const translation = useTranslation();
  
  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook to use the translation context
export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  
  if (context === undefined) {
    throw new Error("useTranslationContext must be used within a TranslationProvider");
  }
  
  return context;
};
