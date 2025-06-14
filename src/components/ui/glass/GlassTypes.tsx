
export interface GlassMorphismProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'medium' | 'dark' | 'colored';
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
  border?: boolean;
  shadow?: boolean;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export interface GlassDialogProps {
  children: React.ReactNode;
  className?: string;
}

export interface GlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}
