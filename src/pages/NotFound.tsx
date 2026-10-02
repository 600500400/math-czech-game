import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-sunset-bg text-white px-4">
      <div className="text-center max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <h1 className="text-6xl font-bold mb-4 font-heading bg-gradient-to-r from-sunset-orange to-sunset-amber bg-clip-text text-transparent">404</h1>
        <p className="text-xl font-medium mb-2 text-white">Stránka nebyla nalezena</p>
        <p className="text-sm text-white/50 mb-6">Tato adresa v aplikaci neexistuje nebo byla přesunuta.</p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-sunset-orange to-sunset-amber text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg">
            Zpět na hlavní stránku
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
