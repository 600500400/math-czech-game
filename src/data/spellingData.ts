
import { SpellingWord, SpellingGroup } from "@/types/spellingTypes";

// Pravidlo: Každá skupina musí obsahovat KONTRASTNÍ slova s měkkým I
// (slova která NEJSOU vyjmenovaná) pro vyvážený výběr ~50/50.
// Tím se z aplikace stává nástroj na rozlišování i/y, ne jen mechanické tipování Y.
export const spellingGroups: SpellingGroup[] = [
  {
    name: "B",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "být", type: "vyjmenované" },
      { word: "bydlit", type: "vyjmenované" },
      { word: "obyvatel", type: "vyjmenované" },
      { word: "byt", type: "vyjmenované" },
      { word: "příbytek", type: "vyjmenované" },
      { word: "nábytek", type: "vyjmenované" },
      { word: "dobytek", type: "vyjmenované" },
      { word: "obyčej", type: "vyjmenované" },
      { word: "bystrý", type: "vyjmenované" },
      { word: "bylina", type: "vyjmenované" },
      { word: "kobyla", type: "vyjmenované" },
      { word: "býk", type: "vyjmenované" },
      { word: "Přibyslav", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "neobyčejný", type: "příbuzné" },
      { word: "bytost", type: "příbuzné" },
      { word: "bylinný", type: "příbuzné" },
      { word: "zabydlet", type: "příbuzné" },
      { word: "býčí", type: "příbuzné" },
      { word: "obydlí", type: "příbuzné" },
      { word: "obyvatelstvo", type: "příbuzné" },
      { word: "obyčejně", type: "příbuzné" },
      { word: "bystrost", type: "příbuzné" },
      { word: "kobylka", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "bít", type: "kontrastní" },
      { word: "bicí", type: "kontrastní" },
      { word: "nabít", type: "kontrastní" },
      { word: "pobít", type: "kontrastní" },
      { word: "obilí", type: "kontrastní" },
      { word: "obilný", type: "kontrastní" },
      { word: "kobliha", type: "kontrastní" },
      { word: "bizon", type: "kontrastní" },
      { word: "biskup", type: "kontrastní" },
      { word: "bidlo", type: "kontrastní" },
      { word: "nabídka", type: "kontrastní" }
    ],
    phrases: [
      "Býk se pase na býlí",
      "V bytě je nový nábytek",
      "Obyvatelé bydlí v malých bytech",
      "Kobyla běhá po louce",
      "Bicí nástroje bijí do rytmu",
      "Na poli roste obilí"
    ]
  },
  {
    name: "L",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "slyšet", type: "vyjmenované" },
      { word: "mlýn", type: "vyjmenované" },
      { word: "blýskat se", type: "vyjmenované" },
      { word: "polykat", type: "vyjmenované" },
      { word: "plynout", type: "vyjmenované" },
      { word: "plýtvat", type: "vyjmenované" },
      { word: "vzlykat", type: "vyjmenované" },
      { word: "lysý", type: "vyjmenované" },
      { word: "lýtko", type: "vyjmenované" },
      { word: "lýko", type: "vyjmenované" },
      { word: "pelyněk", type: "vyjmenované" },
      { word: "plyš", type: "vyjmenované" },
      { word: "plynový", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "blýskavý", type: "příbuzné" },
      { word: "lýkožrout", type: "příbuzné" },
      { word: "slýchat", type: "příbuzné" },
      { word: "vyslyšet", type: "příbuzné" },
      { word: "mlynář", type: "příbuzné" },
      { word: "plynulý", type: "příbuzné" },
      { word: "plýtvání", type: "příbuzné" },
      { word: "vzlykot", type: "příbuzné" },
      { word: "lysina", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "lišit se", type: "kontrastní" },
      { word: "liška", type: "kontrastní" },
      { word: "lichý", type: "kontrastní" },
      { word: "lípa", type: "kontrastní" },
      { word: "linka", type: "kontrastní" },
      { word: "list", type: "kontrastní" },
      { word: "liják", type: "kontrastní" },
      { word: "litovat", type: "kontrastní" },
      { word: "líbit se", type: "kontrastní" },
      { word: "lichotit", type: "kontrastní" }
    ],
    phrases: [
      "Na nebi se blýská",
      "Mlýn mele mouku",
      "Slyšel jsem v noci vzlykat",
      "Liška chytá myš",
      "Padá list ze stromu"
    ]
  },
  {
    name: "M",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "my", type: "vyjmenované" },
      { word: "mýt", type: "vyjmenované" },
      { word: "myslit", type: "vyjmenované" },
      { word: "mýlit se", type: "vyjmenované" },
      { word: "hmyz", type: "vyjmenované" },
      { word: "myš", type: "vyjmenované" },
      { word: "hlemýžď", type: "vyjmenované" },
      { word: "mýtit", type: "vyjmenované" },
      { word: "zamykat", type: "vyjmenované" },
      { word: "smýkat", type: "vyjmenované" },
      { word: "dmýchat", type: "vyjmenované" },
      { word: "chmýří", type: "vyjmenované" },
      { word: "Litomyšl", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "umývat", type: "příbuzné" },
      { word: "promýšlet", type: "příbuzné" },
      { word: "omyl", type: "příbuzné" },
      { word: "hmyzí", type: "příbuzné" },
      { word: "myška", type: "příbuzné" },
      { word: "zamykání", type: "příbuzné" },
      { word: "promyšlený", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "mít", type: "kontrastní" },
      { word: "míč", type: "kontrastní" },
      { word: "milý", type: "kontrastní" },
      { word: "miska", type: "kontrastní" },
      { word: "minulost", type: "kontrastní" },
      { word: "mince", type: "kontrastní" },
      { word: "minout", type: "kontrastní" },
      { word: "milovat", type: "kontrastní" },
      { word: "mistr", type: "kontrastní" },
      { word: "místo", type: "kontrastní" }
    ],
    phrases: [
      "Myš utíká před hlemýžděm",
      "Musím si umýt ruce",
      "Mám rád svoje místo",
      "Mistr hraje s míčem"
    ]
  },
  {
    name: "P",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "pýcha", type: "vyjmenované" },
      { word: "pytel", type: "vyjmenované" },
      { word: "pysk", type: "vyjmenované" },
      { word: "netopýr", type: "vyjmenované" },
      { word: "slepýš", type: "vyjmenované" },
      { word: "pyl", type: "vyjmenované" },
      { word: "kopyto", type: "vyjmenované" },
      { word: "klopýtat", type: "vyjmenované" },
      { word: "třpytit se", type: "vyjmenované" },
      { word: "zpytovat", type: "vyjmenované" },
      { word: "pykat", type: "vyjmenované" },
      { word: "pýr", type: "vyjmenované" },
      { word: "pýřit se", type: "vyjmenované" },
      { word: "čepýřit se", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "pyšný", type: "příbuzné" },
      { word: "pytlovina", type: "příbuzné" },
      { word: "netopýří", type: "příbuzné" },
      { word: "pylový", type: "příbuzné" },
      { word: "klopýtnout", type: "příbuzné" },
      { word: "třpytivý", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "pít", type: "kontrastní" },
      { word: "pivo", type: "kontrastní" },
      { word: "písmeno", type: "kontrastní" },
      { word: "pilný", type: "kontrastní" },
      { word: "pilíř", type: "kontrastní" },
      { word: "pisatel", type: "kontrastní" },
      { word: "pila", type: "kontrastní" },
      { word: "pilot", type: "kontrastní" },
      { word: "pichlavý", type: "kontrastní" },
      { word: "písnička", type: "kontrastní" }
    ],
    phrases: [
      "Pyšný netopýr letí v noci",
      "Pilot pije vodu",
      "Pilný žák píše písmena"
    ]
  },
  {
    name: "S",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "syn", type: "vyjmenované" },
      { word: "sytý", type: "vyjmenované" },
      { word: "sýr", type: "vyjmenované" },
      { word: "syrový", type: "vyjmenované" },
      { word: "sychravý", type: "vyjmenované" },
      { word: "usychat", type: "vyjmenované" },
      { word: "sýkora", type: "vyjmenované" },
      { word: "sýček", type: "vyjmenované" },
      { word: "sysel", type: "vyjmenované" },
      { word: "syčet", type: "vyjmenované" },
      { word: "sypat", type: "vyjmenované" },
      { word: "vysypat", type: "vyjmenované" },
      { word: "násyp", type: "vyjmenované" },
      { word: "zásyp", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "synovec", type: "příbuzné" },
      { word: "nasytit", type: "příbuzné" },
      { word: "sýrárna", type: "příbuzné" },
      { word: "sychrák", type: "příbuzné" },
      { word: "sýkorka", type: "příbuzné" },
      { word: "sypání", type: "příbuzné" },
      { word: "posypat", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "sirka", type: "kontrastní" },
      { word: "silný", type: "kontrastní" },
      { word: "síla", type: "kontrastní" },
      { word: "sídlo", type: "kontrastní" },
      { word: "sice", type: "kontrastní" },
      { word: "sirota", type: "kontrastní" },
      { word: "síto", type: "kontrastní" },
      { word: "silnice", type: "kontrastní" },
      { word: "slibovat", type: "kontrastní" },
      { word: "siréna", type: "kontrastní" }
    ],
    phrases: [
      "Sýkorka sedí na stromě",
      "Syn jí sýr",
      "Silný vítr fouká po silnici"
    ]
  },
  {
    name: "V",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "vy", type: "vyjmenované" },
      { word: "vysoký", type: "vyjmenované" },
      { word: "výt", type: "vyjmenované" },
      { word: "výskat", type: "vyjmenované" },
      { word: "zvykat", type: "vyjmenované" },
      { word: "žvýkat", type: "vyjmenované" },
      { word: "vydra", type: "vyjmenované" },
      { word: "výr", type: "vyjmenované" },
      { word: "vyžle", type: "vyjmenované" },
      { word: "povyk", type: "vyjmenované" },
      { word: "výheň", type: "vyjmenované" },
      { word: "cavyky", type: "vyjmenované" },
      { word: "vyza", type: "vyjmenované" },
      { word: "Vyšehrad", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "výška", type: "příbuzné" },
      { word: "povýšit", type: "příbuzné" },
      { word: "vytí", type: "příbuzné" },
      { word: "navykat", type: "příbuzné" },
      { word: "žvýkání", type: "příbuzné" },
      { word: "vydří", type: "příbuzné" },
      { word: "zvýšit", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "vít", type: "kontrastní" },
      { word: "víla", type: "kontrastní" },
      { word: "vidět", type: "kontrastní" },
      { word: "víno", type: "kontrastní" },
      { word: "vichr", type: "kontrastní" },
      { word: "viset", type: "kontrastní" },
      { word: "vinař", type: "kontrastní" },
      { word: "vidlička", type: "kontrastní" },
      { word: "viník", type: "kontrastní" },
      { word: "vinout", type: "kontrastní" }
    ],
    phrases: [
      "Vysoký výr v lese vyje",
      "Víla vidí vinaře",
      "Vidlička visí na háčku"
    ]
  },
  {
    name: "Z",
    words: [
      // Vyjmenovaná slova (tvrdé Y)
      { word: "brzy", type: "vyjmenované" },
      { word: "jazyk", type: "vyjmenované" },
      { word: "nazývat", type: "vyjmenované" },
      { word: "Ruzyně", type: "vyjmenované" },
      // Příbuzná slova (tvrdé Y)
      { word: "jazykový", type: "příbuzné" },
      { word: "jazýček", type: "příbuzné" },
      { word: "nazývaný", type: "příbuzné" },
      { word: "vyzývat", type: "příbuzné" },
      { word: "vzývat", type: "příbuzné" },
      { word: "ozývat se", type: "příbuzné" },
      { word: "výzva", type: "příbuzné" },
      { word: "vyzývavý", type: "příbuzné" },
      // Kontrastní slova - MĚKKÉ I (nejsou vyjmenovaná)
      { word: "získat", type: "kontrastní" },
      { word: "zima", type: "kontrastní" },
      { word: "zimní", type: "kontrastní" },
      { word: "zívat", type: "kontrastní" },
      { word: "zítra", type: "kontrastní" },
      { word: "zinek", type: "kontrastní" },
      { word: "zip", type: "kontrastní" },
      { word: "zisk", type: "kontrastní" }
    ],
    phrases: [
      "Brzy ráno vstávám do školy",
      "Jazyk je důležitý pro řeč",
      "V zimě je venku zima",
      "Zítra ráno budu zívat"
    ]
  }
];
