
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { UserIcon, LogOut, ChartBarIcon, Crown, RefreshCw } from 'lucide-react';

const UserMenu = () => {
  const { authState, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Get display name
  const getDisplayName = () => {
    if (authState.profile?.username) {
      return authState.profile.username;
    }
    if (authState.user?.username) {
      return authState.user.username;
    }
    return 'Uživatel';
  };

  // Avatar initials
  const getNameInitials = () => {
    const name = getDisplayName();
    
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Role translation and icon
  const getRoleInfo = () => {
    const role = authState.profile?.role;
    switch (role) {
      case 'parent': 
        return { name: 'Rodič', icon: Crown };
      case 'child': 
        return { name: 'Dítě', icon: UserIcon };
      default: 
        return { name: 'Uživatel', icon: UserIcon };
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <Link to="/select-user">
        <Button variant="ghost" size="sm" className="h-9 w-9 sm:w-auto p-0 sm:px-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md">
          <UserIcon className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Vybrat uživatele</span>
        </Button>
      </Link>
    );
  }

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          aria-label={`Uživatelské menu – ${getDisplayName()}`}
          className="h-9 px-1 sm:px-3 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white backdrop-blur-md gap-1 sm:gap-2"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-sunset-orange to-sunset-magenta text-white">
              {getNameInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline font-medium max-w-20 truncate">
            {getDisplayName()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getDisplayName()}
            </p>
            <div className="flex items-center gap-1">
              <RoleIcon className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs leading-none text-muted-foreground">
                {roleInfo.name}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Změnit uživatele</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
