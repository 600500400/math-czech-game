import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { learningCloud } from './cloud';
import { useFamily } from './family-context';
import type { LessonSession } from './types';
import { supabase } from '@/integrations/supabase/client';
import PairingCode from './PairingCode';

export default function Children() {
 const family=useFamily();const navigate=useNavigate();const children=family.profiles.filter(p=>p.access==='guardian');
 const [name,setName]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const [existingCode,setExistingCode]=useState('');const [waiting,setWaiting]=useState(false);
 const [results,setResults]=useState<Record<string,{sessions:LessonSession[];xp:number}>>({});
 const [code,setCode]=useState<{learnerId:string;value:string;expires:string}|null>(null);
 const [requests,setRequests]=useState<{id:string;learner_id:string;requested_by:string|null}[]>([]);
 const [devices,setDevices]=useState<{account_id:string;learner_id:string;role:string}[]>([]);
 const ids=children.map(p=>p.id).join(',');
 useEffect(()=>{
  let alive=true;
  void Promise.all(ids?ids.split(',').map(async id=>{
   const [{data:sessions,error:failure},{data:xp,error:xpFailure}]=await Promise.all([learningCloud.rpc('get_learning_sessions',{p_learner_id:id}),supabase.from('user_levels').select('total_xp').eq('user_id',id).maybeSingle()]);
   if(failure||xpFailure)throw failure||xpFailure;
   return [id,{sessions:sessions as unknown as LessonSession[],xp:xp?.total_xp||0}] as const;
  }):[]).then(rows=>{if(alive)setResults(Object.fromEntries(rows));}).catch(()=>{if(alive)setError('Statistiky se nepodařilo načíst. Zkus stránku obnovit.');});
  return()=>{alive=false;};
 },[ids]);
 const [tick,setTick]=useState(0);
 useEffect(()=>{
  if(!ids)return;let alive=true;
  const load=async()=>{
   const [{data:invites,error:failure},{data:access}]=await Promise.all([
    learningCloud.from('learner_invites').select('*').in('learner_id',ids.split(',')).not('requested_by','is',null).is('approved_at',null).is('revoked_at',null),
    learningCloud.from('learner_access').select('*').in('learner_id',ids.split(',')).eq('role','learner'),
   ]);
   if(!alive)return;if(failure){setError('Žádosti o připojení se nepodařilo načíst.');return;}
   setRequests(invites||[]);setDevices(access||[]);
  };void load();const timer=window.setInterval(()=>void load(),10000);return()=>{alive=false;window.clearInterval(timer);};
 },[ids,tick]);
 const refresh=family.refresh;
 useEffect(()=>{if(!waiting)return;const timer=window.setInterval(()=>void refresh(),5000);return()=>window.clearInterval(timer);},[waiting,refresh]);
 const action=async(work:()=>Promise<void>)=>{setBusy(true);setError('');try{await work();setTick(t=>t+1);}catch(e){setError(e instanceof Error?e.message:(e as {message?:string})?.message||'Akce se nezdařila.');}finally{setBusy(false);}};
 if(!family.active)return <section className="learn-panel"><h1>Moje děti</h1><p>Přihlas se a přidej děti. Výsledky budou dostupné na mobilu i PC.</p><Link to="/auth" className="learn-button primary">Přihlásit se</Link></section>;
 if(!family.profiles.some(p=>p.access==='self'))return <section className="learn-panel"><h1>Tvoje procvičování</h1><Link to="/">Zpět k lekcím</Link></section>;
 return <><div className="learn-page-heading"><div><p className="learn-eyebrow">Každé dítě má svůj pokrok</p><h1>Moje děti</h1><p>Vyber dítě pro procvičování nebo podrobné výsledky.</p></div><button className="learn-button secondary" onClick={()=>{family.select(family.profiles.find(p=>p.access==='self')!.id);navigate('/');}}>Moje procvičování</button></div>
 <div className="learn-two-columns">{children.map(child=>{
  const stats=results[child.id];const finished=stats?.sessions.filter(s=>s.status==='completed')||[];
  return <section className="learn-panel" key={child.id}><h2>{child.name}</h2><p>{stats?`${finished.length} dokončených lekcí · ${stats.xp} XP`:'Načítáme výsledky…'}</p>
   <div className="learn-actions"><button className="learn-button primary" onClick={()=>{family.select(child.id);navigate('/');}}>Procvičovat jako {child.name}</button><button className="learn-button secondary" onClick={()=>{family.select(child.id);navigate('/statistiky');}}>Podrobné výsledky</button></div>
   <button className="learn-button secondary" disabled={busy} onClick={()=>void action(async()=>{const {data,error}=await learningCloud.rpc('issue_learner_invite',{p_learner_id:child.id});if(error)throw error;const invite=data as unknown as {code:string;expires_at:string};setCode({learnerId:child.id,value:invite.code,expires:invite.expires_at});})}>Vytvořit kód pro dítě</button>
   <p className="learn-muted">Kód připojí mobil nebo PC dítěte k tomuto profilu.</p>
   {code?.learnerId===child.id&&<div className="learn-panel"><h3>Kód pro {child.name}</h3><PairingCode key={code.value} code={code.value} expires={code.expires}/><p>Na zařízení dítěte otevři Přihlásit se → Mám kód od rodiče. Připoj zařízení bez účtu nebo přes Google dítěte a zadej kód. Pak zde potvrď žádost.</p><button className="learn-text-button" onClick={()=>setCode(null)}>Skrýt kód</button></div>}
   {requests.filter(r=>r.learner_id===child.id).map(request=><div className="learn-notice" key={request.id}><span>Nové zařízení žádá přístup k profilu {child.name}. Potvrď pouze zařízení, na kterém jsi právě zadal/a kód.</span>{[true,false].map(approve=><button key={String(approve)} disabled={busy} onClick={()=>void action(async()=>{const {error}=await learningCloud.rpc('approve_learner_access',{p_invite_id:request.id,p_approve:approve});if(error)throw error;})}>{approve?'Povolit':'Odmítnout'}</button>)}</div>)}
   {devices.filter(d=>d.learner_id===child.id).map((device,index)=><div className="learn-history" key={device.account_id}><span>Připojený účet {index+1}</span><button className="learn-text-button" disabled={busy} onClick={()=>void action(async()=>{const {error}=await learningCloud.rpc('revoke_learner_access',{p_learner_id:child.id,p_account_id:device.account_id});if(error)throw error;})}>Odebrat přístup</button></div>)}
  </section>;
 })}</div>
 <form className="learn-panel" onSubmit={e=>{e.preventDefault();void action(async()=>{const {error}=await learningCloud.rpc('add_child',{p_name:name.trim()});if(error)throw error;setName('');await family.refresh();});}}><h2>Přidat dítě</h2><label>Jméno dítěte<input value={name} onChange={e=>setName(e.target.value)} required maxLength={60} autoComplete="off"/></label><button className="learn-button primary" type="submit" disabled={busy||!name.trim()}>Přidat dítě</button><p className="learn-muted">Dítě nemusí mít vlastní účet. Na tomto zařízení může procvičovat hned.</p></form>
 <details className="learn-panel"><summary>Dítě již má vlastní účet</summary><p>V účtu dítěte otevři Profil → Propojit tento profil s rodičem. Zadej jeho kód. Dítě potom potvrdí přístup. Dosavadní výsledky zůstanou u stejného profilu.</p><form onSubmit={e=>{e.preventDefault();void action(async()=>{const {error}=await learningCloud.rpc('request_learner_access',{p_code:existingCode,p_purpose:'guardian'});if(error)throw error;setWaiting(true);});}}><label>Kód z účtu dítěte<input required maxLength={16} value={existingCode} onChange={e=>setExistingCode(e.target.value)}/></label><button className="learn-button secondary" disabled={busy}>Požádat o propojení</button>{waiting&&<p role="status">Čekáme na potvrzení v účtu dítěte. Přehled se automaticky obnovuje.</p>}</form></details>
 {error&&<p className="learn-error" role="alert">{error}</p>}</>;
}
