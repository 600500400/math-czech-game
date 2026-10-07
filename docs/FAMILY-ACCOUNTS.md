# Rodinné účty a ukládání

## Implementováno 7. 10. 2026

Tato část popisuje skutečnou implementaci. Níže zachovaný návrh z 6. a 7. října je historický podklad, nikoli aktuální seznam chyb či nasazených funkcí.

- Každý nový uživatel se přihlásí a začíná vlastním procvičováním. Nevybírá věk, roli ani název rodiny. Rodič přidá dítě zadáním jména; v „Moje děti“ může otevřít jeho pokrok nebo procvičovat jako dítě. Vlastní učení rodiče zůstává samostatné.
- Výukový profil má stabilní ID. Tabulky `learner_profiles` a `learner_access` oddělují vlastnictví dat od přihlašovací identity. Rodina je v této verzi vyjádřená oprávněním konkrétního rodiče ke konkrétním profilům; samostatná tabulka rodin není potřebná.
- Vlastní zařízení dítěte lze připojit bez e-mailu přes anonymní Supabase relaci. Kód má 12 hexadecimálních znaků, platí 10 minut a je jednorázový. Přístup vzniká až po schválení rodičem. Zařízení nevidí rodičovy údaje ani sourozence; rodič může přístup odvolat. Přihlášení Google je také dostupné.
- Má-li dítě již vlastní účet s historií, v jeho Profilu vytvoří pozvánku pro rodiče. Rodič vloží kód v „Moje děti“ a dítě žádost potvrdí. Zachová se původní výukový profil, slovník a historie. Účet s existujícími výsledky nebo vlastními slovy nelze přepárovat jako prázdné zařízení do druhého profilu.
- Dokončené lekce, vlastní slova, preference a rozpracované lekce se ukládají do cloudu. Místní fronta umožňuje práci při výpadku. Server ověřuje každé oprávnění i odměnu; cache profilů v prohlížeči sama práva neuděluje. Konflikt rozpracovaných lekcí nabídne výslovnou volbu a uchová místní kopii. Souběžné dokončení stejné lekce se odmění jednou; odlišné odpovědi druhého zařízení se uchovají v archivu.
- Původní cloudové účty byly propojeny 1:1 podle ID. Původních 175 slov a souhrnných 4 950 XP zůstalo zachováno. Historické textové profily se automaticky nepřiřazují podle jména: to neprokazuje vlastnictví. Lokální výsledky lze výslovně převést z Profilu; archiv zachová původní JSON a XP, aniž by libovolné lokální XP připsal jako serverem potvrzenou odměnu. Původní osobní slovník se zachovává.

### Nasazení a ověření

Ve skutečném projektu `arnowuvckpxpeavrcbri` jsou aplikované a zaznamenané migrace `20261007090000`, `20261007090100` a `20261007090200`. Zapnuté jsou Google a anonymní přihlášení zařízení. Facebook a Apple se nenabízejí. Google byl skutečně ověřen v prohlížeči na lokální aplikaci; veřejnou doménu je třeba ověřit po Publish v Lovable.

Prošly typecheck, lint:learning, všech 69 testů, izolované databázové testy a produkční build. Samostatný test ve skutečném Supabase ověřil schválení rodičem, izolaci RLS včetně anonymního zařízení, společnou historii, opakované odeslání, odměny, konflikt verzí a odvolání přístupu. Všechny testovací zápisy byly vráceny pomocí ROLLBACK. Izolovaný test se nepovažuje za doklad nasazení. Celé párování dvou skutečných zařízení dosud nebylo ručně projito.

Doklady: [nasazení](evidence/family-supabase-deployed.png), [produkční databázový test](evidence/family-supabase-verified.png), [přihlášení zařízení](evidence/family-device-auth-enabled.png). Reprodukovatelný produkční test: `tools/verify-family-production.sql`.

### Zbývající konfigurace

Supabase nemá nastavené vlastní produkční SMTP. Přihlášení odkazem/kódem z e-mailu je připravené v kódu, ale standardně skryté. `VITE_EMAIL_LOGIN_ENABLED=true` zapnout až po nastavení SMTP a skutečném ověření doručení. Google, dětský kód a přihlášení k existujícímu účtu heslem fungují nezávisle na SMTP. Nevytvářet hesla ani neposílat SMTP klíče do repozitáře.

Finální veřejné vydání provádí uživatel tlačítkem Publish v Lovable po převzetí změn z GitHubu. Změna vlastní domény vyžaduje aktualizaci návratových URL Supabase a příslušného OAuth nastavení.

## Historický návrh

Datum: 6. 10. 2026. Stav: návrh k navazující implementaci, nikoli nasazená změna oprávnění.

## Zjednodušení UX po revizi 7. 10. 2026

Datový model ponechat, ale uživateli jej nevysvětlovat při vstupu. Jedna registrace a přihlášení pro všechny; žádný povinný výběr dítě/dospělý/rodič ani samostatný formulář „Založit rodinu“.

- Po přihlášení zobrazit vlastní procvičování se všemi třemi předměty. Každý může používat matematiku, češtinu i angličtinu; výběr učiva a slovníku neurčuje oprávnění.
- Rodič v nabídce zvolí „Přidat dítě“, zadá jméno a hned může spustit dětskou lekci. Rodinné vazby se založí automaticky na serveru. Při už existujícím účtu dítěte umožnit jeho propojení bez vytvoření duplicitního výukového profilu a bez rozdělení statistik.
- „Moje děti“ zobrazit až po přidání dítěte. „Moje procvičování“ vždy zůstává samostatnou dostupnou položkou; rodičovský přehled nesmí nahradit vlastní učení.
- Na společném zařízení nabídnout v přehledu dítěte akci „Procvičovat jako …“. Po celou lekci ukazovat jméno aktivního dítěte a přímý návrat do rodičovského účtu. Tento režim předpokládá rodičovskou relaci na společném zařízení; samostatné dětské zařízení má pouze dětská oprávnění.
- Z detailu dítěte nabídnout „Připojit vlastní mobil nebo PC“. Jednorázový kód otevře právě příslušný profil. Dítě má na přihlašovací obrazovce vedle Googlu a e-mailu odkaz „Mám kód od rodiče“. Volitelně propojit vlastní Google účet dítěte se stejným profilem.
- Nový nezávislý uživatel začíná s vlastním procvičováním, nevidí žádné cizí děti a může děti přidat později. Dítě přicházející bez vazby k rodiči má jen svůj účet a výsledky; propojení s rodičem vyžaduje pozvánku a potvrzení. Samotné přihlášení k aplikaci neurčuje věk ani rodičovské právo.
- Předchozí navržené kroky „založit rodinu“ jsou pouze interní operace. Návrh rozhraní nyní používá konkrétní úkony „Přidat dítě“, „Moje děti“ a „Připojit zařízení“.

Jde o návrh pro předvedení, nikoli o tvrzení, že byl již nasazen. Jako nejlepší výchozí variantu jej ověřit krátkým použitím rodiče a dítěte: první přihlášení, přidání dítěte, vlastní angličtina rodiče, přehled obou dětí, připojení mobilu a návrat ke správnému profilu. Statistické hodnoty v návrhu obrazovek jsou ukázkové.

## Ověřený současný stav

- Aktivní UI v `src/features/learning/Account.tsx` nabízí Google, Facebook i Apple bez ohledu na jejich skutečné zapnutí.
- Veřejné nastavení skutečného Supabase projektu `arnowuvckpxpeavrcbri` dne 6. 10. potvrdilo Google=true, Facebook=false, Apple=false, Email=true, disable_signup=false. Zapnutý Google sám nepotvrzuje fungující přihlášení. Jeho konkrétní chyba zatím nebyla reprodukována; prověřit OAuth klienta, autorizované domény, callback, povolené návratové URL a obnovu relace po návratu.
- Dnešní cloudové tabulky i RPC vyžadují learner_id = auth.uid(). Místní profily a jejich rodičovský přehled jsou pouze v daném prohlížeči. Rodinné členství a oprávnění rodiče k dětským profilům dosud neexistují.
- Dokončené lekce se synchronizují, rozpracované lekce a nastavení zůstávají místní. Pro požadavek pokračování na dalším zařízení je třeba doplnit cloudové ukládání rozpracovaných lekcí a preferencí.

## Doporučený produktový model

Oddělit přihlašovací účet, výukový profil a rodinný prostor. Každý uživatel může mít vlastní profil k procvičování. Rodič má navíc oprávnění spravovat svou rodinu a číst pokrok jejích dětí. Dítě vidí vlastní výsledky. Případný provozní administrátor je samostatná privilegovaná role; není běžným modelem sdílení statistik mezi rodinami.

1. Rodič se přihlásí pomocí Google nebo e-mailu, založí rodinu a vytvoří dva samostatné cloudové profily dětí.
2. Na společném zařízení lze pod rodičovským přihlášením vybrat aktivní profil. Jde o režim sdíleného zařízení; jednoduchý PIN odděluje obrazovky, není samostatnou serverovou autorizací. Na vlastním zařízení dítěte nesmí být uložen rodičovský přihlašovací token.
3. Dítě s vlastním Google účtem přijme časově omezenou jednorázovou pozvánku pro konkrétní profil. Propojení potvrdí správce rodiny. Přihlášení nezaloží druhý profil a neztratí dosavadní výsledky.
4. Dítě bez Google účtu dostane přístup párováním zařízení, schváleným rodičem. Server vytvoří ověřenou relaci s přístupem pouze k danému profilu. Nutné řešit expiraci kódu, omezení pokusů, odvolání zařízení a obnovu přístupu. Samotné jméno nebo krátký trvalý PIN není cloudová autentizace.
5. Druhého rodiče lze pozvat jako dalšího správce rodiny. Samostatný dospělý může aplikaci používat bez rodiny.

Google ověřuje identitu účtu, nikoli vztah rodič–dítě. Volba „jsem rodič“ sama neposkytuje přístup k existujícím cizím dětem. Práva vznikají vytvořením vlastního rodinného prostoru a ověřeným propojením konkrétních profilů; nelze je měnit přímo z klientského formuláře. Pro první verzi zavést jednu aktivní spravující rodinu na dětský profil, více správců v ní; případné sdílení mezi více rodinami je další samostatná funkce.

## Ukládání

Supabase bude trvalý zdroj výsledků, slovníků, preferencí a rozpracovaných lekcí. UI bez hlavní sekce „Ukládání a záloha“, pouze automatický stav „Uloženo“, „Ukládáme“ nebo „Čeká na připojení“. Interní místní frontu zachovat pro výpadky. Rozpracované lekce ukládat s verzí a detekcí konfliktu dvou zařízení; starší kopie nesmí přepsat novější. XP vznikají až po ověření dokončení serverem.

Místní profily ponechat jako zřetelně označené vyzkoušení bez účtu. Při přihlášení nabídnout vědomý přenos dosavadního místního profilu do konkrétního cloudového profilu. Neodvozovat vlastnictví původních výsledků shodou jména. Původní výsledky, XP a celý osobní slovník zachovat. Export přesunout do pokročilých nastavení; serverové zálohování je provozní úkol nezávislý na tomto tlačítku.

## Implementační pořadí

1. Vybrat kanonickou produkční adresu; ověřit přihlášení přes Google na této adrese a doplnit e-mailovou alternativu. Z UI odstranit neaktivní poskytovatele, dokud nejsou ověřeni. U e-mailových kódů zajistit a otestovat skutečné doručování v produkci.
2. Přidat stabilní `learner_profiles`, rodiny, členství/oprávnění, vazby přihlašovacích účtů na profily a jednorázové pozvánky. Oddělit držitele relace od vlastníka výsledků. Nové tabulky s RLS a serverovou správou vazeb; žádný service-role klíč v prohlížeči.
3. Novou dopřednou migrací převést existující cloudové profily 1:1 bez ztráty slovníků, lekcí a XP. Upravit RPC, klíče odměn, zámky a čtení historie podle stabilního profilu a skutečných oprávnění. Neupravovat již nasazené migrační soubory. Zabránit tomu, aby tentýž profil vydělal odměnu znovu při přepnutí přihlašovacího účtu.
4. Rodinný onboarding, výběr profilů, rodičovský přehled, pozvánky a propojení dětského účtu. Google povolení k účtu dítěte není totéž jako rodinné členství v aplikaci.
5. Automatická synchronizace rozpracovaných lekcí a preferencí, detekce konfliktů, jednorázový přenos místních záznamů. Zjednodušit profilovou stránku a schovat běžné zálohovací ovládání.
6. Samostatně doplnit dětské párování bez Google a správu zařízení. Nepředstírat tuto funkci lokálním přepínačem jména.

## Akceptační ověření

- Rodič + dvě děti: různé profily, oddělené XP, slovníky a odpovědi, správný rodičovský přehled.
- Přihlášení téhož účtu na mobilu i PC; dokončené i rozpracované lekce se načtou z cloudu.
- Google a e-mailový alternativní vstup fungují na produkční doméně; změna poskytovatele nevytvoří nechtěnou kopii účtu.
- Rodina A nemůže číst rodinu B ani přes přímé SQL/REST/RPC. Dítě nemůže spravovat členství, povýšit si roli ani číst výsledky sourozence. Zrušení přístupu platí na serveru i při ponechané relaci v zařízení.
- Pozvánka je jednorázová a vyprší; její přijetí je potvrzené, neoprávněné propojení je odmítnuto.
- Offline návrat a dva souběžní klienti neztrácejí odpovědi, nepřepisují novější stav a nezdvojují XP.
- Migrace a import zachovají původní součty i slovník. Spustit všechny kontroly předepsané v AGENTS.md, izolované databázové testy a následné ověření skutečného projektu.

## Doména a zdroje

Pro počáteční zveřejnění použít adresu projektu `math-czech-game.lovable.app`. Vlastní doménu nebo subdoménu lze připojit k témuž Lovable projektu; aplikace se kvůli tomu nepřepisuje. Pokud uživatel ovládá `tic-tac.fun`, možností je `procvicka.tic-tac.fun`. Kandidáti pro českou značku: `procvicka.cz`, `mojeprocvicka.cz`; dostupnost a vlastnictví nebyly ověřeny a nic nebylo objednáno. Připojení nové vlastní domény v Lovable vyžaduje podle aktuální dokumentace placený plán. Po připojení upravit návratové URL autentizace a ověřit HTTPS i přihlášení.

- [Vlastní doména Lovable](https://docs.lovable.dev/features/custom-domain)
- [Supabase Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase e-mailové kódy](https://supabase.com/docs/guides/auth/auth-email-passwordless)
- [Google: přístup třetích stran k dětským účtům](https://support.google.com/families/answer/9204736)
