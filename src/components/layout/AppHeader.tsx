
import UserMenu from "@/components/UserMenu";

const AppHeader = () => {
  return (
    <header className="w-full max-w-md mx-auto flex justify-between mb-4">
      <h1 className="text-xl font-bold text-orange-500">Procvička App</h1>
      <div className="flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
