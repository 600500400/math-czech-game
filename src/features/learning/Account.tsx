import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { learningCloud } from './cloud';
import { useFamily } from './family-context';
function loginError(error:unknown){const e=error as {code?:string;message?:string};if(['email_address_not_authorized','over_email_send_rate_limit'].includes(e.code||''))return 'Přihlášení e-mailem teď není dostupné. Pokračuj přes Google.';if(['otp_expired','invalid_credentials'].includes(e.code||''))return 'Kód nebo přihlašovací údaje neplatí. Zkus to znovu.';if(e.code==='over_request_rate_limit')return 'Pokusů bylo příliš mnoho. Počkej chvíli a zkus to znovu.';if(e.code==='42501')return 'K tomuto profilu nemáš přístup. Požádej rodiče o nový kód.';return e.message||'Přihlášení se nezdařilo. Zkus to znovu.';}
export default function Account() {
 const {authState,signIn}=useAuth();const family=useFamily();const navigate=useNavigate();
 const [email,setEmail]=useState('');const [token,setToken]=useState('');const [sent,setSent]=useState(false);const [password,setPassword]=useState('');const [usePassword,setUsePassword]=useState(false);
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const [pair,setPair]=useState(()=>sessionStorage.getItem('procvicka:pair')==='true');const [code,setCode]=useState('');const [waiting,setWaiting]=useState(()=>!!sessionStorage.getItem('procvicka:pair-request'));
 const cloud=authState.mode==='cloud';
 const emailEnabled=import.meta.env.VITE_EMAIL_LOGIN_ENABLED==='true';
 useEffect(()=>{if(cloud&&family.active&&!pair&&!authState.isLoading)navigate('/',{replace:true});},[cloud,family.active,pair,authState.isLoading,navigate]);
 const refresh=family.refresh;
 useEffect(()=>{if(!waiting)return;const poll=async()=>{await refresh();const id=sessionStorage.getItem('procvicka:pair-request');if(!id)return;const {data}=await learningCloud.from('learner_invites').select('*').eq('id',id).maybeSingle();if(data?.revoked_at){setWaiting(false);sessionStorage.removeItem('procvicka:pair-request');setError('Rodič žádost odmítl nebo přístup zrušil. Vyžádej si nový kód.');}};const timer=window.setInterval(()=>void poll(),5000);return()=>window.clearInterval(timer);},[waiting,refresh]);
 useEffect(()=>{if(pair&&family.profiles.some(p=>p.access==='learner')){sessionStorage.removeItem('procvicka:pair');sessionStorage.removeItem('procvicka:pair-request');navigate('/',{replace:true});}},[pair,family.profiles,navigate]);
 const perform=async(work:()=>Promise<void>)=>{setBusy(true);setError('');try{await work();}catch(e){setError(loginError(e));}finally{setBusy(false);}};
 return <section className="learn-account learn-panel"><p className="learn-eyebrow">Výsledky na mobilu i PC</p><h1>{pair?'Připojit dětský profil':'Vítej v Procvičce'}</h1>
 {!cloud&&<><p>{pair?'Připoj zařízení pomocí kódu od rodiče. Google a e-mail jsou volitelné.':'Přihlas se a rovnou procvičuj. Děti můžeš přidat kdykoliv později.'}</p><button className="learn-button primary" disabled={busy} onClick={()=>void perform(async()=>{const {error}=await supabase.auth.signInWithOAuth({provider:'google',options:{redirectTo:window.location.origin+'/auth'}});if(error)throw error;})}>Pokračovat přes Google</button>
 {(emailEnabled||usePassword)&&<form className="learn-stack" onSubmit={e=>{e.preventDefault();void perform(async()=>{
  if(usePassword){await signIn(email,password);return;}
  if(sent){const {error}=await supabase.auth.verifyOtp({email,token,type:'email'});if(error)throw error;}
  else {const {error}=await supabase.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:window.location.origin+'/auth'}});if(error)throw error;setSent(true);}
 });}}><label>E-mail<input type="email" required value={email} onChange={e=>{setEmail(e.target.value);setSent(false);}} autoComplete="email"/></label>
 {sent&&!usePassword&&<><p>Otevři přihlašovací odkaz v e-mailu. Pokud e-mail obsahuje kód, zadej jej níže. Zkontroluj i spam.</p><label>Kód z e-mailu<input value={token} onChange={e=>setToken(e.target.value)} required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}"/></label></>}
 {usePassword&&<label>Heslo<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label>}
 <button className="learn-button secondary" disabled={busy}>{busy?'Chvilku strpení…':usePassword?'Přihlásit se heslem':sent?'Potvrdit kód':'Pokračovat e-mailem'}</button></form>}<button className="learn-text-button" onClick={()=>{setUsePassword(!usePassword);setSent(false);}}>{usePassword?(emailEnabled?'Použít e-mail bez hesla':'Zpět k přihlášení přes Google'):'Mám již účet s heslem'}</button></>}
 {pair&&cloud&&<form className="learn-stack" onSubmit={e=>{e.preventDefault();void perform(async()=>{const {data,error}=await learningCloud.rpc('request_learner_access',{p_code:code});if(error)throw error;sessionStorage.setItem('procvicka:pair-request',(data as unknown as {id:string}).id);setWaiting(true);});}}><label>Kód od rodiče<input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} required maxLength={16} autoComplete="off"/></label><button className="learn-button primary" disabled={busy||waiting}>Požádat o připojení</button>{waiting&&<p role="status">Čekáme na potvrzení rodiče v přehledu „Moje děti“. Stránka se po potvrzení sama přepne.</p>}</form>}
 {pair&&!cloud&&<button className="learn-button secondary" disabled={busy} onClick={()=>void perform(async()=>{sessionStorage.setItem('procvicka:pair','true');const {error}=await supabase.auth.signInAnonymously();if(error)throw error;})}>Připojit zařízení bez Google a e-mailu</button>}
 {(error||authState.error)&&<p role="alert" className="learn-error">{error||authState.error}</p>}
 <button className="learn-text-button" onClick={()=>{const next=!pair;setPair(next);if(next)sessionStorage.setItem('procvicka:pair','true');else{sessionStorage.removeItem('procvicka:pair');sessionStorage.removeItem('procvicka:pair-request');if(cloud&&!family.active)void supabase.auth.signOut();}}}>{pair?'Zpět k běžnému přihlášení':'Mám kód od rodiče'}</button><Link className="learn-text-button" to="/select-user">Vyzkoušet bez účtu</Link></section>;
}
