import type { Plugin } from 'vite';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
export function offlineBuild(): Plugin {
  return { name: 'procvicka-offline', apply: 'build', writeBundle(options,bundle) {
    const assets=Object.keys(bundle).filter(file=>!file.endsWith('.map'));
    const version=createHash('sha256').update(assets.sort().join('\n')+String(Date.now())).digest('hex').slice(0,16);
    const manifest={version,assets:['/',...assets.filter(file=>file!=='index.html').map(file=>'/'+file)]};
    fs.writeFileSync(path.join(options.dir || 'dist','learning-precache.js'),'self.LEARNING_PRECACHE='+JSON.stringify(manifest)+';\n');
  } };
}
