
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => navigate("/")} variant="outline">
          Zpět na aplikaci
        </Button>
        <Button onClick={onSignOut} variant="destructive">
          Odhlásit se
        </Button>
      </div>
    </div>
  );
};
