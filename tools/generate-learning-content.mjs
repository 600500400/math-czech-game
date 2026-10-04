import fs from 'node:fs';
import path from 'node:path';
import { loadSource,projectRoot } from './learning-source.mjs';
const {spellingTasks}=loadSource('src/features/learning/spelling.ts');
const {schoolWords}=loadSource('src/features/learning/dictionary.ts');
const quote=value=>"'"+JSON.stringify(value).replaceAll("'","''")+"'::jsonb";
const rows=[...spellingTasks.map(t=>[t.contentId,'spelling',t]),...schoolWords.map(w=>[w.id,'english',w])];
const sql='-- Generated from the reviewed learning catalogue. Run npm run content:generate after edits.\ninsert into public.learning_content(content_id,subject,payload) values\n'+rows.map(([id,subject,payload])=>`('${id}','${subject}',${quote(payload)})`).join(',\n')+'\non conflict(content_id) do update set subject=excluded.subject,payload=excluded.payload;\n';
fs.writeFileSync(path.join(projectRoot,'supabase/migrations/20261004090100_learning_content.sql'),sql);console.log('Seeded '+spellingTasks.length+' spelling tasks and '+schoolWords.length+' school words.');
