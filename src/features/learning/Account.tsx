import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
export default function Account() {
  const {authState,signIn,signUp}=useAuth(); const navigate=useNavigate(); const [register,setRegister]=useState(false); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState(''); const [role,setRole]=useState<'child'|'parent'>('child');
  const [oauthBusy,setOauthBusy]=useState(false); const [oauthError,setOauthError]=useState('');
  const oauth=async(provider:'google'|'facebook'|'apple')=>{
    setOauthBusy(true);setOauthError('');
    try {const {error}=await supabase.auth.signInWithOAuth({provider,options:{redirectTo:window.location.origin+'/'}});if(error)throw error;}
    catch(error){setOauthError(error instanceof Error?error.message:'Přihlášení přes poskytovatele se nezdařilo.');}
    finally{setOauthBusy(false);}
  };
  useEffect(()=>{if(authState.mode==='cloud'&&authState.isAuthenticated&&!authState.isLoading)navigate('/',{replace:true});},[authState.mode,authState.isAuthenticated,authState.isLoading,navigate]);
  return <section className="learn-account learn-panel"><p className="learn-eyebrow">Tvoje výsledky i na dalším zařízení</p><h1>{register?'Vytvořit účet':'Přihlásit se'}</h1><form className="learn-stack" onSubmit={e=>{e.preventDefault();void(register?signUp(email,password,name,role):signIn(email,password));}}>{register&&<><label>Jméno<input value={name} onChange={e=>setName(e.target.value)} required maxLength={60} autoComplete="nickname"/></label><label>Typ profilu<select value={role} onChange={e=>setRole(e.target.value as typeof role)}><option value="child">Školní procvičování</option><option value="parent">Dospělý / osobní slovník</option></select></label></>}<label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label><label>Heslo<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={register?'new-password':'current-password'} minLength={register?8:1} required/></label>{authState.error&&<p role="alert" className="learn-error">{authState.error}</p>}<button type="submit" className="learn-button primary" disabled={authState.isLoading}>{authState.isLoading?'Chvilku strpení…':register?'Vytvořit účet':'Přihlásit se'}</button></form><button className="learn-text-button" onClick={()=>setRegister(v=>!v)}>{register?'Už mám účet':'Vytvořit nový účet'}</button><div className="learn-stack"><p>Pokračovat přes svůj účet</p><button className="learn-button secondary" disabled={oauthBusy} onClick={()=>void oauth('google')}>Google</button><button className="learn-button secondary" disabled={oauthBusy} onClick={()=>void oauth('facebook')}>Facebook</button><button className="learn-button secondary" disabled={oauthBusy} onClick={()=>void oauth('apple')}>Apple</button>{oauthError&&<p role="alert" className="learn-error">{oauthError}</p>}</div><Link className="learn-button secondary" to="/select-user">Použít místní profil</Link></section>;
}

