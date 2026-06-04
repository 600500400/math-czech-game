import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface Props {
  accuracy: number;
  total: number;
}

const SpellingWideTile = ({ accuracy, total }: Props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/spelling")}
      className="col-span-2 group relative flex items-center justify-between overflow-hidden rounded-[32px] bg-sunset-magenta p-6 text-left transition-transform active:scale-[0.98]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      <div className="relative z-10">
        <h3 className="font-heading text-xl font-bold text-white">Pravopis</h3>
        <div className="mt-1 flex items-center gap-3">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white transition-all"
              style={{ width: `${Math.max(4, accuracy)}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-white">
            {total > 0 ? `${accuracy}% • ${total} slov` : "Začni hru"}
          </span>
        </div>
      </div>
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sunset-magenta shadow-lg transition-transform group-active:scale-90">
        <ChevronRight className="h-6 w-6" strokeWidth={3} />
      </div>
    </button>
  );
};

export default SpellingWideTile;
