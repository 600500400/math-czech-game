
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
import { UserIcon, LogOut, ChartBarIcon } from 'lucide-react';

const UserMenu = () => {
  const { authState, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Zkratka jména pro avatar
  const getNameInitials = () => {
    if (!authState.profile?.username) return '?';
    return authState.profile.username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Překlad role
  const getRoleName = () => {
    switch (authState.profile?.role) {
      case 'parent': return t('user.parent');
      case 'child': return t('user.child');
      case 'teacher': return t('user.teacher');
      default: return t('user.user');
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm">
          <UserIcon className="mr-2 h-4 w-4" />
          {t('user.selectUser')}
        </Button>
      </Link>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 px-3">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {getNameInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{authState.profile?.username}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{authState.profile?.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{getRoleName()}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {authState.profile?.role === 'parent' && (
          <DropdownMenuItem asChild>
            <Link to="/parent-dashboard" className="flex items-center cursor-pointer" onClick={() => setOpen(false)}>
              <ChartBarIcon className="mr-2 h-4 w-4" />
              <span>{t('user.parentDashboard')}</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center cursor-pointer" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('user.changeUser')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
