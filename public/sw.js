/* Versioned app shell. An incomplete install never replaces the working cache.
   Updates wait for existing tabs to close; an active lesson is never reloaded. */
importScripts('/learning-precache.js');
const CACHE='procvicka-learning-'+self.LEARNING_PRECACHE.version;
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    try { await cache.addAll(self.LEARNING_PRECACHE.assets.map(url=>new Request(url,{cache:'reload'}))); }
    catch(error){ await caches.delete(CACHE); throw error; }
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    await self.clients.claim();
    // Activation happens after the previous worker's clients have closed.
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith('procvicka-learning-')&&name!==CACHE).map(name=>caches.delete(name)));
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request, url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      // Serve the shell matching the installed chunk set. Future releases are
      // downloaded atomically by the next worker, never mixed with this shell.
      return (await cache.match('/')) || fetch(request);
    })()); return;
  }
  if(self.LEARNING_PRECACHE.assets.includes(url.pathname)){
    event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(url.pathname))||fetch(request);})());
  }
});

