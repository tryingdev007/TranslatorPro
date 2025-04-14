import { useTranslationContext } from "@/context/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { getLanguageName } from "@/lib/languages";
import { Translation } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function RecentTranslations() {
  const { 
    setSourceText, 
    setTranslatedText, 
    setSourceLanguage, 
    setTargetLanguage 
  } = useTranslationContext();
  
  // Fetch translation history
  const { 
    data: history = [], 
    isLoading, 
    isError 
  } = useQuery<Translation[]>({ 
    queryKey: ['/api/translations/history'] 
  });
  
  // Clear history mutation
  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/translations/history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/translations/history'] });
    },
  });
  
  // Handle loading a history item
  const handleLoadHistory = (item: Translation) => {
    setSourceText(item.sourceText);
    setTranslatedText(item.translatedText);
    setSourceLanguage(item.sourceLanguage);
    setTargetLanguage(item.targetLanguage);
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Format timestamp to relative time
  const formatTime = (timestamp: Date) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  return (
    <Card className="mt-8 rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <CardHeader className="p-4 bg-gray-50 border-b border-gray-200 flex-row justify-between items-center">
        <CardTitle className="text-lg font-medium text-gray-800">Recent Translations</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-primary hover:text-primary/80"
          onClick={() => clearHistoryMutation.mutate()}
          disabled={history.length === 0 || clearHistoryMutation.isPending}
        >
          Clear All
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-opacity-50 border-t-primary rounded-full mx-auto" />
            <p className="mt-2">Loading history...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-gray-500">
            <p>Failed to load translation history</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Plus className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2">No recent translations yet</p>
            <p className="text-sm mt-1">Your translation history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {history.map((item) => (
              <div 
                key={item.id} 
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleLoadHistory(item)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center text-sm text-gray-500 space-x-1">
                    <span>{getLanguageName(item.sourceLanguage)}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span>{getLanguageName(item.targetLanguage)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatTime(item.timestamp)}</span>
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 truncate">{item.sourceText}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 truncate">{item.translatedText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
