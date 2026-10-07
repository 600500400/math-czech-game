import fs from 'node:fs';
const env=Object.fromEntries(fs.readFileSync(new URL('../.env',import.meta.url),'utf8').split(/\r?\n/).filter(line=>line.includes('=')).map(line=>{const index=line.indexOf('=');return[line.slice(0,index).trim(),line.slice(index+1).trim().replace(/^['"]|['"]$/g,'')];}));
const response=await fetch(`${env.VITE_SUPABASE_URL}/auth/v1/settings`,{headers:{apikey:env.VITE_SUPABASE_PUBLISHABLE_KEY||env.VITE_SUPABASE_ANON_KEY}});
if(!response.ok)throw new Error(`Auth settings: HTTP ${response.status}`);
const settings=await response.json();console.log(JSON.stringify({external:settings.external,disable_signup:settings.disable_signup,mailer_autoconfirm:settings.mailer_autoconfirm},null,2));
