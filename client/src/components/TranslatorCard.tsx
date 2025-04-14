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
    <Card className="rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Language Selection Section */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <LanguageSelector />
      </div>
      
      {/* Translation Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <SourceTextInput />
        <TranslatedOutput />
      </div>
      
      {/* Translation Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <div>
          {/* Show detected language if available */}
          {detectedLanguage && (
            <div className="text-sm text-gray-600">
              <span>Detected language: <span className="font-medium">{detectedLanguage}</span></span>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleCancelTranslation}
            disabled={!isTranslating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
          >
            Translate
          </Button>
        </div>
      </div>
    </Card>
  );
}
