import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { learningCloud } from './cloud';

import { FamilyContext,type LearnerProfile } from './family-context';
export function FamilyProvider({children}: {children:ReactNode}) {
 const {authState}=useAuth();
 return <AccountFamilyProvider key={authState.mode+':'+authState.user?.id}>{children}</AccountFamilyProvider>;
}
function AccountFamilyProvider({children}: {children:ReactNode}) {
 const {authState}=useAuth(); const account=authState.mode==='cloud'?authState.user?.id:null;
 const name=authState.profile?.full_name||authState.user?.username||'Můj profil';
 const [cached]=useState<LearnerProfile[]>(()=>{try{const value:unknown=account?JSON.parse(localStorage.getItem(`procvicka:profiles:${account}`)||'[]'):[];return Array.isArray(value)?value.filter(p=>p&&typeof p.id==='string'&&typeof p.owner_id==='string'&&typeof p.name==='string'&&['self','guardian','learner'].includes(p.access)):[];}catch{return [];}});
 const [profiles,setProfiles]=useState<LearnerProfile[]>(cached); const [selected,setSelected]=useState(cached.find(p=>p.access==='self')?.id||cached[0]?.id||'');
 const [loading,setLoading]=useState(!!account&&!cached.length); const [error,setError]=useState('');
 const refresh=useCallback(async()=>{
  if(!account){setProfiles([]);setLoading(false);return;}
  try {
   const {data,error:failure}=await learningCloud.rpc('my_learners',{p_name:name}); if(failure)throw failure;
   const list=data as unknown as LearnerProfile[]; setProfiles(list);setError('');
   localStorage.setItem(`procvicka:profiles:${account}`,JSON.stringify(list));
   setSelected(previous=>list.some(p=>p.id===previous)?previous:list.find(p=>p.access==='self')?.id||list[0]?.id||'');
  } catch {setError('Cloudové profily se nepodařilo obnovit. Dostupné výsledky zůstávají na zařízení.');}
  finally {setLoading(false);}
 },[account,name]);
 useEffect(()=>{void refresh();},[refresh]);
 return <FamilyContext.Provider value={{profiles,active:profiles.find(p=>p.id===selected)||null,loading,error,refresh,select:id=>{if(profiles.some(p=>p.id===id))setSelected(id);}}}>{children}</FamilyContext.Provider>;
}
