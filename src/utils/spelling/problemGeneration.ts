
import { SpellingGroup } from "@/types/spellingTypes";

// Funkce pro generování problému
export function generateSpellingProblem(selectedGroups: string[], spellingGroups: SpellingGroup[]) {
  console.log("⚙️ generateSpellingProblem: Generování problému pro skupiny:", selectedGroups);
  
  // Filtrujeme skupiny podle výběru
  const availableGroups = spellingGroups.filter(group => 
    selectedGroups.includes(group.name)
  );
  
  if (availableGroups.length === 0) {
    console.log("⚙️ generateSpellingProblem: Žádné dostupné skupiny");
    return null;
  }
  
  // Náhodně vybereme skupinu
  const randomGroup = availableGroups[Math.floor(Math.random() * availableGroups.length)];
  console.log("⚙️ generateSpellingProblem: Vybraná skupina:", randomGroup.name);
  
  // Náhodně rozhodneme, zda použijeme frázi nebo slovo
  const usePhrase = randomGroup.phrases && randomGroup.phrases.length > 0 && Math.random() > 0.7;
  
  if (usePhrase && randomGroup.phrases) {
    console.log("⚙️ generateSpellingProblem: Pokus o použití fráze");
    // Vybereme náhodnou frázi
    const randomPhrase = randomGroup.phrases[Math.floor(Math.random() * randomGroup.phrases.length)];
    console.log("⚙️ generateSpellingProblem: Vybraná fráze:", randomPhrase);
    
    // Najdeme všechny pozice i/y/í/ý v textu
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < randomPhrase.length; i++) {
      const char = randomPhrase[i].toLowerCase();
      if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
        positions.push(i);
        letters.push(char);
      }
    }
    
    console.log("⚙️ generateSpellingProblem: Pozice i/y ve frázi:", positions, "Písmena:", letters);
    
    // Pokud jsou nějaké i/y ve frázi
    if (positions.length > 0) {
      // Vytvoříme text s podtržítky místo i/y
      let displayedPhrase = '';
      for (let i = 0; i < randomPhrase.length; i++) {
        if (positions.includes(i)) {
          displayedPhrase += '_';
        } else {
          displayedPhrase += randomPhrase[i];
        }
      }
      
      console.log("⚙️ generateSpellingProblem: Zobrazená fráze:", displayedPhrase);
      
      return {
        word: randomPhrase,
        displayed: displayedPhrase,
        group: randomGroup.name,
        positions,
        letters,
        isPhrase: true
      };
    }
  }
  
  // Pokud nepoužijeme frázi nebo žádná není k dispozici, použijeme slovo
  const words = randomGroup.words;
  if (words.length === 0) {
    console.log("⚙️ generateSpellingProblem: Žádná slova ve skupině");
    return null;
  }
  
  // Opakujeme výběr slova, dokud nenajdeme takové, které obsahuje i/y
  let attempts = 0;
  const maxAttempts = 50; // Zabránění nekonečné smyčky
  
  while (attempts < maxAttempts) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    console.log(`⚙️ generateSpellingProblem: Pokus ${attempts + 1}: zkouším slovo "${randomWord.word}"`);
    
    // Najdeme všechny pozice i/y/í/ý ve slově
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < randomWord.word.length; i++) {
      const char = randomWord.word[i].toLowerCase();
      if (char === 'i' || char === 'y' || char === 'í' || char === 'ý') {
        positions.push(i);
        letters.push(char);
      }
    }
    
    console.log("⚙️ generateSpellingProblem: Pozice i/y ve slově:", positions, "Písmena:", letters);
    
    // Pokud slovo obsahuje i/y, použijeme ho
    if (positions.length > 0) {
      // Vytvoříme slovo s podtržítky místo i/y
      let displayedWord = '';
      for (let i = 0; i < randomWord.word.length; i++) {
        if (positions.includes(i)) {
          displayedWord += '_';
        } else {
          displayedWord += randomWord.word[i];
        }
      }
      
      console.log("⚙️ generateSpellingProblem: Originální slovo:", randomWord.word);
      console.log("⚙️ generateSpellingProblem: Zobrazené slovo:", displayedWord);
      
      return {
        word: randomWord.word,
        displayed: displayedWord,
        group: randomGroup.name,
        type: randomWord.type,
        positions,
        letters,
        isPhrase: false
      };
    }
    
    attempts++;
  }
  
  // Pokud nenajdeme žádné vhodné slovo, vrátíme null
  console.warn(`⚙️ generateSpellingProblem: Nenalezeno žádné slovo s i/y ve skupině ${randomGroup.name} po ${maxAttempts} pokusech`);
  return null;
}
