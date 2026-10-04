import type { SpellingTask } from './types';

type Row = [group: string, sentence: string, kind: 'listed' | 'related' | 'contrast', base?: string, explanation?: string];
// Every sentence targets one vowel, with its own rule. The original
// catalogue remains intact; automatic hiding of endings is intentionally unused.
const rows: Row[] = [
  ['B','Chci [být] doma.','listed','být','Být znamená existovat nebo někde být. Je vyjmenované po B, proto píšeme ý.'],
  ['B','Nesmíš nikoho [bít].','contrast',undefined,'Bít znamená tlouci. Nejde o vyjmenované být ve významu existovat. Píšeme í.'],
  ['B','Ve městě je velký [byt].','listed','byt'],
  ['B','Rodina chce [bydlit] v domě.','listed','bydlit'],
  ['B','Na louce roste [bylina].','listed','bylina'],
  ['B','Na pastvině stojí [býk].','listed','býk'],
  ['B','Dívka má [bílý] svetr.','contrast'],
  ['B','Po snídani zůstalo na stole [obilí].','contrast'],
  ['B','Dlouhá tyč u plotu je [bidlo].','contrast',undefined,'Bidlo je tyč. Ve slově bidlo píšeme i; vyjmenované bydlo označuje živobytí.'],
  ['B','Do bytu přivezli nový [nábytek].','listed','nábytek'],
  ['L','Můžu [slyšet] zpěv ptáků.','listed','slyšet'],
  ['L','Voda musí [plynout] dál.','listed','plynout'],
  ['L','Za bouřky se začalo [blýskat] na obloze.','related','blýskat se'],
  ['L','Bolí mě [lýtko].','listed','lýtko'],
  ['L','Při jídle musíme dobře [polykat].','listed','polykat'],
  ['L','Na podzim padá ze stromu [list].','contrast'],
  ['L','Na návsi roste [lípa].','contrast'],
  ['L','Marek je dnes [líný].','contrast'],
  ['L','Chci do sklenice [lít] vodu.','contrast'],
  ['L','Kolem domu je pevná [hlína].','contrast'],
  ['M','Před jídlem si musím [mýt] ruce.','listed','mýt','Mýt znamená umývat. Je vyjmenované po M, proto píšeme ý.'],
  ['M','Dnes budeme [mít] návštěvu.','contrast',undefined,'Mít návštěvu znamená, že k nám někdo přijde. Toto mít není vyjmenované mýt ve významu umývat. Píšeme í.'],
  ['M','V trávě se schovává [myš].','listed','myš'],
  ['M','Potřebuji [myslit] na úkol.','listed','myslit'],
  ['M','V lese létá drobný [hmyz].','listed','hmyz'],
  ['M','Je na mne velmi [milý].','contrast',undefined,'Ve slově milý doplňujeme jen i po M v kořeni. Milý není vyjmenované slovo ani příbuzné slovo po M. Koncovka ý je jiná část slova a není touto úlohou zakryta.'],
  ['M','Na stole je velká [mísa].','contrast'],
  ['M','Vlak [míjel] nádraží.','contrast'],
  ['M','Mezi dětmi je jejich [miminko].','contrast'],
  ['M','V lese je [myslivecká] chata.','related','myslit'],
  ['P','Pozor, na růži je žlutý [pyl].','listed','pyl','Pyl je prášek v květech. Je vyjmenované slovo po P, píšeme y.'],
  ['P','Petr včera [pil] vodu.','contrast',undefined,'Pil je tvar slovesa pít. Není to vyjmenované pyl, které označuje prášek v květech. Píšeme i.'],
  ['P','Ve sklepě leží prázdný [pytel].','listed','pytel'],
  ['P','Na hoře je [pyšný] král.','related','pýcha'],
  ['P','Na slunci se vyhřívá [slepýš].','listed','slepýš'],
  ['P','Potřebuji [písek] do formičky.','contrast'],
  ['P','Na stole leží [pilník].','contrast'],
  ['P','Zazpívej mi jednu [píseň].','contrast'],
  ['P','Pes má vlhký [pysk].','listed','pysk'],
  ['P','Na kůži se objevil červený [pupínek].','contrast'],
  ['S','Na větvi seděla [sýkora].','listed','sýkora'],
  ['S','Na chlebu je čerstvý [sýr].','listed','sýr'],
  ['S','Je to můj nejstarší [syn].','listed','syn'],
  ['S','Po obědě jsem [sytý].','listed','sytý'],
  ['S','Zelenina na talíři je [syrová].','listed','syrový'],
  ['S','Jarní slunce má velkou [sílu].','contrast'],
  ['S','Pavoučí [síť] visí mezi větvemi.','contrast'],
  ['S','Ráno budeme [sít] semena.','contrast'],
  ['S','Hráč právě [sípal] kvůli nachlazení.','contrast',undefined,'Sípat znamená chraplavě dýchat nebo mluvit. Není to vyjmenované sypat. Píšeme í.'],
  ['S','Na jaře mohou stromy [usychávat].','related','usychat'],
  ['V','V lese houkal [výr].','listed','výr','Výr je druh sovy a vyjmenované slovo po V. Píšeme ý.'],
  ['V','Na řece se vytvořil [vír].','contrast',undefined,'Vír je otáčející se proud vody. Nejde o vyjmenované výr, které označuje sovu. Píšeme í.'],
  ['V','U vody si hraje [vydra].','listed','vydra'],
  ['V','Hora je velmi [vysoká].','listed','vysoký'],
  ['V','Vlk začal [výt] na měsíc.','listed','výt','Výt znamená vydávat táhlý hlas. Je vyjmenované po V, proto píšeme ý.'],
  ['V','Děvče chce [vít] věneček.','contrast',undefined,'Vít znamená plést, například věneček. Nejde o vyjmenované výt, které označuje hlas vlka. Píšeme í.'],
  ['V','Na plotě rostou [vinné] keře.','contrast'],
  ['V','Z domu je dobrý [výhled].','related','vysoký', 'Slovo výhled začíná předponou vý-. V této předponě píšeme ý.'],
  ['V','Na jaře mohou děti [výskat] radostí.','listed','výskat','Výskat znamená radostně vykřikovat. Je vyjmenované po V, píšeme ý.'],
  ['V','Babička může [vískat] dítěti vlasy.','contrast',undefined,'Vískat znamená probírat prsty vlasy. Není to vyjmenované výskat ve významu radostně vykřikovat. Píšeme í.'],
  ['Z','Dítě má nový [jazykový] slovník.','related','jazyk'],
  ['Z','Z okna je vidět stará [Ruzyně].','listed','Ruzyně'],
  ['Z','Při dešti mi byla [zima].','contrast'],
  ['Z','Zítra musíme vstávat [brzy].','listed','brzy'],
  ['Z','Hned [zítra] přijede traktor.','contrast'],
  ['Z','Chlapec nahlas [zívá].','contrast'],
  ['Z','Lidé se začali [ozývat] z davu.','related','nazývat','Ozývat se je příbuzné ke slovu nazývat. Píšeme ý.'],
  ['Z','Dokážeme se navzájem [vyzývat] k závodu.','related','nazývat','Vyzývat je příbuzné ke slovu nazývat. V cílové části zý píšeme ý.'],
  ['Z','Od mládí jsem se učil [nazývat] věci správnými jmény.','listed','nazývat'],
  ['Z','Z lesa zaznělo [zívnutí].','contrast']
];

function make(row: Row, index: number): Omit<SpellingTask, 'id'> {
  const [group, sentence, kind, base, detail] = row;
  const word = sentence.match(/\[([^\]]+)\]/)?.[1];
  if (!word) throw new Error('Pravopisná položka musí označovat právě jedno slovo.');
  const gapIndex = [...word].findIndex((letter, i) => i > 0 && word[i - 1].toLocaleUpperCase('cs') === group && 'iíyý'.includes(letter.toLocaleLowerCase('cs')));
  if (gapIndex < 0) throw new Error(`Ve slově ${word} není cílová mezera po ${group}.`);
  const letter = word[gapIndex].toLocaleLowerCase('cs');
  const category = 'yý'.includes(letter) ? 'y' : 'i';
  const explanation = detail || (kind === 'contrast' ? `Slovo ${word} není vyjmenované ani příbuzné slovo po ${group}. V této části píšeme ${letter}.` : kind === 'related' ? `Slovo ${word} je příbuzné k vyjmenovanému slovu ${base}. V cílové části po ${group} píšeme ${letter}.` : `${base} je vyjmenované slovo po ${group}. V cílové části píšeme ${letter}.`);
  const contentId = `cz-v2-${index + 1}`;
  return { subject: 'spelling', contentId, key: contentId, skillId: `spelling:${group}`, sentence, word, gapIndex, group, ruleId: `${kind}:${base || word}:${group}`, prompt: sentence.replace(`[${word}]`, word.slice(0, gapIndex) + '_' + word.slice(gapIndex + 1)), expected: [category, category === 'y' ? 'ý' : 'í'], explanation, hint: `Přečti si celou větu. Co slovo znamená? Vzpomeň si na vyjmenovaná slova po ${group}.` };
}

export const spellingTasks = rows.map(make);
export const spellingGroupNames = ['B', 'L', 'M', 'P', 'S', 'V', 'Z'];
