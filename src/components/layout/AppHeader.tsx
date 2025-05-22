
import UserMenu from "@/components/UserMenu";

const AppHeader = () => {
  return (
    <header className="w-full max-w-md mx-auto flex justify-between mb-4">
      <div></div> {/* Prázdný div pro zachování flexbox layoutu */}
      <div className="flex items-center gap-2">
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
