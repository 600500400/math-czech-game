interface Props {
  total: number;
}

const StatsTile = ({ total }: Props) => {
  return (
    <div className="col-span-1 flex min-h-[160px] flex-col justify-between rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          Statistiky
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
      </div>
      <div>
        <div className="font-heading text-3xl font-bold tracking-tight text-white">
          {total.toLocaleString("cs-CZ")}
        </div>
        <p className="text-[10px] font-medium text-white/40">Vyřešených úloh</p>
      </div>
    </div>
  );
};

export default StatsTile;
