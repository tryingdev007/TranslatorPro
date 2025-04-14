import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";
import { Language } from "@shared/schema";

interface LanguageSelectorProps {
  languages: Language[];
  sourceLanguage: string;
  targetLanguage: string;
  onSourceLanguageChange: (value: string) => void;
  onTargetLanguageChange: (value: string) => void;
  onSwapLanguages: () => void;
  isLoadingLanguages: boolean;
}

export default function LanguageSelector({
  languages,
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSwapLanguages,
  isLoadingLanguages
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
      {/* Source Language */}
      <div className="w-full md:w-auto flex-1">
        <label htmlFor="source-language" className="block text-sm font-medium text-gray-700 mb-1">
          From
        </label>
        <Select
          value={sourceLanguage}
          onValueChange={onSourceLanguageChange}
          disabled={isLoadingLanguages}
        >
          <SelectTrigger className="w-full" id="source-language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto">Auto-detect</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={`source-${lang.code}`} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Swap Button */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-100 hover:bg-gray-200"
        onClick={onSwapLanguages}
        disabled={sourceLanguage === "auto"}
        aria-label="Swap languages"
      >
        <ArrowLeftRight className="h-4 w-4 text-gray-600" />
      </Button>

      {/* Target Language */}
      <div className="w-full md:w-auto flex-1">
        <label htmlFor="target-language" className="block text-sm font-medium text-gray-700 mb-1">
          To
        </label>
        <Select
          value={targetLanguage}
          onValueChange={onTargetLanguageChange}
          disabled={isLoadingLanguages}
        >
          <SelectTrigger className="w-full" id="target-language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={`target-${lang.code}`} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
