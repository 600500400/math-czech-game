import { useNavigate } from "react-router-dom";
import { Calculator } from "lucide-react";

interface Props {
  accuracy: number;
  total: number;
  badge: string;
}

const MathHeroTile = ({ accuracy, total, badge }: Props) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/math")}
      className="col-span-2 group relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sunset-orange to-sunset-amber p-6 text-left shadow-xl shadow-sunset-orange/20 transition-transform active:scale-[0.98]"
    >
      <div className="absolute -right-6 -top-6 h-36 w-36 rounded-full bg-white/25 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
            <Calculator className="h-6 w-6 text-white" strokeWidth={2.2} />
          </div>
          <span className="rounded-full bg-black/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
            {badge}
          </span>
        </div>
        <div className="mt-6">
          <h2 className="font-heading text-2xl font-bold text-white">Matematika</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-white">
              {accuracy}%
            </span>
            <span className="text-sm text-white/75">
              {total > 0 ? `${total} vyřešených` : "začni první příklad"}
            </span>
          </div>
        </div>
        <div className="mt-6 w-full rounded-2xl bg-white py-4 text-center font-bold text-sunset-orange shadow-lg">
          Procvičovat počítání
        </div>
      </div>
    </button>
  );
};

export default MathHeroTile;
