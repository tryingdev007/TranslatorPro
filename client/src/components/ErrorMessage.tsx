import { X, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className="mb-6 flex items-start">
      <AlertCircle className="h-5 w-5 mt-1 mr-3" />
      <div className="flex-1">
        <AlertTitle>Translation Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="ml-auto text-red-500 hover:text-red-700 h-8 w-8"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </Button>
    </Alert>
  );
}
