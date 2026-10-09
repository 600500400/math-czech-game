import { useState } from 'react';

export default function PairingCode({code,expires}:{code:string;expires?:string}) {
 const [message,setMessage]=useState('');
 return <div className="learn-stack" role="status">
  <strong className="family-code">{code}</strong>
  <button type="button" className="learn-button secondary" onClick={()=>{
   if(!navigator.clipboard){setMessage('Označ kód a zkopíruj jej ručně.');return;}
   void navigator.clipboard.writeText(code).then(()=>setMessage('Kód zkopírován.'),()=>setMessage('Označ kód a zkopíruj jej ručně.'));
  }}>Kopírovat kód</button>
  <p>{expires?`Platí do ${new Date(expires).toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})}.`:'Kód platí 10 minut.'} Přístup vznikne až po potvrzení žádosti.</p>
  {message&&<p>{message}</p>}
 </div>;
}
