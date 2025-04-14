import { useTranslationContext } from "@/context/TranslationContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Volume2 } from "lucide-react";
import { useState } from "react";

const MAX_CHARS = 5000;

export default function SourceTextInput() {
  const { sourceText, setSourceText, sourceLanguage } = useTranslationContext();
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Handle source text change
  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setSourceText(text);
    }
  };
  
  // Clear source text
  const handleClearSource = () => {
    setSourceText("");
  };
  
  // Text-to-speech for source text
  const handleSpeakSource = () => {
    if (!sourceText) return;
    
    if ('speechSynthesis' in window) {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(sourceText);
      utterance.lang = sourceLanguage; // Set language code for better pronunciation
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700">Original Text</h3>
        <div className="flex space-x-2">
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={handleClearSource}
            disabled={!sourceText}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Clear text</span>
          </Button>
        </div>
      </div>
      
      <Textarea
        value={sourceText}
        onChange={handleSourceTextChange}
        placeholder="Enter text to translate..."
        className="flex-grow p-3 resize-none transition-colors min-h-[150px]"
        rows={6}
      />
      
      <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
        <span>
          Characters: {sourceText.length}/{MAX_CHARS}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 p-1.5 rounded-md ${isSpeaking ? 'text-primary' : 'text-gray-500'} hover:text-gray-700 hover:bg-gray-100`}
          onClick={handleSpeakSource}
          disabled={!sourceText}
        >
          <Volume2 className="h-4 w-4" />
          <span className="sr-only">Listen</span>
        </Button>
      </div>
    </div>
  );
}
