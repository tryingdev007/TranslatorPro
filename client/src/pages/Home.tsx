import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TranslatorCard from "@/components/TranslatorCard";
import AdditionalFeatures from "@/components/AdditionalFeatures";
import ErrorMessage from "@/components/ErrorMessage";
import CopyNotification from "@/components/CopyNotification";
import { Language } from "@shared/schema";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<{
    language: string;
    confidence: number;
  } | null>(null);
  
  // Fetch available languages
  const { data: languages, isLoading: isLoadingLanguages, error: languagesError } = useQuery<Language[]>({
    queryKey: ["/api/languages"],
  });
  
  // Handle language loading error
  useEffect(() => {
    if (languagesError) {
      setError("Failed to load languages. Please refresh the page.");
    }
  }, [languagesError]);

  // Show copy notification function
  const displayCopyNotification = () => {
    setShowCopyNotification(true);
    setTimeout(() => {
      setShowCopyNotification(false);
    }, 2000);
  };

  return (
    <div className="bg-background min-h-screen font-sans text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Translator</h1>
          <p className="text-lg text-gray-600">Translate text between multiple languages instantly</p>
        </header>

        {/* Main Content */}
        <main>
          {/* Main translator card */}
          <TranslatorCard 
            languages={languages || []} 
            isLoadingLanguages={isLoadingLanguages}
            setError={setError}
            displayCopyNotification={displayCopyNotification}
            setDetectedLanguage={setDetectedLanguage}
          />

          {/* Additional features section */}
          <AdditionalFeatures 
            detectedLanguage={detectedLanguage}
          />

          {/* Error message */}
          {error && (
            <ErrorMessage 
              message={error} 
              onDismiss={() => setError(null)} 
            />
          )}

          {/* Copy notification */}
          <CopyNotification show={showCopyNotification} />
        </main>

        {/* Footer Section */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Powered by Translation API services</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-primary">Help</a>
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
