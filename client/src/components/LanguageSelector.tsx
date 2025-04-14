import { useTranslationContext } from "@/context/TranslationContext";
import { languages } from "@/lib/languages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function LanguageSelector() {
  const { 
    sourceLanguage, 
    setSourceLanguage, 
    targetLanguage, 
    setTargetLanguage,
    sourceText,
    translatedText,
    setSourceText,
    setTranslatedText
  } = useTranslationContext();
  
  // Handle swapping languages
  const handleSwapLanguages = () => {
    // Swap the languages
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    
    // Swap the text content
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* Source Language */}
      <div className="w-full">
        <Label htmlFor="sourceLanguage" className="block text-sm font-medium text-gray-700 mb-1">From</Label>
        <Select
          value={sourceLanguage}
          onValueChange={setSourceLanguage}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Swap Button */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
        onClick={handleSwapLanguages}
      >
        <ArrowLeftRight className="h-6 w-6 text-gray-600" />
        <span className="sr-only">Swap languages</span>
      </Button>
      
      {/* Target Language */}
      <div className="w-full">
        <Label htmlFor="targetLanguage" className="block text-sm font-medium text-gray-700 mb-1">To</Label>
        <Select
          value={targetLanguage}
          onValueChange={setTargetLanguage}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
