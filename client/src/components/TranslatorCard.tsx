import { useTranslationContext } from "@/context/TranslationContext";
import LanguageSelector from "./LanguageSelector";
import SourceTextInput from "./SourceTextInput";
import TranslatedOutput from "./TranslatedOutput";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function TranslatorCard() {
  const { 
    sourceText, 
    sourceLanguage, 
    targetLanguage, 
    setTranslatedText,
    isTranslating,
    setIsTranslating,
    hasError,
    setHasError,
    detectedLanguage,
    setDetectedLanguage
  } = useTranslationContext();
  
  const { toast } = useToast();
  
  // Handle the translation action
  const handleTranslate = async () => {
    if (!sourceText.trim()) return; // Don't translate if there's no text
    
    try {
      setIsTranslating(true);
      setHasError(false);
      
      const response = await apiRequest("POST", "/api/translate", {
        sourceText,
        sourceLanguage,
        targetLanguage,
      });
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
      
      if (data.detectedLanguage) {
        setDetectedLanguage(data.detectedLanguage);
      }
      
      // Invalidate translation history query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['/api/translations/history'] });
      
    } catch (error) {
      console.error("Translation error:", error);
      setHasError(true);
      toast({
        variant: "destructive",
        title: "Translation failed",
        description: "There was an error translating your text. Please try again.",
      });
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Cancel ongoing translation
  const handleCancelTranslation = () => {
    if (isTranslating) {
      setIsTranslating(false);
      toast({
        title: "Translation cancelled",
        description: "The translation request was cancelled.",
      });
    }
  };
  
  return (
    <Card className="mobile-card">
      {/* Language Selection Section - Mobile-friendly */}
      <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
        <LanguageSelector />
      </div>
      
      {/* Translation Areas - Stack on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <SourceTextInput />
        <TranslatedOutput />
      </div>
      
      {/* Translation Actions - Mobile-optimized layout */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="w-full sm:w-auto">
          {/* Show detected language if available */}
          {detectedLanguage && (
            <div className="text-sm text-gray-600 text-center sm:text-left mb-2 sm:mb-0">
              <span>Detected language: <span className="font-medium">{detectedLanguage}</span></span>
            </div>
          )}
        </div>
        <div className="flex w-full sm:w-auto space-x-3">
          <Button
            variant="outline"
            onClick={handleCancelTranslation}
            disabled={!isTranslating}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
            className="flex-1 sm:flex-none"
          >
            Translate
          </Button>
        </div>
      </div>
    </Card>
  );
}
