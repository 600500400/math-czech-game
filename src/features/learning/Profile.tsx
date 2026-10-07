import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useLearning } from './context';
import { useFamily } from './family-context';
import { readLearningData, storageKey, legacyLocalResults } from './storage';
import { learningCloud } from './cloud';
import type { Json } from '@/integrations/supabase/types';
import ConnectParent from './ConnectParent';
import { localProfiles } from './catalog';

export default function Profile() {
 const {authState,signOut}=useAuth();const {data,cloud,learnerId,savePreferences,saveWords,exportBackup,importBackup,syncing,retrySync}=useLearning();const family=useFamily();const {theme,setTheme}=useTheme();const upload=useRef<HTMLInputElement>(null);
 const [message,setMessage]=useState('');const [localId,setLocalId]=useState('');const [importing,setImporting]=useState(false);
 const [name,setName]=useState(family.active?.name||'');
 const localKeys=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)).filter((key):key is string=>!!key&&key.startsWith('procvicka:v2:local:'));
 const legacyIds=Array.from({length:localStorage.length},(_,i)=>localStorage.key(i)?.match(/^(?:mathStats|spellingStats|dictionaryStats|mathAnswers|spellingAnswers|dictionaryAnswers|emergency_[^_]+)_(.+)$/)?.[1]).filter((id):id is string=>!!id);
 const candidates=[...new Set([...localKeys.filter(key=>!key.includes(':recovery:')&&!key.includes(':before-')).map(key=>key.slice('procvicka:v2:local:'.length)),...legacyIds])];
 const transfer=async()=>{
  setImporting(true);setMessage('');
  try {
   const record=readLearningData(storageKey(localId,false));if(record.error)throw new Error(record.error);
   const {error}=await learningCloud.rpc('import_local_history',{p_learner_id:learnerId,p_local_id:localId,p_payload:{...record.data,legacy:legacyLocalResults(localId).data} as unknown as Json});if(error)throw error;
   saveWords(Object.values(record.data.words));setMessage('Historie byla uložena do tohoto cloudového profilu. Původní místní záznamy zůstávají zachované. Staré místní XP najdeš v archivu; nová odměna se nepřičítá podruhé.');
  }catch(e){setMessage(e instanceof Error?e.message:(e as {message?:string})?.message||'Přenos se nezdařil.');}finally{setImporting(false);}
 };
 return <><div className="learn-page-heading"><div><p className="learn-eyebrow">Tvoje místo v Procvičce</p><h1>{family.active?.name||authState.profile?.full_name||authState.user?.username||'Vyzkoušení bez účtu'}</h1><p>{cloud?'Výsledky se automaticky ukládají do účtu.':'Výsledky jsou zatím jen na tomto zařízení.'}</p></div>{!cloud&&<Link className="learn-button primary" to="/auth">Přihlásit se</Link>}</div>
 {cloud&&family.profiles.some(p=>p.access==='self')&&<section className="learn-panel"><h2>Moje děti</h2><p>Každé dítě má vlastní výsledky. Ty můžeš dál procvičovat ve svém profilu.</p><Link className="learn-button primary" to="/children">{family.profiles.some(p=>p.access==='guardian')?'Zobrazit moje děti':'Přidat dítě'}</Link></section>}
 <section className="learn-panel"><h2>Pohodlí při učení</h2><label>Vzhled<select value={theme} onChange={e=>setTheme(e.target.value as typeof theme)}><option value="system">Podle zařízení</option><option value="light">Světlý</option><option value="dark">Tmavý</option></select></label><label className="learn-checkbox"><input type="checkbox" checked={data.preferences.reducedMotion} onChange={e=>savePreferences({reducedMotion:e.target.checked})}/> Omezit pohyb a animace</label><Link className="learn-button secondary" to="/dictionary/manage">Můj slovník</Link><button className="learn-text-button" onClick={()=>void signOut()}>{cloud?'Odhlásit účet':'Ukončit vyzkoušení'}</button>{authState.error&&<p className="learn-error" role="alert">{authState.error}</p>}</section>
 {cloud&&candidates.length>0&&<form className="learn-panel" onSubmit={e=>{e.preventDefault();void transfer();}}><h2>Přenést dosavadní místní výsledky</h2><p>Vyber, komu patří výsledky na tomto zařízení. Přenesou se do profilu <strong>{family.active?.name}</strong>. Shoda jména se nepovažuje za potvrzení vlastnictví.</p><label>Místní profil<select required value={localId} onChange={e=>setLocalId(e.target.value)}><option value="">Vyber profil</option>{candidates.map(id=><option key={id} value={id}>{localProfiles.find(p=>p.id===id)?.username||id}</option>)}</select></label><button className="learn-button secondary" disabled={!localId||importing}>Přenést historii a vlastní slovíčka</button></form>}
 <details className="learn-panel"><summary>Pokročilé možnosti</summary><p>{cloud?'Ukládání je automatické. Záloha je doplňková možnost pro vlastní kopii dat.':'Pro přenos na jiné zařízení se přihlas nebo stáhni kopii.'}</p><div className="learn-actions"><button className="learn-button secondary" disabled={syncing} onClick={()=>void retrySync()}>Zopakovat synchronizaci</button><button className="learn-button secondary" onClick={exportBackup}>Stáhnout kopii výsledků</button><button className="learn-button secondary" onClick={()=>upload.current?.click()}>Obnovit vlastní kopii</button></div><input ref={upload} type="file" accept="application/json,.json" className="sr-only" aria-label="Kopie výsledků" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>10_000_000)throw new Error('Soubor je příliš velký.');importBackup(await file.text());setMessage('Výsledky byly přidány.');}catch(e){setMessage(e instanceof Error?e.message:'Obnova se nezdařila.');}}}/><p className="learn-muted">ID profilu: {learnerId}</p></details>
 {cloud&&<form className="learn-panel" onSubmit={e=>{e.preventDefault();void learningCloud.rpc('rename_learner',{p_learner_id:learnerId,p_name:name}).then(async({error})=>{if(error)setMessage(error.message);else{await family.refresh();setMessage('Jméno bylo uloženo.');}});}}><h2>Jméno profilu</h2><label>Jak ti máme říkat?<input required maxLength={60} value={name} onChange={e=>setName(e.target.value)}/></label><button className="learn-button secondary">Uložit jméno</button></form>}
 {cloud&&<ConnectParent/>}
 {message&&<p role="status" className="learn-notice">{message}</p>}</>;
}
