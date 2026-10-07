# Procvička: implementace po auditu

Aktualizace 7. 10. 2026: rodinné cloudové profily, rodičovská oprávnění, párování dětských zařízení a synchronizace rozpracovaných lekcí jsou implementované. Aktuální model, skutečné nasazení tří migrací, zachování historie a zbývající nastavení SMTP popisuje [FAMILY-ACCOUNTS.md](FAMILY-ACCOUNTS.md). Nový model nahrazuje níže uvedený původní předpoklad jednoho výukového profilu na přihlášení; odměny stále potvrzuje serverová transakce, nyní se zámkem výukového profilu.

Datum: 4. 10. 2026. Výchozí commit: `fbe6ee2cd7c7b72d795cbe8a569b0696b89046fb`.

## Co aplikace nyní používá

Nové stránky v `src/features/learning` obsluhují domovskou obrazovku, všechny tři hry, pokrok, profily, přihlášení a správu slovníku. Staré adresy `/matematika`, `/pravopis`, `/slovnik` jsou zachované. Starší historii otevírá `/statistiky/historie`; původní komponenty a data zůstávají v repozitáři kvůli této historii a následné migraci.

Lekce má 5, 10, 15 nebo 20 úloh. Odpověď nejdřív zapíše neměnný pokus, potom zobrazí vysvětlení. Další úloha následuje po stisknutí tlačítka. Dvojklik, odpověď během pauzy a další odpověď v dokončené lekci se ignorují. Oprava má samostatný pokus a nepřepisuje první chybu. Pauza a rozpracované lekce přežijí obnovení stránky. Žádný výsledek závislý na rychlosti se neodměňuje.

Matematika používá konečnou ověřenou sadu, nikoli rekurzivní generování. Součet respektuje maximum, sčítanci minimum, odčítání není záporné, dělitel není nula a výsledek dělení je celé číslo. Neproveditelné nastavení zobrazí vysvětlení. Při malé sadě se úlohy opakují; jejich XP se nezapočítávají opakovaně.

Čeština má 70 zkontrolovaných vět, po deseti pro B, L, M, P, S, V, Z. Každá položka má právě jednu cílovou mezeru a vlastní pravidlo. Význam rozlišuje být/bít, mýt/mít, pyl/pil, výr/vír, výt/vít a výskat/vískat. Automatické odstraňování diakritiky se nepoužívá. Původní rozsáhlejší katalog je zachovaný, ale nový průběh jej nepovažuje automaticky za didakticky ověřený. Zdroj pravidel: [Internetová jazyková příručka ÚJČ](https://prirucka.ujc.cas.cz/?id=100).

Slovník zachovává všech 120 osobních a 106 školních slov. Upravená a cloudová slova se přidávají podle stabilního ID, nenahrazují celý výchozí slovník neúplnou odpovědí serveru. Dětský profil začíná školní sadou, dospělý osobní; uložená volba má přednost. Kartička ukáže překlad a dvojjazyčný příklad až po otočení. Kartičky zaznamenávají vlastní hodnocení, psaní kontroluje deklarované varianty. `refund` má opravený překlad vrátit peníze / vrácení peněz. CSV chrání uvozovky, nové řádky a hodnoty připomínající tabulkové formule.

## Ukládání a odměny

Místní a skutečné Supabase přihlášení jsou odlišné režimy. Místní výběr jména neuděluje práva k cizím cloudovým údajům. Klíč v prohlížeči: `procvicka:v2:<local|cloud>:<learnerId>`. Profil má vlastní lekce, slovník, nastavení, odznaky a opakování. Poškozený záznam se nezahazuje: před přepsáním vznikne obnovovací kopie; export zahrnuje i tuto kopii a starší lokální historii bez přihlašovacích údajů.

Cloud nejdřív uchovává lokální záznam a teprve ukončenou lekci posílá do fronty. Chyba zůstává viditelná, existuje ruční opakování a pokus po návratu spojení. Úspěch se zobrazuje až po potvrzení RPC. Databázová transakce zkontroluje vlastníka, kanonickou matematiku a obsah češtiny/angličtiny, přepočítá odpovědi a body. Klíč lekce chrání proti opakovanému odeslání. Zámek účtu serializuje souběžné odměny. Textová ID `u-*` a `w-*` mají vlastní tabulku a nejsou nesprávně používána jako UUID v původním cizím klíči.

Za nové správné zadání na první pokus bez nápovědy je 10 XP, za podporovanou odpověď nebo vlastní hodnocení kartičky 3 XP. Stejné zadání se odmění nejvýše jednou za český den. Dokončení přidá 5 XP nejvýše dvakrát pro předmět za den a pouze při alespoň jedné správné odpovědi. Samé chyby nevytvářejí XP. Odznaky jsou jednorázové a server je uděluje ve stejné transakci. Úroveň 1 začíná na 0, úroveň 2 na 250 a další prahy zůstávají kompatibilní s původní SQL křivkou. Dosavadní `total_xp` se nemaže. Kalendář používá Europe/Prague a testy pokrývají změny času.

Opakování používá praktickou výchozí politiku 1/3/7/14/30 dní a krátký návrat po chybě. Tato konkrétní čísla jsou produktová volba, nikoli tvrzení o jediné vědecky správné metodě. Nový přehled dovedností bere opakující se obsah v jedné lekci jednou a odděluje ověřené odpovědi od samohodnocení kartiček.

## Design a přístupnost

Světlé pozadí, jednotná zelená akční barva a tři tlumené barvy předmětů. Desktop má horní navigaci; mobil a tablet čtyři spodní cíle s bezpečným okrajem obrazovky. Při aktivní lekci zůstává zadání, odpověď, nápověda a pauza. Volba tématu a omezení pohybu zůstávají dostupné. Ovládání používá nativní tlačítka, popisky formulářů, viditelný fokus, stavová oznámení a modální pauzu se zachycením fokusu. Vizuálně ověřeno 320 px, 390 px a desktop; další kroky mají zahrnout čtečku obrazovky a použití reálnými dětmi.

Načítání stránek je rozdělené. Hlavní produkční JS přibližně 505 kB / 154 kB gzip, oproti auditovanému přibližně 1,38 MB / 386 kB gzip. Starší grafy se stahují až při otevření historie. Build upozorňuje na hlavní chunk těsně nad 500 kB; funkční sestavení prochází.

Service worker při produkčním sestavení přednačte přesný HTML/JS/CSS balík. Nekompletní cache nenahradí fungující verzi. Aktualizace čeká na zavření starých panelů; žádná lekce se automaticky nerealoaduje. Výslovnost může záviset na hlasech a možnostech prohlížeče. Datová synchronizace vyžaduje spojení.

## Ověření a nasazení

```sh
npm ci
npm run typecheck
npm run lint:learning
npm test
npm run test:database
npm run content:generate
npm run build
npm run dev
```

Použij Node.js 24 nebo novější podporovanou verzi. `.npmrc` zachovává kompatibilitu stávajících závislostí se starším `react-day-picker` a `date-fns`. Nová testovací závislost PGlite je pouze vývojová. GitHub Actions provádí stejné kontroly včetně porovnání SQL katalogu se zdrojovými daty. Globální původní `npm run lint` stále zahrnuje staré neaktivní moduly s historickými `any` a dalšími nálezy; nový kód má vlastní čistou kontrolu, původní chyby nejsou skrývány změnou pravidel.

Pro cloudové ukládání musí být do správného Supabase projektu nasazeny obě nové migrace v pořadí:

1. `20261004090000_learning_v2.sql`: tabulky, RLS, transakce, ochrana XP a oprava otevřených pravidel původního slovníku.
2. `20261004090100_learning_content.sql`: kanonický obsah generovaný ze zdrojů aplikace.

V rámci implementace byly migrace provedeny a otestovány v izolovaném PostgreSQL/PGlite. Tento test má minimální schéma předchozích tabulek a simulované `auth.uid()`. Následně byly obě migrace nasazeny a ověřeny také ve skutečném produkčním projektu; stav je zaznamenán níže. Bez migrací aplikace zachová lokální frontu a zobrazí neúspěch synchronizace.

### Produkční nasazení 4. 10. 2026

- GitHub: [600500400/math-czech-game](https://github.com/600500400/math-czech-game), větev `main`. Implementační commit `208cbd990452648ac6828db8c3723970ebe486d2`; změny Lovable v generovaných typech byly zachovány. [Úplná kontrola v GitHub Actions](https://github.com/600500400/math-czech-game/actions/runs/37196948000) prošla: 64 testů, typecheck, lint nových modulů, databázové testy, shoda generovaného katalogu a produkční build.
- Supabase: projekt `practice`, ref `arnowuvckpxpeavrcbri`. V `supabase_migrations.schema_migrations` jsou potvrzeny verze `20261004090000` a `20261004090100`, shodné s verzemi souborů v repozitáři. První migraci provedlo Lovable; druhá byla provedena přes SQL Editor v jediné transakci včetně kontroly zachování dat a zápisu do historie migrací. Opětovné spuštění první migrace není potřeba.
- Společný kanonický katalog obsahuje **70 českých úloh a 106 školních slov**, celkem 176 položek. Přes veřejné REST API byla ověřena přesná shoda každého JSON payloadu se zdrojovým katalogem. **120 osobních slov** zůstává v aplikaci a při cloudové synchronizaci v tabulce slov konkrétního účtu; nejsou součástí veřejného katalogu.
- Kontroly před nasazením, po nasazení a po testu s rollbackem potvrdily zachování 175 původních databázových slov (55 vytvořených uživateli), 8 záznamů úrovní, součtu 4 950 XP, 7 záznamů sérií a 8 původních úspěchů. Původní slovník se nezaséval znovu a výsledky se nemazaly.
- Ve skutečném PostgreSQL prošel transakční test pod rolí `authenticated` s testovacím JWT kontextem existujícího účtu: kanonická matematika, čeština a angličtina, zachování původních XP, opakované odeslání lekce, denní limity, odmítnutí cizího profilu, RLS a zákaz původního libovolného zápisu XP. Veškeré testovací zápisy byly vráceny pomocí `ROLLBACK`; závěrečná kontrola potvrdila původní XP a nulový počet nových lekcí. Anonymní REST požadavek na dokončení lekce vrací 401 / `42501` a soukromé tabulky nevracejí žádné řádky.
- Lovable: [aktuální projekt](https://lovable.dev/projects/e8387773-d268-4b38-a8a6-cdfff50f01b0). Náhled již načítá nový vzhled z GitHubu. **Finální Publish / Update provede uživatel podle svého požadavku**; veřejný web nepovažovat za aktualizovaný před tímto krokem. Nasazení Supabase nezávisí na zbývajících kreditech Lovable.

Samostatně zbývá ověření skutečného přihlášení v uživatelském rozhraní, cloudové synchronizace ze dvou prohlížečů a obnovení exportu na testovacím účtu. Test rolí v SQL nepředstavuje ověření OAuth nebo celého přihlašovacího průchodu v prohlížeči.

## Znalostní záznam a navazující práce

Návrh z 6. 10. 2026 na rodinné cloudové profily, Google/e-mail, rodičovský přehled a automatické ukládání je v [FAMILY-ACCOUNTS.md](FAMILY-ACCOUNTS.md). Jde o návrh další etapy, nikoli již nasazenou rodinnou autorizaci. Veřejné nastavení Supabase potvrzuje zapnutý Google a e-mail, vypnutý Facebook a Apple; úspěšný průchod Google zatím nebyl ověřen.

Zachovat celé osobní studijní slovníky, starší výsledky a XP. Místní dětská jména nejsou cloudové účty. Nové herní stránky nemají používat staré hooks `useMathGame`, `useSpellingGame` nebo `useDictionaryGame`; obsah a reducer v této složce jsou nyní společné místo změn. Po změně schváleného obsahu znovu generovat SQL, upravit jeho verzi bezpečně vůči rozpracovaným lekcím a rozšířit regresní testy.

Další pořadí: pedagogicky zkontrolovat a rozšířit zbývající původní český katalog; otestovat čtečky obrazovky a ergonomii s dětmi; ověřit přihlášení a synchronizaci dvou klientů na stagingu; navrhnout cloudovou rodinu s ověřeným souhlasem dítěte místo samotné lokální role; postupně migrovat a odstranit staré herní moduly a doplnit úplný lint. Starší historie se záměrně nedoplňuje falešnými vazbami na lekce podle časového okna ±10 minut.
