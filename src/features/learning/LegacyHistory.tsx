import {useEffect,useState} from 'react';
import {useLearning} from './context';
import {learningCloud} from './cloud';
import {downloadText} from './storage';
const names:Record<string,string>={math_statistics:'Matematika – přehledy',math_answers:'Matematika – odpovědi',spelling_statistics:'Čeština – přehledy',spelling_answers:'Čeština – odpovědi',dictionary_statistics:'Angličtina – přehledy',dictionary_answers:'Angličtina – odpovědi'};
export default function LegacyHistory(){
 const {learnerId,cloud}=useLearning();const [data,setData]=useState<Record<string,Record<string,unknown>[]>>({});const [error,setError]=useState('');
 useEffect(()=>{if(!cloud)return;let alive=true;void learningCloud.rpc('get_learner_legacy',{p_learner_id:learnerId}).then(({data,error})=>{if(!alive)return;if(error)setError('Starší historii se nepodařilo načíst.');else setData((data||{}) as Record<string,Record<string,unknown>[]>);});return()=>{alive=false;};},[learnerId,cloud]);
 if(!error&&!Object.values(data).some(rows=>rows.length))return null;
 return <section className="learn-panel"><h2>Výsledky z předchozí verze</h2>{error&&<p role="alert">{error}</p>}{Object.entries(data).filter(([,rows])=>rows.length).map(([table,rows])=><details key={table}><summary>{names[table]||table} · {rows.length} záznamů</summary>{rows.slice(0,50).map((row,i)=><p key={String(row.id||i)}>{String(row.created_at||row.date||'')} · {String(row.question||row.word||row.correct_answers||'Záznam')} {row.answer!=null&&`→ ${String(row.answer)}`}{row.is_correct!=null&&` · ${row.is_correct?'správně':'k zopakování'}`}</p>)}<button className="learn-text-button" onClick={()=>downloadText(`historie-${table}.json`,JSON.stringify(rows,null,2))}>Stáhnout všechny původní záznamy</button></details>)}</section>;
}
