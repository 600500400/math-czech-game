import { useNavigate } from "react-router-dom";
import { Languages } from "lucide-react";

const DictionaryTile = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/dictionary")}
      className="col-span-1 flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-sunset-purple to-[hsl(252,90%,75%)] p-5 text-left shadow-lg shadow-sunset-purple/20 transition-transform active:scale-[0.98] min-h-[160px]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
        <Languages className="h-5 w-5 text-white" strokeWidth={2.2} />
      </div>
      <div>
        <h3 className="font-heading font-bold text-white">Slovník</h3>
        <span className="mt-2 inline-block rounded-lg bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Otevřít
        </span>
      </div>
    </button>
  );
};

export default DictionaryTile;
