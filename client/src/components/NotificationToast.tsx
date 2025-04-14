import { CheckCircle } from "lucide-react";
import { useTranslationContext } from "@/context/TranslationContext";
import { useEffect } from "react";

export default function NotificationToast() {
  const { setShowNotification } = useTranslationContext();
  
  useEffect(() => {
    // Automatically hide the notification after 2 seconds
    const timer = setTimeout(() => {
      setShowNotification(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setShowNotification]);
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-5 z-50">
      <CheckCircle className="h-5 w-5 text-green-400" />
      <span>Copied to clipboard!</span>
    </div>
  );
}
