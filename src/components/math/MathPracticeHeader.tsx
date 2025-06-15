
import React from "react";

interface MathPracticeHeaderProps {
  theme: any;
  getGradientClasses: any;
}

export const MathPracticeHeader: React.FC<MathPracticeHeaderProps> = ({
  theme,
  getGradientClasses
}) => {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Matematické procvičování
      </h1>
      <p className="text-gray-600">
        Procvičujte matematické operace zábavnou formou
      </p>
    </div>
  );
};
