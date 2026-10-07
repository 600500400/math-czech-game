import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LearningProvider } from '@/features/learning/LearningProvider';
import { FamilyProvider } from '@/features/learning/family';
import Shell from '@/features/learning/Shell';
import Home from '@/features/learning/Home';
import ErrorBoundary from '@/features/learning/ErrorBoundary';
import '@/features/learning/learning.css';
const Practice = lazy(()=>import('@/features/learning/Practice'));
const PracticeHub = lazy(()=>import('@/features/learning/PracticeHub'));
const Progress = lazy(()=>import('@/features/learning/Progress'));
const Profiles = lazy(()=>import('@/features/learning/Profiles'));
const Profile = lazy(()=>import('@/features/learning/Profile'));
const Account = lazy(()=>import('@/features/learning/Account'));
const Children = lazy(()=>import('@/features/learning/Children'));
const DictionaryManager = lazy(()=>import('@/features/learning/DictionaryManager'));
const LegacyStatistics = lazy(()=>import('./pages/Statistics'));
const DonationSuccess = lazy(()=>import('./pages/DonationSuccess'));
const LegacyLeaderboards = lazy(()=>import('./components/gamification/LeaderboardsPage').then(m=>({default:m.LeaderboardsPage})));
const NotFound = lazy(()=>import('./pages/NotFound'));
const queryClient = new QueryClient({ defaultOptions:{queries:{refetchOnWindowFocus:false,retry:false,staleTime:300000}} });
export default function App(){
  return <ErrorBoundary><QueryClientProvider client={queryClient}><ThemeProvider><TooltipProvider><Toaster/><Sonner/><BrowserRouter><AuthProvider><FamilyProvider><LearningProvider><Suspense fallback={<div className="learning-app"><main className="learn-main"><p role="status">Načítáme stránku…</p></main></div>}><Routes>
    <Route element={<Shell/>}>
      <Route path="/" element={<Home/>}/><Route path="/practice" element={<PracticeHub/>}/>
      <Route path="/select-user" element={<Profiles/>}/><Route path="/auth" element={<Account/>}/>
      <Route path="/children" element={<Children/>}/>
      <Route path="/math" element={<Practice key="math" subject="math"/>}/><Route path="/matematika" element={<Practice key="math" subject="math"/>}/>
      <Route path="/spelling" element={<Practice key="spelling" subject="spelling"/>}/><Route path="/pravopis" element={<Practice key="spelling" subject="spelling"/>}/>
      <Route path="/dictionary" element={<Practice key="english" subject="english"/>}/><Route path="/slovnik" element={<Practice key="english" subject="english"/>}/>
      <Route path="/dictionary/manage" element={<DictionaryManager/>}/>
      <Route path="/statistiky" element={<Progress/>}/><Route path="/achievements" element={<Progress/>}/>
      <Route path="/profil" element={<Profile/>}/><Route path="/parent-dashboard" element={<Navigate to="/children" replace/>}/>
      <Route path="/leaderboards" element={<LegacyLeaderboards/>}/>
      <Route path="/statistiky/historie" element={<LegacyStatistics/>}/>
      <Route path="/donation-success" element={<DonationSuccess/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Route>
  </Routes></Suspense></LearningProvider></FamilyProvider></AuthProvider></BrowserRouter></TooltipProvider></ThemeProvider></QueryClientProvider></ErrorBoundary>;
}

