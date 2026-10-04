# Procvička

Před změnami ve výukových hrách přečti `docs/LEARNING-V2.md`. Aktivní hry, profily a ukládání jsou v `src/features/learning`; staré moduly zůstávají pro historii a následnou migraci.

Zachovej celý osobní slovník, původní výsledky a existující XP. Každá odpověď musí mít jeden přijatý pokus, samostatnou opravu a explicitní postup na další úlohu. Místní profil není cloudové oprávnění. Odměny pro cloud potvrzuje transakce na serveru.

Po změně kurátorovaného obsahu spusť `npm run content:generate` a ověř shodu katalogu. Při změnách her proveď `npm run typecheck`, `npm run lint:learning`, `npm test`, `npm run test:database` a `npm run build`. Nezaměňuj izolované databázové testy za nasazení do skutečného Supabase projektu.
