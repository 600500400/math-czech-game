import { DictionaryWord } from "@/types/dictionaryTypes";

export interface StaticDictionaryWord {
  id: string;
  english_word: string;
  czech_translation: string;
  difficulty_level: 'basic' | 'intermediate' | 'advanced';
  category: string;
  example_en?: string;
  example_cz?: string;
}

/**
 * Pedagogicky ověřená slovní zásoba pro děti na ZŠ (A1–A2)
 * Rozděleno do srozumitelných tematických okruhů s přesným českým pravopisem.
 */
export const DEFAULT_DICTIONARY_WORDS: StaticDictionaryWord[] = [
  // 🐾 Zvířata (Animals) - Basic
  { id: "w-cat", english_word: "cat", czech_translation: "kočka", difficulty_level: "basic", category: "Zvířata", example_en: "The cat is sleeping.", example_cz: "Kočka spí." },
  { id: "w-dog", english_word: "dog", czech_translation: "pes", difficulty_level: "basic", category: "Zvířata", example_en: "The dog runs fast.", example_cz: "Pes běží rychle." },
  { id: "w-bird", english_word: "bird", czech_translation: "pták", difficulty_level: "basic", category: "Zvířata", example_en: "The bird sings in the tree.", example_cz: "Pták zpívá na stromě." },
  { id: "w-fish", english_word: "fish", czech_translation: "ryba", difficulty_level: "basic", category: "Zvířata", example_en: "Fish swim in water.", example_cz: "Ryby plavou ve vodě." },
  { id: "w-horse", english_word: "horse", czech_translation: "kůň", difficulty_level: "basic", category: "Zvířata", example_en: "I like riding a horse.", example_cz: "Rád jezdím na koni." },
  { id: "w-rabbit", english_word: "rabbit", czech_translation: "králík", difficulty_level: "basic", category: "Zvířata", example_en: "The white rabbit hops.", example_cz: "Bílý králík skáče." },
  { id: "w-bear", english_word: "bear", czech_translation: "medvěd", difficulty_level: "basic", category: "Zvířata", example_en: "The brown bear lives in the forest.", example_cz: "Hnědý medvěd žije v lese." },
  { id: "w-lion", english_word: "lion", czech_translation: "lev", difficulty_level: "basic", category: "Zvířata", example_en: "The lion is the king of animals.", example_cz: "Lev je král zvířat." },
  { id: "w-monkey", english_word: "monkey", czech_translation: "opice", difficulty_level: "basic", category: "Zvířata", example_en: "The monkey eats a banana.", example_cz: "Opice jí banán." },
  { id: "w-mouse", english_word: "mouse", czech_translation: "myš", difficulty_level: "basic", category: "Zvířata", example_en: "The little mouse likes cheese.", example_cz: "Malá myš má ráda sýr." },
  { id: "w-duck", english_word: "duck", czech_translation: "kachna", difficulty_level: "basic", category: "Zvířata", example_en: "The duck swims on the lake.", example_cz: "Kachna plave na jezeře." },
  { id: "w-pig", english_word: "pig", czech_translation: "prase", difficulty_level: "basic", category: "Zvířata", example_en: "The pink pig is cute.", example_cz: "Růžové prasátko je roztomilé." },
  { id: "w-cow", english_word: "cow", czech_translation: "kráva", difficulty_level: "basic", category: "Zvířata", example_en: "The cow gives fresh milk.", example_cz: "Kráva dává čerstvé mléko." },
  { id: "w-sheep", english_word: "sheep", czech_translation: "ovce", difficulty_level: "basic", category: "Zvířata", example_en: "The sheep has warm wool.", example_cz: "Ovce má teplou vlnu." },

  // 🍎 Jídlo a pití (Food & Drink) - Basic
  { id: "w-apple", english_word: "apple", czech_translation: "jablko", difficulty_level: "basic", category: "Jídlo", example_en: "An apple a day is healthy.", example_cz: "Jablko denně je zdravé." },
  { id: "w-bread", english_word: "bread", czech_translation: "chléb", difficulty_level: "basic", category: "Jídlo", example_en: "We eat fresh bread.", example_cz: "Jíme čerstvý chléb." },
  { id: "w-water", english_word: "water", czech_translation: "voda", difficulty_level: "basic", category: "Jídlo", example_en: "Drink plenty of water.", example_cz: "Pij hodně vody." },
  { id: "w-milk", english_word: "milk", czech_translation: "mléko", difficulty_level: "basic", category: "Jídlo", example_en: "Cats love milk.", example_cz: "Kočky milují mléko." },
  { id: "w-cheese", english_word: "cheese", czech_translation: "sýr", difficulty_level: "basic", category: "Jídlo", example_en: "Yellow cheese on bread.", example_cz: "Žlutý sýr na chlebu." },
  { id: "w-banana", english_word: "banana", czech_translation: "banán", difficulty_level: "basic", category: "Jídlo", example_en: "Sweet yellow banana.", example_cz: "Sladký žlutý banán." },
  { id: "w-orange", english_word: "orange", czech_translation: "pomeranč", difficulty_level: "basic", category: "Jídlo", example_en: "Juicy orange fruit.", example_cz: "Šťavnatý pomeranč." },
  { id: "w-tea", english_word: "tea", czech_translation: "čaj", difficulty_level: "basic", category: "Jídlo", example_en: "Hot cup of tea.", example_cz: "Horký šálek čaje." },
  { id: "w-soup", english_word: "soup", czech_translation: "polévka", difficulty_level: "basic", category: "Jídlo", example_en: "Warm soup for lunch.", example_cz: "Teplá polévka k obědu." },
  { id: "w-cake", english_word: "cake", czech_translation: "dort", difficulty_level: "basic", category: "Jídlo", example_en: "Birthday cake with candles.", example_cz: "Narozeninový dort se svíčkami." },
  { id: "w-egg", english_word: "egg", czech_translation: "vejce", difficulty_level: "basic", category: "Jídlo", example_en: "Boiled egg for breakfast.", example_cz: "Vařené vejce ke snídani." },
  { id: "w-butter", english_word: "butter", czech_translation: "máslo", difficulty_level: "basic", category: "Jídlo", example_en: "Bread with butter.", example_cz: "Chléb s máslem." },

  // 🏫 Škola a učení (School) - Basic & Intermediate
  { id: "w-school", english_word: "school", czech_translation: "škola", difficulty_level: "basic", category: "Škola", example_en: "We walk to school together.", example_cz: "Jdeme do školy společně." },
  { id: "w-book", english_word: "book", czech_translation: "kniha", difficulty_level: "basic", category: "Škola", example_en: "I love reading this book.", example_cz: "Rád čtu tuto knihu." },
  { id: "w-pen", english_word: "pen", czech_translation: "pero", difficulty_level: "basic", category: "Škola", example_en: "Write with a blue pen.", example_cz: "Piš modrým perem." },
  { id: "w-pencil", english_word: "pencil", czech_translation: "tužka", difficulty_level: "basic", category: "Škola", example_en: "Draw with a sharp pencil.", example_cz: "Kresli ořezanou tužkou." },
  { id: "w-desk", english_word: "desk", czech_translation: "školní lavice", difficulty_level: "basic", category: "Škola", example_en: "Sit nicely at your desk.", example_cz: "Seď hezky v lavici." },
  { id: "w-teacher", english_word: "teacher", czech_translation: "učitel", difficulty_level: "intermediate", category: "Škola", example_en: "Our teacher is very kind.", example_cz: "Náš pan učitel je velmi milý." },
  { id: "w-student", english_word: "student", czech_translation: "žák", difficulty_level: "basic", category: "Škola", example_en: "A clever student.", example_cz: "Chytrý žák." },
  { id: "w-bag", english_word: "bag", czech_translation: "taška", difficulty_level: "basic", category: "Škola", example_en: "School bag is full of books.", example_cz: "Školní taška je plná knih." },
  { id: "w-ruler", english_word: "ruler", czech_translation: "pravítko", difficulty_level: "intermediate", category: "Škola", example_en: "Measure the line with a ruler.", example_cz: "Změř čáru pravítkem." },
  { id: "w-paper", english_word: "paper", czech_translation: "papír", difficulty_level: "basic", category: "Škola", example_en: "Draw on clean white paper.", example_cz: "Kresli na čistý bílý papír." },
  { id: "w-homework", english_word: "homework", czech_translation: "domácí úkol", difficulty_level: "intermediate", category: "Škola", example_en: "Finish your homework early.", example_cz: "Dokonči úkol včas." },
  { id: "w-classroom", english_word: "classroom", czech_translation: "třída", difficulty_level: "intermediate", category: "Škola", example_en: "Our classroom is bright.", example_cz: "Naše třída je světlá." },

  // 👨‍👩‍👧‍👦 Rodina a lidé (Family & People) - Basic
  { id: "w-family", english_word: "family", czech_translation: "rodina", difficulty_level: "basic", category: "Rodina", example_en: "I love my family.", example_cz: "Mám rád svou rodinu." },
  { id: "w-mother", english_word: "mother", czech_translation: "maminka", difficulty_level: "basic", category: "Rodina", example_en: "My mother smiles at me.", example_cz: "Maminka se na mě usmívá." },
  { id: "w-father", english_word: "father", czech_translation: "tatínek", difficulty_level: "basic", category: "Rodina", example_en: "Father helps me with math.", example_cz: "Tatínek mi pomáhá s matematikou." },
  { id: "w-brother", english_word: "brother", czech_translation: "bratr", difficulty_level: "basic", category: "Rodina", example_en: "My older brother plays football.", example_cz: "Můj starší bratr hraje fotbal." },
  { id: "w-sister", english_word: "sister", czech_translation: "sestra", difficulty_level: "basic", category: "Rodina", example_en: "My sister has long hair.", example_cz: "Moje sestra má dlouhé vlasy." },
  { id: "w-friend", english_word: "friend", czech_translation: "kamarád", difficulty_level: "basic", category: "Rodina", example_en: "Best friend forever.", example_cz: "Nejlepší kamarád navždy." },
  { id: "w-baby", english_word: "baby", czech_translation: "miminko", difficulty_level: "basic", category: "Rodina", example_en: "The baby is laughing.", example_cz: "Miminko se směje." },
  { id: "w-grandma", english_word: "grandmother", czech_translation: "babička", difficulty_level: "intermediate", category: "Rodina", example_en: "Grandmother bakes cookies.", example_cz: "Babička peče sušenky." },
  { id: "w-grandpa", english_word: "grandfather", czech_translation: "dědeček", difficulty_level: "intermediate", category: "Rodina", example_en: "Grandfather tells great stories.", example_cz: "Dědeček vypráví skvělé příběhy." },

  // 🎨 Barvy (Colors) - Basic
  { id: "w-red", english_word: "red", czech_translation: "červený", difficulty_level: "basic", category: "Barvy", example_en: "A red apple.", example_cz: "Červené jablko." },
  { id: "w-blue", english_word: "blue", czech_translation: "modrý", difficulty_level: "basic", category: "Barvy", example_en: "The blue sky.", example_cz: "Modrá obloha." },
  { id: "w-green", english_word: "green", czech_translation: "zelený", difficulty_level: "basic", category: "Barvy", example_en: "Green grass in spring.", example_cz: "Zelená tráva na jaře." },
  { id: "w-yellow", english_word: "yellow", czech_translation: "žlutý", difficulty_level: "basic", category: "Barvy", example_en: "Bright yellow sun.", example_cz: "Zářivé žluté slunce." },
  { id: "w-black", english_word: "black", czech_translation: "černý", difficulty_level: "basic", category: "Barvy", example_en: "A black cat brings good luck.", example_cz: "Černá kočka nosí štěstí." },
  { id: "w-white", english_word: "white", czech_translation: "bílý", difficulty_level: "basic", category: "Barvy", example_en: "Pure white snow.", example_cz: "Čistý bílý sníh." },
  { id: "w-orange-col", english_word: "orange", czech_translation: "oranžový", difficulty_level: "basic", category: "Barvy", example_en: "An orange pumpkin.", example_cz: "Oranžová dýně." },
  { id: "w-pink", english_word: "pink", czech_translation: "růžový", difficulty_level: "basic", category: "Barvy", example_en: "A lovely pink flower.", example_cz: "Krásná růžová květina." },
  { id: "w-purple", english_word: "purple", czech_translation: "fialový", difficulty_level: "basic", category: "Barvy", example_en: "Sweet purple grapes.", example_cz: "Sladké fialové hrozny." },
  { id: "w-brown", english_word: "brown", czech_translation: "hnědý", difficulty_level: "basic", category: "Barvy", example_en: "A brown teddy bear.", example_cz: "Hnědý plyšový medvídek." },

  // 🏠 Dům a domov (House & Home) - Basic
  { id: "w-house", english_word: "house", czech_translation: "dům", difficulty_level: "basic", category: "Domov", example_en: "Our family house.", example_cz: "Náš rodinný dům." },
  { id: "w-home", english_word: "home", czech_translation: "domov", difficulty_level: "basic", category: "Domov", example_en: "Home sweet home.", example_cz: "Domov, sladký domov." },
  { id: "w-door", english_word: "door", czech_translation: "dveře", difficulty_level: "basic", category: "Domov", example_en: "Open the front door.", example_cz: "Otevři vchodové dveře." },
  { id: "w-window", english_word: "window", czech_translation: "okno", difficulty_level: "basic", category: "Domov", example_en: "Look through the window.", example_cz: "Podívej se z okna." },
  { id: "w-room", english_word: "room", czech_translation: "pokoj", difficulty_level: "basic", category: "Domov", example_en: "My room is tidy.", example_cz: "Můj pokoj je uklizený." },
  { id: "w-bed", english_word: "bed", czech_translation: "postel", difficulty_level: "basic", category: "Domov", example_en: "Go to bed early.", example_cz: "Jdi spát brzy." },
  { id: "w-table", english_word: "table", czech_translation: "stůl", difficulty_level: "basic", category: "Domov", example_en: "Dinner is on the table.", example_cz: "Večeře je na stole." },
  { id: "w-chair", english_word: "chair", czech_translation: "židle", difficulty_level: "basic", category: "Domov", example_en: "Sit down on the chair.", example_cz: "Posaď se na židli." },
  { id: "w-kitchen", english_word: "kitchen", czech_translation: "kuchyně", difficulty_level: "intermediate", category: "Domov", example_en: "Cooking in the kitchen.", example_cz: "Vaření v kuchyni." },
  { id: "w-garden", english_word: "garden", czech_translation: "zahrada", difficulty_level: "basic", category: "Domov", example_en: "Playing in the garden.", example_cz: "Hraní na zahradě." },

  // 🌲 Příroda a počasí (Nature & Weather) - Basic & Intermediate
  { id: "w-sun", english_word: "sun", czech_translation: "slunce", difficulty_level: "basic", category: "Příroda", example_en: "The sun warms our face.", example_cz: "Slunce hřeje do tváře." },
  { id: "w-moon", english_word: "moon", czech_translation: "měsíc", difficulty_level: "basic", category: "Příroda", example_en: "The moon shines at night.", example_cz: "Měsíc svítí v noci." },
  { id: "w-star", english_word: "star", czech_translation: "hvězda", difficulty_level: "basic", category: "Příroda", example_en: "A shining star in the sky.", example_cz: "Zářící hvězda na nebi." },
  { id: "w-tree", english_word: "tree", czech_translation: "strom", difficulty_level: "basic", category: "Příroda", example_en: "An old tall tree.", example_cz: "Starý vysoký strom." },
  { id: "w-flower", english_word: "flower", czech_translation: "květina", difficulty_level: "basic", category: "Příroda", example_en: "Smell the fresh flower.", example_cz: "Přivoň si ke květině." },
  { id: "w-rain", english_word: "rain", czech_translation: "déšť", difficulty_level: "basic", category: "Příroda", example_en: "Raindrops fall gently.", example_cz: "Kapky deště jemně padají." },
  { id: "w-snow", english_word: "snow", czech_translation: "sníh", difficulty_level: "basic", category: "Příroda", example_en: "We make a snowman in the snow.", example_cz: "Stavíme sněhuláka ve sněhu." },
  { id: "w-forest", english_word: "forest", czech_translation: "les", difficulty_level: "intermediate", category: "Příroda", example_en: "Walking through a quiet forest.", example_cz: "Procházka tichým lesem." },
  { id: "w-river", english_word: "river", czech_translation: "řeka", difficulty_level: "intermediate", category: "Příroda", example_en: "The river flows to the sea.", example_cz: "Řeka teče do moře." },
  { id: "w-sea", english_word: "sea", czech_translation: "moře", difficulty_level: "basic", category: "Příroda", example_en: "Swimming in the blue sea.", example_cz: "Plavání v modrém moři." },

  // 🏃‍♂️ Činnosti a slovesa (Actions & Verbs) - Basic
  { id: "w-play", english_word: "play", czech_translation: "hrát si", difficulty_level: "basic", category: "Slovesa", example_en: "Let's play a game together.", example_cz: "Pojďme si zahrát hru společně." },
  { id: "w-read", english_word: "read", czech_translation: "číst", difficulty_level: "basic", category: "Slovesa", example_en: "I read fairy tales.", example_cz: "Čtu pohádky." },
  { id: "w-write", english_word: "write", czech_translation: "psát", difficulty_level: "basic", category: "Slovesa", example_en: "Write letters carefully.", example_cz: "Piš písmena opatrně." },
  { id: "w-run", english_word: "run", czech_translation: "běhat", difficulty_level: "basic", category: "Slovesa", example_en: "Run across the playground.", example_cz: "Běž přes hřiště." },
  { id: "w-jump", english_word: "jump", czech_translation: "skákat", difficulty_level: "basic", category: "Slovesa", example_en: "Jump high up.", example_cz: "Vyskoč vysoko." },
  { id: "w-sing", english_word: "sing", czech_translation: "zpívat", difficulty_level: "basic", category: "Slovesa", example_en: "Birds sing in the morning.", example_cz: "Ptáčci zpívají ráno." },
  { id: "w-dance", english_word: "dance", czech_translation: "tancovat", difficulty_level: "basic", category: "Slovesa", example_en: "Dance to happy music.", example_cz: "Tancuj na veselou hudbu." },
  { id: "w-sleep", english_word: "sleep", czech_translation: "spát", difficulty_level: "basic", category: "Slovesa", example_en: "Sleep well tonight.", example_cz: "Dobře se dnes vyspi." },
  { id: "w-eat", english_word: "eat", czech_translation: "jíst", difficulty_level: "basic", category: "Slovesa", example_en: "Eat healthy food.", example_cz: "Jez zdravé jídlo." },
  { id: "w-drink", english_word: "drink", czech_translation: "pít", difficulty_level: "basic", category: "Slovesa", example_en: "Drink a glass of water.", example_cz: "Napij se sklenice vody." },
  { id: "w-help", english_word: "help", czech_translation: "pomáhat", difficulty_level: "basic", category: "Slovesa", example_en: "Always help your friends.", example_cz: "Vždy pomáhej svým kamarádům." },
  { id: "w-learn", english_word: "learn", czech_translation: "učit se", difficulty_level: "basic", category: "Slovesa", example_en: "Learning English is fun.", example_cz: "Učení angličtiny je zábava." },

  // ✨ Vlastnosti a přídavná jména (Adjectives) - Basic & Intermediate
  { id: "w-happy", english_word: "happy", czech_translation: "šťastný", difficulty_level: "basic", category: "Přídavná jména", example_en: "She has a happy smile.", example_cz: "Má šťastný úsměv." },
  { id: "w-clever", english_word: "clever", czech_translation: "chytrý", difficulty_level: "intermediate", category: "Přídavná jména", example_en: "A very clever pupil.", example_cz: "Velmi chytrý žák." },
  { id: "w-fast", english_word: "fast", czech_translation: "rychlý", difficulty_level: "basic", category: "Přídavná jména", example_en: "Cheetah is a fast animal.", example_cz: "Gepard je rychlé zvíře." },
  { id: "w-slow", english_word: "slow", czech_translation: "pomalý", difficulty_level: "basic", category: "Přídavná jména", example_en: "The turtle is slow.", example_cz: "Želva je pomalá." },
  { id: "w-big", english_word: "big", czech_translation: "velký", difficulty_level: "basic", category: "Přídavná jména", example_en: "An elephant is big.", example_cz: "Slon je velký." },
  { id: "w-small", english_word: "small", czech_translation: "malý", difficulty_level: "basic", category: "Přídavná jména", example_en: "A small mouse.", example_cz: "Malá myška." },
  { id: "w-good", english_word: "good", czech_translation: "dobrý", difficulty_level: "basic", category: "Přídavná jména", example_en: "Good job today!", example_cz: "Dobrá práce dnes!" },
  { id: "w-new", english_word: "new", czech_translation: "nový", difficulty_level: "basic", category: "Přídavná jména", example_en: "Brand new shoes.", example_cz: "Zbrusu nové boty." },
  { id: "w-beautiful", english_word: "beautiful", czech_translation: "krásný", difficulty_level: "intermediate", category: "Přídavná jména", example_en: "A beautiful butterfly.", example_cz: "Krásný motýl." },
  { id: "w-kind", english_word: "kind", czech_translation: "laskavý", difficulty_level: "intermediate", category: "Přídavná jména", example_en: "Be kind to everyone.", example_cz: "Buď ke všem laskavý." },

  // 🚗 Cestování a město (Travel & City) - Intermediate
  { id: "w-car", english_word: "car", czech_translation: "auto", difficulty_level: "basic", category: "Město", example_en: "We travel by car.", example_cz: "Cestujeme autem." },
  { id: "w-bus", english_word: "bus", czech_translation: "autobus", difficulty_level: "basic", category: "Město", example_en: "School bus arrives at eight.", example_cz: "Školní autobus přijíždí v osm." },
  { id: "w-train", english_word: "train", czech_translation: "vlak", difficulty_level: "basic", category: "Město", example_en: "The train runs on tracks.", example_cz: "Vlak jezdí po kolejích." },
  { id: "w-bicycle", english_word: "bicycle", czech_translation: "kolo", difficulty_level: "intermediate", category: "Město", example_en: "Riding a bicycle in the park.", example_cz: "Jízda na kole v parku." },
  { id: "w-plane", english_word: "airplane", czech_translation: "letadlo", difficulty_level: "intermediate", category: "Město", example_en: "The airplane flies above clouds.", example_cz: "Letadlo letí nad mraky." },
  { id: "w-station", english_word: "station", czech_translation: "nádraží", difficulty_level: "intermediate", category: "Město", example_en: "Waiting at the train station.", example_cz: "Čekání na vlakovém nádraží." },
  { id: "w-street", english_word: "street", czech_translation: "ulice", difficulty_level: "basic", category: "Město", example_en: "Cross the street safely.", example_cz: "Přejdi ulici bezpečně." }
];

export const getCategoryNames = (): string[] => {
  const categories = new Set(DEFAULT_DICTIONARY_WORDS.map(w => w.category));
  return Array.from(categories);
};
