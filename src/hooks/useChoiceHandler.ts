// hooks/useChoiceHandler.ts
import { useState } from "react";

export function useChoiceHandler(setPage: (next: number) => void) {
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const handleChoice = (choice: { text: string; next: number }) => {
    setPage(choice.next);
    setShowChoiceModal(false);
  };

  return {
    showChoiceModal,
    setShowChoiceModal,
    handleChoice,
  };
}
