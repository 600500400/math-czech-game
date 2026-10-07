import { useEffect,useState } from 'react';
import { learningCloud } from './cloud';
import { useLearning } from './context';
import { downloadText } from './storage';
import type { LearningData } from './types';
import type { Json } from '@/integrations/supabase/types';
export default function ImportedHistory(){
 const {learnerId,cloud}=useLearning();const [records,setRecords]=useState<{local_id:string;payload:Json}[]>([]);const [error,setError]=useState('');
 useEffect(()=>{if(!cloud)return;let alive=true;void learningCloud.from('learning_archives').select('*').eq('learner_id',learnerId).then(({data,error})=>{if(!alive)return;if(error)setError('Přenesenou historii se nepodařilo načíst.');else setRecords(data||[]);});return()=>{alive=false;};},[learnerId,cloud]);
 if(!records.length&&!error)return null;
 return <section className="learn-panel"><h2>Přenesená místní historie</h2>{error&&<p role="alert">{error}</p>}{records.map(row=>{const archive=row.payload as unknown as LearningData&{legacy?:Record<string,unknown>};const legacyCount=Object.values(archive.legacy||{}).reduce<number>((sum,value)=>sum+(Array.isArray(value)?value.length:1),0);return <details key={row.local_id}><summary>Profil {row.local_id} · {archive.sessions?.filter(s=>s.status!=='active').length||0} lekcí · {legacyCount} starších záznamů · původních {(archive.baseXp||0)+(archive.sessions||[]).reduce((sum,s)=>sum+s.xp,0)} XP</summary><p>Původní výsledky jsou zachované odděleně od nových serverem ověřených odměn.</p>{archive.sessions?.map(s=><p key={s.id}>{s.title} · {new Date(s.startedAt).toLocaleDateString('cs-CZ')} · {s.attempts.filter(a=>a.number===1&&a.isCorrect).length} / {s.tasks.length} napoprvé · {s.xp} XP</p>)}<button className="learn-text-button" onClick={()=>downloadText(`historie-${row.local_id}.json`,JSON.stringify(row.payload,null,2))}>Stáhnout celou původní historii</button></details>;})}</section>;
}
