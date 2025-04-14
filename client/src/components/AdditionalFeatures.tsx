import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, History, Bookmark, WandSparkles, Plus } from "lucide-react";
import { Translation, SavedPhrase } from "@shared/schema";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

interface AdditionalFeaturesProps {
  detectedLanguage: {
    language: string;
    confidence: number;
  } | null;
}

export default function AdditionalFeatures({ detectedLanguage }: AdditionalFeaturesProps) {
  // Fetch recent translations
  const { data: recentTranslations = [] } = useQuery<Translation[]>({
    queryKey: ['/api/translations/recent'],
  });

  // Fetch saved phrases
  const { data: savedPhrases = [] } = useQuery<SavedPhrase[]>({
    queryKey: ['/api/saved-phrases'],
  });

  // Save current phrase mutation
  const { mutate: savePhrase } = useMutation({
    mutationFn: async (phrase: Omit<SavedPhrase, 'id' | 'userId' | 'createdAt'>) => {
      const response = await apiRequest('POST', '/api/saved-phrases', phrase);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-phrases'] });
    }
  });

  // Delete saved phrase mutation
  const { mutate: deletePhrase } = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/saved-phrases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-phrases'] });
    }
  });

  // Handle saving current phrase
  const handleSavePhrase = (translation: Translation) => {
    savePhrase({
      sourceText: translation.sourceText,
      translatedText: translation.translatedText,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Recent Translations */}
      <Card className="bg-surface rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <History className="text-gray-500 mr-2 h-5 w-5" />
          Recent Translations
        </h2>
        <div className="space-y-3">
          {recentTranslations.length > 0 ? (
            recentTranslations.map((item, index) => (
              <div key={index} className="border-b border-gray-100 pb-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.sourceLanguage === "auto" ? 
                      (item.detectedLanguage ? item.detectedLanguage : "Detected") : 
                      item.sourceLanguage} → {item.targetLanguage}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="truncate text-gray-700 mt-1">{item.sourceText}</p>
                <p className="truncate text-gray-500 text-sm mt-0.5">{item.translatedText}</p>
                <div className="mt-1 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                    onClick={() => handleSavePhrase(item)}
                  >
                    <Bookmark className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm italic py-2">No recent translations</p>
          )}
        </div>
      </Card>

      {/* Saved Phrases */}
      <Card className="bg-surface rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Bookmark className="text-gray-500 mr-2 h-5 w-5" />
          Saved Phrases
        </h2>
        <div className="space-y-3">
          {savedPhrases.length > 0 ? (
            savedPhrases.map((phrase) => (
              <div key={phrase.id} className="border-b border-gray-100 pb-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {phrase.sourceLanguage} → {phrase.targetLanguage}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 h-5 px-1 hover:text-red-700"
                    onClick={() => deletePhrase(phrase.id)}
                  >
                    Remove
                  </Button>
                </div>
                <p className="truncate text-gray-700 mt-1">{phrase.sourceText}</p>
                <p className="truncate text-gray-500 text-sm mt-0.5">{phrase.translatedText}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm italic py-2">No saved phrases</p>
          )}
        </div>
      </Card>

      {/* Language Detection */}
      <Card className="bg-surface rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <WandSparkles className="text-gray-500 mr-2 h-5 w-5" />
          Language Detection
        </h2>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Globe className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-gray-700">Detected Language</p>
              <p className="text-gray-500 text-sm">
                {detectedLanguage ? detectedLanguage.language : "Type something to detect"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Confidence Level</h3>
          <div className="bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${detectedLanguage ? detectedLanguage.confidence : 0}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {detectedLanguage ? `${detectedLanguage.confidence}% confidence` : "0% confidence"}
          </p>
        </div>
      </Card>
    </div>
  );
}
