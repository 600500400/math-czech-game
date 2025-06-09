import { useMemo } from "react";

export interface UserTheme {
  id: string;
  name: string;
  avatar: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  bgGradient: string;
}

const USER_THEMES: Record<string, UserTheme> = {
  gabi: {
    id: 'gabi',
    name: 'Gábi',
    avatar: '👧',
    primaryColor: 'rgb(236, 72, 153)', // pink-500
    secondaryColor: 'rgb(251, 207, 232)', // pink-200
    accentColor: 'rgb(190, 24, 93)', // pink-700
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-purple-500',
    bgGradient: 'from-pink-50 via-purple-50 to-indigo-50'
  },
  misa: {
    id: 'misa',
    name: 'Míša',
    avatar: '🧒',
    primaryColor: 'rgb(59, 130, 246)', // blue-500
    secondaryColor: 'rgb(147, 197, 253)', // blue-300
    accentColor: 'rgb(29, 78, 216)', // blue-700
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-500',
    bgGradient: 'from-blue-50 via-cyan-50 to-teal-50'
  },
  ada: {
    id: 'ada',
    name: 'Áďa',
    avatar: '👶',
    primaryColor: 'rgb(34, 197, 94)', // green-500
    secondaryColor: 'rgb(134, 239, 172)', // green-300
    accentColor: 'rgb(21, 128, 61)', // green-700
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    bgGradient: 'from-green-50 via-emerald-50 to-teal-50'
  },
  host: {
    id: 'host',
    name: 'Host',
    avatar: '👤',
    primaryColor: 'rgb(168, 85, 247)', // purple-500
    secondaryColor: 'rgb(196, 181, 253)', // purple-300
    accentColor: 'rgb(124, 58, 237)', // purple-700
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-indigo-500',
    bgGradient: 'from-purple-50 via-indigo-50 to-blue-50'
  },
  default: {
    id: 'default',
    name: 'Uživatel',
    avatar: '🎓',
    primaryColor: 'rgb(249, 115, 22)', // orange-500
    secondaryColor: 'rgb(254, 215, 170)', // orange-200
    accentColor: 'rgb(194, 65, 12)', // orange-700
    gradientFrom: 'from-orange-400',
    gradientTo: 'to-red-500',
    bgGradient: 'from-orange-50 via-red-50 to-pink-50'
  }
};

export const useUserTheme = (userId: string | null) => {
  const theme = useMemo(() => {
    if (!userId) return USER_THEMES.default;
    return USER_THEMES[userId] || USER_THEMES.default;
  }, [userId]);

  const getCSSVariables = useMemo(() => ({
    '--user-primary': theme.primaryColor,
    '--user-secondary': theme.secondaryColor,
    '--user-accent': theme.accentColor,
  } as React.CSSProperties), [theme]);

  return {
    theme,
    getCSSVariables,
    userThemes: USER_THEMES
  };
};
