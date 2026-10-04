import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { fileURLToPath } from 'node:url';
export const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cache=new Map();
// Execute the repository's pure TS content modules to keep SQL seeds identical.
export function loadSource(relative){
  const file=path.resolve(projectRoot,relative);if(cache.has(file))return cache.get(file);
  const exports={};cache.set(file,exports);
  const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  vm.runInNewContext(code,{exports,require:(specifier)=>{
    if(specifier.startsWith('@/'))return loadSource('src/'+specifier.slice(2)+'.ts');
    if(specifier.startsWith('.'))return loadSource(path.relative(projectRoot,path.resolve(path.dirname(file),specifier+'.ts')));
    throw new Error('Only repository content modules may be loaded: '+specifier);
  },Intl,Date,Set,Map,Math,console},{filename:file});return exports;
}
