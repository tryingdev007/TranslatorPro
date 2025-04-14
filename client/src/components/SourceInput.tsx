import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, Volume2 } from "lucide-react";

interface SourceInputProps {
  sourceText: string;
  onSourceTextChange: (text: string) => void;
}

export default function SourceInput({ sourceText, onSourceTextChange }: SourceInputProps) {
  const [charCount, setCharCount] = useState(0);

  // Update character count when source text changes
  useEffect(() => {
    setCharCount(sourceText.length);
  }, [sourceText]);

  // Handle clear button
  const handleClear = () => {
    onSourceTextChange("");
  };

  // Text-to-speech function for source text
  const handleListenSource = () => {
    if (!sourceText) return;
    
    const utterance = new SpeechSynthesisUtterance(sourceText);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <Textarea
          value={sourceText}
          onChange={(e) => onSourceTextChange(e.target.value)}
          className="w-full h-48 md:h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="Enter text to translate"
        />
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            onClick={handleClear}
            aria-label="Clear text"
          >
            <X className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
            onClick={handleListenSource}
            disabled={!sourceText}
            aria-label="Listen to text"
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
