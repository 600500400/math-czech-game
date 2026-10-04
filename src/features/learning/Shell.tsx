import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookOpen, Home, ChartNoAxesCombined, UserRound, Sun, Moon, Cloud, HardDrive, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLearning } from './context';
import { levelProgress, streak } from './rewards';

import { subjects } from './catalog';
const links = [{ to: '/', label: 'Domů', icon: Home }, { to: '/practice', label: 'Procvičovat', icon: BookOpen }, { to: '/statistiky', label: 'Pokrok', icon: ChartNoAxesCombined }, { to: '/profil', label: 'Profil', icon: UserRound }];
export default function Shell() {
  const { authState } = useAuth();
  const { data, cloud, storageError, syncError, retrySync, syncing } = useLearning();
  const { effectiveTheme, toggleTheme } = useTheme();
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => { const change = () => setOnline(navigator.onLine); window.addEventListener('online',change); window.addEventListener('offline',change); return () => { window.removeEventListener('online',change); window.removeEventListener('offline',change); }; },[]);
  const location = useLocation();
  const total = data.baseXp + data.sessions.filter(s => s.status !== 'active').reduce((sum, s) => sum + s.xp, 0);
  const progress = levelProgress(total);
  const subject = subjects.find(s => s.path === location.pathname || ({ math: '/matematika', spelling: '/pravopis', english: '/slovnik' }[s.id]) === location.pathname);
  const focused = subject && data.sessions.some(s => s.subject === subject.id && s.status === 'active');
  if (authState.isLoading) return <div className="learning-app"><main className="learn-main"><p role="status">Načítáme tvůj profil…</p></main></div>;
  return <div className="learning-app" data-focused={focused || undefined} data-reduced-motion={data.preferences.reducedMotion || undefined}>
    <a className="learn-skip" href="#learning-content">Přejít k obsahu</a>
    {!focused && <header className="learn-header"><div className="learn-header-inner">
      <Link className="learn-brand" to="/" aria-label="Procvička – domů"><span className="learn-brand-mark">p<span>·</span></span>procvička<span className="brand-caption">Malé kroky, velké objevy.</span></Link>
      <nav className="learn-desktop-nav" aria-label="Hlavní navigace">{links.map(({ to, label, icon: Icon }) => <NavLink end={to === '/'} key={to} to={to}><Icon size={19} aria-hidden="true"/>{label}</NavLink>)}</nav>
      <div className="learn-header-actions"><button className="learn-icon-button" onClick={toggleTheme} aria-label={effectiveTheme === 'dark' ? 'Zapnout světlý vzhled' : 'Zapnout tmavý vzhled'}>{effectiveTheme === 'dark' ? <Sun size={21}/> : <Moon size={21}/>}</button><Link className="learn-avatar" to="/profil" aria-label="Otevřít svůj profil">{(authState.profile?.full_name || authState.user?.username || 'H').charAt(0)}</Link></div>
    </div></header>}
    <main id="learning-content" className="learn-main" tabIndex={-1}>
      {!online && <div className="learn-notice" role="status">Jsi offline. V lekci můžeš pokračovat; výsledky zůstávají na tomto zařízení.</div>}
      {(storageError || syncError) && <div className="learn-notice" role="status"><span>{storageError || syncError}</span>{syncError && <button onClick={() => void retrySync()} disabled={syncing}>Zkusit znovu</button>}<Link to="/profil">Záloha</Link></div>}
      <Outlet/>
    </main>
    {!focused && <><footer className="learn-footer"><span>{cloud ? <Cloud size={16}/> : <HardDrive size={16}/>} {cloud ? syncing ? 'Ukládáme do účtu…' : data.sessions.some(s => s.sync === 'pending') ? 'Čeká na uložení do účtu' : 'Přihlášený účet' : 'Místní profil · výsledky na tomto zařízení'}</span><span>Úroveň {progress.level} · {total} XP · série {streak(data.sessions)} dnů</span></footer><nav className="learn-mobile-nav" aria-label="Hlavní navigace">{links.map(({ to, label, icon: Icon }) => <NavLink end={to === '/'} key={to} to={to}><Icon size={22} aria-hidden="true"/><span>{label}</span></NavLink>)}</nav></>}
  </div>;
}
export function SubjectCards() {
  return <div className="learn-subjects">{subjects.map(subject => <Link className={`learn-subject ${subject.color}`} key={subject.id} to={subject.path}><span className="subject-mark" aria-hidden="true">{subject.mark}</span><div><span className="learn-eyebrow">Krátká lekce · 5–20 úloh</span><h2>{subject.title}</h2><p>{subject.description}</p></div><span className="subject-go">Procvičovat <ChevronRight size={18}/></span></Link>)}</div>;
}
