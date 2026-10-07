import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserRound, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { localProfiles } from './catalog';
export default function Profiles() {
  const {setLocalUser,authState}=useAuth(); const navigate=useNavigate(); const [name,setName]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const choose=async(user:typeof localProfiles[number])=>{setBusy(true);setError('');try{await setLocalUser(user);navigate('/');}catch(error){setError(error instanceof Error?error.message:'Profil se nepodařilo vybrat.');}finally{setBusy(false);}};
  if(authState.mode==='cloud')return <Navigate to="/children" replace/>;
  return <><div className="learn-page-heading"><div><p className="learn-eyebrow">Společné zařízení, vlastní výsledky</p><h1>Kdo dnes procvičuje?</h1><p>Místní profily uchovávají výsledky na tomto zařízení.</p></div><Link className="learn-button secondary" to="/auth">Přihlásit se do účtu</Link></div><div className="learn-profiles">{localProfiles.map((profile,index)=><button disabled={busy} key={profile.id} onClick={()=>void choose(profile)}><span className={`profile-initial color-${index%3}`}>{profile.username.charAt(0)}</span><strong>{profile.username}</strong><small>{profile.role==='parent'?'Osobní slovník a rodinný přehled':'Školní procvičování'}</small><ArrowRight size={20}/></button>)}</div><form className="learn-panel" onSubmit={e=>{e.preventDefault();void choose({id:`local-${name.trim().toLocaleLowerCase('cs')}`,username:name.trim(),role:'child'});}}><h2>Vlastní místní profil</h2><label>Jméno<input value={name} onChange={e=>setName(e.target.value)} maxLength={40} required placeholder="Jak ti máme říkat?"/></label><button className="learn-button secondary" disabled={!name.trim()||busy} type="submit"><UserRound size={18}/> Použít toto jméno</button></form>{error&&<p role="alert" className="learn-error">{error}</p>}</>;
}
