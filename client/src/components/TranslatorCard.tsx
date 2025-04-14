import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Language, Translation } from "@shared/schema";
import { Languages } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import SourceInput from "./SourceInput";
import TranslationOutput from "./TranslationOutput";

interface TranslatorCardProps {
  languages: Language[];
  isLoadingLanguages: boolean;
  setError: (error: string | null) => void;
  displayCopyNotification: () => void;
  setDetectedLanguage: (lang: { language: string; confidence: number } | null) => void;
}

export default function TranslatorCard({
  languages,
  isLoadingLanguages,
  setError,
  displayCopyNotification,
  setDetectedLanguage
}: TranslatorCardProps) {
  const [sourceText, setSourceText] = useState("");
  const [translationResult, setTranslationResult] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("en");

  // Set default target language if languages are loaded
  useEffect(() => {
    if (languages && languages.length > 0 && targetLanguage === "") {
      setTargetLanguage(languages[0].code);
    }
  }, [languages]);

  // Mutation for translate API
  const { mutate: translate, isPending: isTranslating } = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(
        "POST",
        "/api/translate",
        {
          q: sourceText,
          source: sourceLanguage,
          target: targetLanguage,
        }
      );
      return response.json();
    },
    onSuccess: (data) => {
      setTranslationResult(data.translatedText);
      
      // Update detected language if available
      if (data.detectedLanguage) {
        setDetectedLanguage({
          language: getLanguageName(data.detectedLanguage.language),
          confidence: Math.round(data.detectedLanguage.confidence * 100)
        });
      }
      
      // Invalidate recent translations cache
      queryClient.invalidateQueries({ queryKey: ["/api/translations/recent"] });
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : "Translation failed. Please try again.");
    }
  });

  // Get language name from code
  const getLanguageName = (code: string): string => {
    if (code === "auto") return "Auto-detect";
    const language = languages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  // Handle swap languages button
  const handleSwapLanguages = () => {
    if (sourceLanguage === "auto") return;
    
    // Swap languages
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    
    // Also swap text if there's a translation result
    if (translationResult) {
      setSourceText(translationResult);
      setTranslationResult(sourceText);
    }
  };

  // Handle translate button
  const handleTranslate = () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate.");
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Call translation mutation
    translate();
  };

  return (
    <Card className="bg-surface rounded-xl shadow-md overflow-hidden mb-8">
      <CardContent className="p-5">
        {/* Language Selection Row */}
        <LanguageSelector
          languages={languages}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          onSourceLanguageChange={setSourceLanguage}
          onTargetLanguageChange={setTargetLanguage}
          onSwapLanguages={handleSwapLanguages}
          isLoadingLanguages={isLoadingLanguages}
        />

        {/* Translation Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Input */}
          <SourceInput
            sourceText={sourceText}
            onSourceTextChange={setSourceText}
          />

          {/* Translation Output */}
          <TranslationOutput
            translationResult={translationResult}
            isTranslating={isTranslating}
            onCopy={() => {
              navigator.clipboard.writeText(translationResult);
              displayCopyNotification();
            }}
          />
        </div>

        {/* Translate Button */}
        <div className="mt-6 flex justify-center">
          <Button
            className="px-6 py-3 bg-primary hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center"
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
          >
            <Languages className="mr-2 h-5 w-5" />
            Translate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
