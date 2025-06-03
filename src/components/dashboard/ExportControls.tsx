
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

interface ExportControlsProps {
  selectedChild: string | null;
  childName: string;
  mathStats: any[];
  spellingStats: any[];
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  selectedChild,
  childName,
  mathStats,
  spellingStats
}) => {
  const handleExportPDF = async () => {
    if (!selectedChild) {
      toast.error("Vyberte dítě pro export");
      return;
    }

    try {
      // Create PDF content
      const content = generatePDFContent(childName, mathStats, spellingStats);
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${childName}_statistiky.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF export vytvořen");
    } catch (error) {
      toast.error("Chyba při exportu PDF");
      console.error(error);
    }
  };

  const handleExportExcel = async () => {
    if (!selectedChild) {
      toast.error("Vyberte dítě pro export");
      return;
    }

    try {
      // Create CSV content
      const csvContent = generateCSVContent(mathStats, spellingStats);
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${childName}_statistiky.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Excel export vytvořen");
    } catch (error) {
      toast.error("Chyba při exportu Excel");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Export dat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleExportPDF}
            disabled={!selectedChild}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
          <Button 
            onClick={handleExportExcel}
            disabled={!selectedChild}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
        {!selectedChild && (
          <p className="text-sm text-muted-foreground mt-2">
            Vyberte dítě pro povolení exportu
          </p>
        )}
      </CardContent>
    </Card>
  );
};

function generatePDFContent(childName: string, mathStats: any[], spellingStats: any[]): string {
  const mathTotal = mathStats.reduce((acc, stat) => {
    acc.correct += stat.correct_answers;
    acc.wrong += stat.wrong_answers;
    return acc;
  }, { correct: 0, wrong: 0 });

  const spellingTotal = spellingStats.reduce((acc, stat) => {
    acc.correct += stat.correct_answers;
    acc.wrong += stat.wrong_answers;
    return acc;
  }, { correct: 0, wrong: 0 });

  const mathAccuracy = mathTotal.correct + mathTotal.wrong > 0 
    ? ((mathTotal.correct / (mathTotal.correct + mathTotal.wrong)) * 100).toFixed(1)
    : '0';

  const spellingAccuracy = spellingTotal.correct + spellingTotal.wrong > 0 
    ? ((spellingTotal.correct / (spellingTotal.correct + spellingTotal.wrong)) * 100).toFixed(1)
    : '0';

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Statistiky - ${childName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-box { border: 1px solid #ccc; padding: 15px; border-radius: 5px; text-align: center; }
        .games { margin: 20px 0; }
        .game { border-bottom: 1px solid #eee; padding: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Procvička - Statistiky</h1>
        <h2>${childName}</h2>
        <p>Datum: ${new Date().toLocaleDateString('cs-CZ')}</p>
    </div>
    
    <div class="stats">
        <div class="stat-box">
            <h3>Matematika</h3>
            <p>Úspěšnost: ${mathAccuracy}%</p>
            <p>Správně: ${mathTotal.correct}</p>
            <p>Špatně: ${mathTotal.wrong}</p>
        </div>
        <div class="stat-box">
            <h3>Pravopis</h3>
            <p>Úspěšnost: ${spellingAccuracy}%</p>
            <p>Správně: ${spellingTotal.correct}</p>
            <p>Špatně: ${spellingTotal.wrong}</p>
        </div>
    </div>
    
    <div class="games">
        <h3>Poslední hry</h3>
        ${mathStats.slice(0, 5).map(stat => `
        <div class="game">
            <strong>Matematika</strong> - ${new Date(stat.created_at).toLocaleDateString('cs-CZ')}
            <br>Operace: ${stat.operation} | Správně: ${stat.correct_answers} | Špatně: ${stat.wrong_answers}
        </div>
        `).join('')}
        ${spellingStats.slice(0, 5).map(stat => `
        <div class="game">
            <strong>Pravopis</strong> - ${new Date(stat.created_at).toLocaleDateString('cs-CZ')}
            <br>Skupina: ${stat.word_group} | Správně: ${stat.correct_answers} | Špatně: ${stat.wrong_answers}
        </div>
        `).join('')}
    </div>
</body>
</html>
  `;
}

function generateCSVContent(mathStats: any[], spellingStats: any[]): string {
  const headers = 'Typ,Datum,Operace/Skupina,Správně,Špatně,Úspěšnost\n';
  
  const mathRows = mathStats.map(stat => {
    const accuracy = ((stat.correct_answers / (stat.correct_answers + stat.wrong_answers)) * 100).toFixed(1);
    return `Matematika,${new Date(stat.created_at).toLocaleDateString('cs-CZ')},${stat.operation},${stat.correct_answers},${stat.wrong_answers},${accuracy}%`;
  }).join('\n');
  
  const spellingRows = spellingStats.map(stat => {
    const accuracy = ((stat.correct_answers / (stat.correct_answers + stat.wrong_answers)) * 100).toFixed(1);
    return `Pravopis,${new Date(stat.created_at).toLocaleDateString('cs-CZ')},${stat.word_group},${stat.correct_answers},${stat.wrong_answers},${accuracy}%`;
  }).join('\n');
  
  return headers + mathRows + (mathRows && spellingRows ? '\n' : '') + spellingRows;
}
