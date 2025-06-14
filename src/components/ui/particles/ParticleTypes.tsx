
export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond';
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export interface AdvancedParticleSystemProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  shapes?: Array<'circle' | 'square' | 'triangle' | 'star' | 'heart' | 'diamond'>;
  intensity?: 'low' | 'medium' | 'high' | 'extreme';
  pattern?: 'explosion' | 'fountain' | 'rain' | 'spiral' | 'burst';
  onComplete?: () => void;
  autoTrigger?: boolean;
}

export interface IntensitySettings {
  count: number;
  speed: number;
  spread: number;
}

export type IntensitySettingsMap = {
  [K in 'low' | 'medium' | 'high' | 'extreme']: IntensitySettings;
};
