import TranslatorCard from "@/components/TranslatorCard";
import RecentTranslations from "@/components/RecentTranslations";
import NotificationToast from "@/components/NotificationToast";
import { useTranslationContext } from "@/context/TranslationContext";
import { Globe } from "lucide-react";

export default function Home() {
  const { showNotification } = useTranslationContext();
  
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Header Section */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 flex items-center justify-center gap-2">
          <span>Language Translator</span>
          <Globe className="h-7 w-7 text-primary" />
        </h1>
        <p className="text-gray-600 mt-2">Translate text between different languages instantly</p>
      </header>
      
      {/* Main Translator Component */}
      <TranslatorCard />
      
      {/* Recent Translations Section */}
      <RecentTranslations />
      
      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>Powered by advanced translation technology</p>
        <p className="mt-1">© {new Date().getFullYear()} Language Translator. All rights reserved.</p>
      </footer>
      
      {/* Notification Toast */}
      {showNotification && <NotificationToast />}
    </div>
  );
}
