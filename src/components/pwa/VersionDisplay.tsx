import { APP_VERSION } from "@/utils/version";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pwaUpdater } from "@/utils/pwaUpdater";
import { useState } from "react";

export const VersionDisplay = () => {
  const [isForceUpdating, setIsForceUpdating] = useState(false);

  const handleForceUpdate = async () => {
    setIsForceUpdating(true);
    await pwaUpdater.forceUpdate();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Verze aplikace</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div>
          <p className="text-sm text-muted-foreground">Aktuální verze:</p>
          <p className="font-mono font-bold">{APP_VERSION.getFullVersion()}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Build:</p>
          <p className="font-mono text-xs">{APP_VERSION.build}</p>
        </div>
        
        <Button 
          onClick={handleForceUpdate}
          disabled={isForceUpdating}
          variant="outline"
          size="sm"
        >
          {isForceUpdating ? "Resetuji..." : "Vynutit reset cache"}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Pokud se aplikace nechová správně, použijte reset cache
        </p>
      </CardContent>
    </Card>
  );
};