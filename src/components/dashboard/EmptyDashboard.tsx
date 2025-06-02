
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export const EmptyDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{t('statistics.noAssignedChildren')}</h3>
          <p className="text-gray-500 mb-4">
            {t('statistics.connectAccountsFirst')}
          </p>
          <Button onClick={() => navigate("/")}>
            {t('statistics.backToHome')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
