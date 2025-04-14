import { useTranslationContext } from "@/context/TranslationContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Volume2, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function TranslatedOutput() {
  const { 
    translatedText, 
    targetLanguage, 
    isTranslating, 
    hasError, 
    setShowNotification 
  } = useTranslationContext();
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  
  // Copy translated text to clipboard
  const handleCopyTranslation = async () => {
    if (!translatedText) return;
    
    try {
      await navigator.clipboard.writeText(translatedText);
      setShowNotification(true);
      
      // Hide notification after 2 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard",
        variant: "destructive",
      });
    }
  };
  
  // Text-to-speech for translated text
  const handleSpeakTranslated = () => {
    if (!translatedText) return;
    
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLanguage; // Set language code for better pronunciation
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Translated Text</h3>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={handleCopyTranslation}
            disabled={!translatedText || isTranslating}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy to clipboard</span>
          </Button>
        </div>
      </div>
      
      <div className="flex-grow relative">
        {/* Loading State */}
        {isTranslating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
              <span className="mt-2 text-sm text-gray-600">Translating...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {hasError && !isTranslating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-lg z-10">
            <div className="flex flex-col items-center text-center p-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="mt-2 text-sm text-gray-800">Unable to translate the text. Please try again later.</p>
              <Button
                type="button"
                className="mt-3"
                variant="default"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        )}
        
        {/* Translated Text */}
        <Textarea
          value={translatedText}
          readOnly
          className="w-full h-full p-3 border rounded-lg bg-gray-50 resize-none min-h-[150px]"
          rows={6}
        />
      </div>
      
      <div className="flex justify-end items-center mt-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 p-1.5 rounded-md ${isSpeaking ? 'text-primary' : 'text-gray-500'} hover:text-gray-700 hover:bg-gray-100`}
          onClick={handleSpeakTranslated}
          disabled={!translatedText || isTranslating}
        >
          <Volume2 className="h-4 w-4" />
          <span className="sr-only">Listen</span>
        </Button>
      </div>
    </div>
  );
}
