
import { useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";

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
  // Dark mode variants
  darkPrimaryColor: string;
  darkSecondaryColor: string;
  darkAccentColor: string;
  darkGradientFrom: string;
  darkGradientTo: string;
  darkBgGradient: string;
}

const USER_THEMES: Record<string, UserTheme> = {
  gabi: {
    id: 'gabi',
    name: 'Gábi',
    avatar: '👧',
    // Light mode
    primaryColor: 'rgb(236, 72, 153)', // pink-500
    secondaryColor: 'rgb(251, 207, 232)', // pink-200
    accentColor: 'rgb(190, 24, 93)', // pink-700
    gradientFrom: 'from-pink-400',
    gradientTo: 'to-purple-500',
    bgGradient: 'from-pink-50 via-purple-50 to-indigo-50',
    // Dark mode
    darkPrimaryColor: 'rgb(244, 114, 182)', // pink-400
    darkSecondaryColor: 'rgb(147, 51, 234)', // purple-600
    darkAccentColor: 'rgb(236, 72, 153)', // pink-500
    darkGradientFrom: 'from-pink-600',
    darkGradientTo: 'to-purple-700',
    darkBgGradient: 'from-slate-900 via-purple-900 to-slate-900'
  },
  misa: {
    id: 'misa',
    name: 'Míša',
    avatar: '🧒',
    // Light mode
    primaryColor: 'rgb(59, 130, 246)', // blue-500
    secondaryColor: 'rgb(147, 197, 253)', // blue-300
    accentColor: 'rgb(29, 78, 216)', // blue-700
    gradientFrom: 'from-blue-400',
    gradientTo: 'to-cyan-500',
    bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
    // Dark mode
    darkPrimaryColor: 'rgb(96, 165, 250)', // blue-400
    darkSecondaryColor: 'rgb(34, 197, 94)', // green-500
    darkAccentColor: 'rgb(59, 130, 246)', // blue-500
    darkGradientFrom: 'from-blue-600',
    darkGradientTo: 'to-cyan-700',
    darkBgGradient: 'from-slate-900 via-blue-900 to-slate-900'
  },
  ada: {
    id: 'ada',
    name: 'Áďa',
    avatar: '👶',
    // Light mode
    primaryColor: 'rgb(34, 197, 94)', // green-500
    secondaryColor: 'rgb(134, 239, 172)', // green-300
    accentColor: 'rgb(21, 128, 61)', // green-700
    gradientFrom: 'from-green-400',
    gradientTo: 'to-emerald-500',
    bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
    // Dark mode
    darkPrimaryColor: 'rgb(74, 222, 128)', // green-400
    darkSecondaryColor: 'rgb(245, 158, 11)', // amber-500
    darkAccentColor: 'rgb(34, 197, 94)', // green-500
    darkGradientFrom: 'from-green-600',
    darkGradientTo: 'to-emerald-700',
    darkBgGradient: 'from-slate-900 via-green-900 to-slate-900'
  },
  host: {
    id: 'host',
    name: 'Host',
    avatar: '👤',
    // Light mode
    primaryColor: 'rgb(168, 85, 247)', // purple-500
    secondaryColor: 'rgb(196, 181, 253)', // purple-300
    accentColor: 'rgb(124, 58, 237)', // purple-700
    gradientFrom: 'from-purple-400',
    gradientTo: 'to-indigo-500',
    bgGradient: 'from-purple-50 via-indigo-50 to-blue-50',
    // Dark mode
    darkPrimaryColor: 'rgb(196, 181, 253)', // purple-300
    darkSecondaryColor: 'rgb(59, 130, 246)', // blue-500
    darkAccentColor: 'rgb(168, 85, 247)', // purple-500
    darkGradientFrom: 'from-purple-600',
    darkGradientTo: 'to-indigo-700',
    darkBgGradient: 'from-slate-900 via-purple-900 to-slate-900'
  },
  default: {
    id: 'default',
    name: 'Uživatel',
    avatar: '🎓',
    // Light mode - ZMĚNĚNO Z ORANŽOVÉ NA MODRO-FIALOVOU
    primaryColor: 'rgb(59, 130, 246)', // blue-500
    secondaryColor: 'rgb(147, 197, 253)', // blue-300
    accentColor: 'rgb(124, 58, 237)', // purple-700
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-purple-600',
    bgGradient: 'from-blue-50 via-purple-50 to-indigo-50',
    // Dark mode - ZMĚNĚNO Z ORANŽOVÉ NA MODRO-FIALOVOU
    darkPrimaryColor: 'rgb(96, 165, 250)', // blue-400
    darkSecondaryColor: 'rgb(168, 85, 247)', // purple-500
    darkAccentColor: 'rgb(147, 51, 234)', // purple-600
    darkGradientFrom: 'from-blue-600',
    darkGradientTo: 'to-purple-700',
    darkBgGradient: 'from-slate-900 via-blue-900 to-slate-900'
  }
};

export const useUserTheme = (userId: string | null) => {
  const { effectiveTheme } = useTheme();
  
  const theme = useMemo(() => {
    if (!userId) return USER_THEMES.default;
    return USER_THEMES[userId] || USER_THEMES.default;
  }, [userId]);

  const getCSSVariables = useMemo(() => ({
    '--user-primary': effectiveTheme === 'dark' ? theme.darkPrimaryColor : theme.primaryColor,
    '--user-secondary': effectiveTheme === 'dark' ? theme.darkSecondaryColor : theme.secondaryColor,
    '--user-accent': effectiveTheme === 'dark' ? theme.darkAccentColor : theme.accentColor,
  } as React.CSSProperties), [theme, effectiveTheme]);

  const getGradientClasses = useMemo(() => ({
    primary: effectiveTheme === 'dark' ? theme.darkGradientFrom + ' ' + theme.darkGradientTo : theme.gradientFrom + ' ' + theme.gradientTo,
    background: effectiveTheme === 'dark' ? theme.darkBgGradient : theme.bgGradient,
  }), [theme, effectiveTheme]);

  return {
    theme,
    getCSSVariables,
    getGradientClasses,
    userThemes: USER_THEMES,
    isDark: effectiveTheme === 'dark'
  };
};
