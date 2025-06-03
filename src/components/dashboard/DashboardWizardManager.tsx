
import { useState, useEffect } from "react";
import { WelcomeWizard } from "./WelcomeWizard";
import { UserProfile } from "@/types/authTypes";

interface DashboardWizardManagerProps {
  loading: boolean;
  children: UserProfile[];
  userId: string | null;
  onChildCreated: () => void;
}

export const DashboardWizardManager: React.FC<DashboardWizardManagerProps> = ({
  loading,
  children,
  userId,
  onChildCreated
}) => {
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);

  // Check if this is a new parent (no children) and show welcome wizard
  useEffect(() => {
    if (!loading && children.length === 0 && userId) {
      // Check if they've dismissed the wizard before
      const hasSeenWizard = localStorage.getItem(`welcome-wizard-${userId}`);
      if (!hasSeenWizard) {
        setShowWelcomeWizard(true);
      }
    }
  }, [loading, children.length, userId]);

  const handleDismissWizard = () => {
    if (userId) {
      localStorage.setItem(`welcome-wizard-${userId}`, 'true');
    }
    setShowWelcomeWizard(false);
  };

  if (!showWelcomeWizard || !userId) {
    return null;
  }

  return (
    <WelcomeWizard
      parentId={userId}
      onChildCreated={onChildCreated}
      onDismiss={handleDismissWizard}
    />
  );
};
