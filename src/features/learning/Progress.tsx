import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Target, BookOpen, Award } from 'lucide-react';
import { useLearning } from './context';
import { getSkillProgress, summarize } from './rewards';
import { badgeDefinitions } from './badges';
import { legacyLocalResults } from './storage';
import { subjects } from './catalog';
import type { Subject } from './types';
export default function Progress() {
  const { data, learnerId, cloud } = useLearning(); const [filter,setFilter] = useState<Subject | 'all'>('all');
  const sessions = data.sessions.filter(s => s.status !== 'active' && (filter === 'all' || s.subject === filter));
  const stats = sessions.map(summarize); const answered = stats.reduce((n,s)=>n+s.answered,0);
  const verified = sessions.filter(s=>s.mode==='typing').map(summarize);
  const verifiedCount = verified.reduce((n,s)=>n+s.answered,0); const correct = verified.reduce((n,s)=>n+s.independent,0);
  const skills = getSkillProgress(sessions.filter(s=>s.mode==='typing'));
  return <><div className="learn-page-heading"><div><p className="learn-eyebrow">Tvůj vlastní pokrok</p><h1>Každý krok je vidět.</h1><p>Počítáme první odpovědi. Opravené chyby uvidíš zvlášť.</p></div></div><fieldset className="learn-chips"><legend className="sr-only">Předmět</legend>{[{ id: 'all', title: 'Vše' },...subjects].map(s=><button key={s.id} className={filter===s.id?'selected':''} aria-pressed={filter===s.id} onClick={()=>setFilter(s.id as Subject|'all')}>{s.title}</button>)}</fieldset><div className="learn-stat-grid"><div className="learn-stat"><BookOpen/><strong>{sessions.filter(s=>s.status==='completed').length}</strong><span>Dokončených lekcí</span></div><div className="learn-stat"><Check/><strong>{answered}</strong><span>Procvičených úloh</span></div><div className="learn-stat"><Target/><strong>{verifiedCount ? `${Math.round(correct/verifiedCount*100)} %` : '—'}</strong><span>Napoprvé bez nápovědy</span></div></div>
    <section className="learn-panel"><h2>Co už jde a co zopakovat</h2>{!skills.length?<p>Zatím tu nejsou výsledky. První lekce ukáže, na čem můžeme stavět.</p>:<div className="learn-skill-list">{skills.map(skill=><div key={skill.id}><div><strong>{skill.id.startsWith('spelling:')?`Vyjmenovaná slova po ${skill.id.split(':')[1]}`:skill.title}</strong><small>{skill.count} prvních odpovědí · {skill.percent}% bez nápovědy</small></div><span className="learn-pill">{skill.count<5?'Sbíráme zkušenosti':skill.percent>=80?'Daří se':'Zopakuj si'}</span><progress value={skill.correct} max={skill.count} aria-label={`Samostatně správně: ${skill.correct} z ${skill.count}`}/></div>)}</div>}</section>
    <section className="learn-panel"><h2>Malé úspěchy</h2><div className="learn-badges">{badgeDefinitions.map(b=><div key={b.id} className={data.badges[b.id]?'earned':''}><Award/><strong>{b.title}</strong><p>{b.description}</p><span>{data.badges[b.id]?'Získáno':`Ještě čeká · ${b.xp} XP`}</span></div>)}</div></section>
    <section className="learn-panel"><h2>Poslední lekce</h2>{!sessions.length?<Link className="learn-button primary" to="/practice">Vybrat první lekci</Link>:<div className="learn-history">{sessions.slice(0,20).map(s=><div key={s.id}><div><strong>{s.title}</strong><small>{new Date(s.completedAt || s.startedAt).toLocaleDateString('cs-CZ')} · {s.status==='completed'?'Dokončeno':'Ukončeno dříve'}{s.mode==='cards'?' · vlastní hodnocení kartiček':''}</small></div><span>{summarize(s).independent} / {summarize(s).answered} napoprvé · +{s.xp} XP</span><span className="learn-muted">{s.sync==='synced'?'V účtu':s.sync==='pending'?'Čeká na synchronizaci':'Na zařízení'}</span></div>)}</div>}</section>
    {(cloud || legacyLocalResults(learnerId).count>0)&&<div className="learn-tip">Dosavadní výsledky z předchozí verze zůstávají zachované. <Link to="/statistiky/historie">Otevřít starší historii</Link></div>}
  </>;
}

