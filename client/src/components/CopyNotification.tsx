import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transition } from '@headlessui/react';

interface CopyNotificationProps {
  show: boolean;
}

export default function CopyNotification({ show }: CopyNotificationProps) {
  return (
    <Transition
      show={show}
      enter="transition-all duration-300"
      enterFrom="transform translate-y-20 opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition-all duration-300"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-20 opacity-0"
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center">
        <Check className="mr-2 h-5 w-5" />
        <span>Copied to clipboard!</span>
      </div>
    </Transition>
  );
}
