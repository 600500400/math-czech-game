
import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description: string;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  description, 
  onSignOut 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{title}</h1>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </div>
      <div className="flex justify-end">
        <Button onClick={onSignOut} variant="outline" size="sm">
          Změnit uživatele
        </Button>
      </div>
    </div>
  );
};
