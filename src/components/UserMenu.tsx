
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
import { AuthRefreshButton } from '@/components/auth/AuthRefreshButton';

const UserMenu = () => {
  const { authState, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  // Check if user is a guest
  const isGuest = authState.profile?.username === t('user.guest') || 
                 localStorage.getItem('localUser') !== null;

  // Get display name with better fallback
  const getDisplayName = () => {
    if (authState.profile?.username) {
      return authState.profile.username;
    }
    if (authState.user?.username) {
      return authState.user.username;
    }
    if (authState.user?.email) {
      return authState.user.email.split('@')[0];
    }
    return t('user.guest');
  };

  // Avatar initials with better handling
  const getNameInitials = () => {
    const name = getDisplayName();
    if (!name || name === t('user.guest')) return '👤';
    
    // Handle Czech characters properly
    const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    return cleanName
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
        return { name: t('user.parent'), icon: Crown };
      case 'child': 
        return { name: t('user.child'), icon: UserIcon };
      case 'teacher': 
        return { name: t('user.teacher'), icon: ChartBarIcon };
      default: 
        return { 
          name: isGuest ? t('user.guest') : t('user.user'), 
          icon: UserIcon 
        };
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <AuthRefreshButton />
        <Link to="/auth">
          <Button variant="outline" size="sm" className="bg-white border-gray-200 hover:bg-gray-50">
            <UserIcon className="mr-2 h-4 w-4" />
            {t('user.selectUser')}
          </Button>
        </Link>
      </div>
    );
  }

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="flex items-center gap-2">
      <AuthRefreshButton />
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className={`flex items-center gap-2 px-3 ${
              isGuest 
                ? 'bg-orange-50 border-orange-200 hover:bg-orange-100' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className={`text-xs font-medium ${
                isGuest ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {getNameInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline font-medium">
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
                {isGuest && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-1 py-0.5 rounded">
                    Lokální
                  </span>
                )}
              </div>
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
    </div>
  );
};

export default UserMenu;
