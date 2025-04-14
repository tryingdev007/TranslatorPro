import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Volume2 } from "lucide-react";

interface TranslationOutputProps {
  translationResult: string;
  isTranslating: boolean;
  onCopy: () => void;
}

export default function TranslationOutput({
  translationResult,
  isTranslating,
  onCopy
}: TranslationOutputProps) {
  const [charCount, setCharCount] = useState(0);

  // Update character count when translation result changes
  useEffect(() => {
    setCharCount(translationResult.length);
  }, [translationResult]);

  // Text-to-speech function for translation result
  const handleListenTranslation = () => {
    if (!translationResult) return;
    
    const utterance = new SpeechSynthesisUtterance(translationResult);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        {/* Loading overlay */}
        {isTranslating && (
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <span className="mt-2 text-gray-600">Translating...</span>
            </div>
          </div>
        )}
        
        {/* Result display */}
        <div className="w-full h-48 md:h-64 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto">
          {translationResult ? (
            <p className="text-gray-700">{translationResult}</p>
          ) : (
            <p className="text-gray-400 italic">Translation will appear here</p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            onClick={onCopy}
            disabled={!translationResult}
            aria-label="Copy translation"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            onClick={handleListenTranslation}
            disabled={!translationResult}
            aria-label="Listen to translation"
          >
            <Volume2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>{charCount} characters</span>
      </div>
    </div>
  );
}
