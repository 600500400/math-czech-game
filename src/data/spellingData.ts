
export type WordType = "vyjmenované" | "příbuzné" | "odvozené";

export type SpellingWord = {
  word: string;
  type: WordType;
  positions?: number[]; // Pozice, kde se má doplnit i/y (pro složitější případy)
};

export type SpellingGroup = {
  name: string;
  words: SpellingWord[];
  phrases?: string[]; // Slovní spojení a věty
};

export const spellingGroups: SpellingGroup[] = [
  {
    name: "B",
    words: [
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
      // Příbuzná a odvozená slova
      { word: "neobyčejný", type: "příbuzné" },
      { word: "bytost", type: "příbuzné" },
      { word: "bylinný", type: "příbuzné" },
      { word: "zabydlet", type: "příbuzné" },
      { word: "býčí", type: "příbuzné" },
      { word: "bidlo", type: "odvozené" },
      { word: "nabídka", type: "odvozené" },
      { word: "bit", type: "odvozené" }
    ],
    phrases: [
      "Býk se pase na býlí",
      "V bytě je nový nábytek",
      "Obyvatelé bydlí v malých bytech",
      "Kobyla běhá po louce"
    ]
  },
  {
    name: "L",
    words: [
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
      { word: "vzlykat", type: "vyjmenované" },
      // Příbuzná a odvozená slova
      { word: "blýskavý", type: "příbuzné" },
      { word: "zalykat", type: "příbuzné" },
      { word: "lýkožrout", type: "příbuzné" },
      { word: "linka", type: "odvozené" },
      { word: "list", type: "odvozené" },
      { word: "lichý", type: "odvozené" }
    ],
    phrases: [
      "Na nebi se blýská",
      "Mlýn mele mouku",
      "Slyšel jsem v noci vzlykat"
    ]
  },
  {
    name: "M",
    words: [
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
      { word: "nachomýtnout se", type: "vyjmenované" },
      { word: "Litomyšl", type: "vyjmenované" }
    ]
  },
  {
    name: "P",
    words: [
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
      { word: "čepýřit se", type: "vyjmenované" }
    ]
  },
  {
    name: "S",
    words: [
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
      { word: "zásyp", type: "vyjmenované" }
    ]
  },
  {
    name: "V",
    words: [
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
      { word: "Vyšehrad", type: "vyjmenované" }
    ]
  },
  {
    name: "Z",
    words: [
      { word: "jazyk", type: "vyjmenované" },
      { word: "nazývat", type: "vyjmenované" },
      { word: "ozývat se", type: "vyjmenované" },
      { word: "vyzývat", type: "vyjmenované" },
      { word: "zbytek", type: "vyjmenované" },
      { word: "zvedat", type: "vyjmenované" },
      { word: "způsob", type: "vyjmenované" },
      { word: "zykat", type: "vyjmenované" },
      { word: "zisk", type: "vyjmenované" },
      { word: "hezký", type: "vyjmenované" },
      { word: "prazdroj", type: "vyjmenované" },
      { word: "zkouška", type: "vyjmenované" }
    ]
  }
];
