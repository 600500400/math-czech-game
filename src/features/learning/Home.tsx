import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Check, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLearning } from './context';
import { calendarDay, levelProgress, streak } from './rewards';
import { SubjectCards } from './Shell';
import { subjects } from './catalog';

export default function Home() {
  const { authState } = useAuth(); const { data } = useLearning();
  const name = authState.profile?.full_name || authState.user?.username;
  const active = data.sessions.find(s => s.status === 'active');
  const due = Object.values(data.reviews).filter(r => r.dueAt <= new Date().toISOString());
  const recommended = subjects.find(s => s.id === (active?.subject || due[0]?.subject)) || subjects[0];
  const today = data.sessions.filter(s => s.status !== 'active' && s.activityDate === calendarDay());
  const done = today.reduce((sum,s) => sum + new Set(s.attempts.map(a => a.taskId)).size,0);
  const xp = data.baseXp + data.sessions.filter(s => s.status !== 'active').reduce((sum,s)=>sum+s.xp,0);
  const level = levelProgress(xp);
  return <div className="learn-home">
    <div className="learn-page-heading"><div><p className="learn-eyebrow">Každý pokus se počítá</p><h1>{name ? `Ahoj, ${name}!` : 'Vítej v Procvičce.'}</h1><p>Co dnes společně objevíme?</p></div><Link className="learn-button secondary" to="/select-user">Změnit profil</Link></div>
    {!name && <div className="learn-notice"><span>Procvičovat můžeš hned. Výběrem profilu oddělíš své výsledky od ostatních.</span><Link to="/select-user">Vybrat profil <ArrowRight size={17}/></Link></div>}
    <section className="learn-home-grid" aria-label="Dnešní procvičování"><div className="learn-recommendation"><div className="recommendation-top"><span className="learn-pill"><Sparkles size={16}/> {active ? 'Rozpracovaná lekce' : due.length ? 'Čas na zopakování' : 'Malý krok na dnešek'}</span><span className="recommendation-art" aria-hidden="true">{recommended.mark}</span></div><h2>{active ? `Pokračuj: ${active.title}` : due.length ? `Zopakuj si ${due.length} úloh` : 'Pár minut pro nový objev.'}</h2><p>{active ? `Máš hotovo ${new Set(active.attempts.map(a=>a.taskId)).size} z ${active.tasks.length} úloh. Pokračuj svým tempem.` : 'Vyber si krátkou lekci. Na odpověď máš tolik času, kolik potřebuješ.'}</p><Link className="learn-button primary" to={recommended.path}>{active ? 'Pokračovat v lekci' : 'Začít procvičovat'}<ArrowRight size={19}/></Link></div><div className="learn-today"><div className="learn-section-title"><h2>Dnes jsi zvládl/a</h2><Check size={21}/></div><strong className="today-number">{done}<small> úloh</small></strong><p>{done ? 'Další pokus může počkat. I malý krok je pokrok.' : 'První úloha teprve čeká. Začni tím, co tě baví.'}</p><div className="learn-level"><span>Úroveň {level.level}</span><span>{level.current} / {level.needed} XP</span></div><progress className="learn-progress" value={level.current} max={level.needed} aria-label="Postup na další úroveň"/><div className="learn-level"><span><Flame size={17}/> Série {streak(data.sessions)} dnů</span><span>{xp} XP celkem</span></div></div></section>
    <div className="learn-section-heading"><h2>Vyber si, co procvičíš</h2><Link to="/practice">Všechny lekce <ArrowRight size={17}/></Link></div><SubjectCards/>
    <div className="learn-tip"><BookOpen size={22}/><p>Chyba je součást učení. Vysvětlení a nápověda ti pomohou najít správný postup.</p></div>
  </div>;
}
