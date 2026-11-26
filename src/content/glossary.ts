import type { L, Lang } from './types';

/**
 * Maths words a learner can tap for a simple definition ("Define a word").
 * `words` are the starts of the word as it appears in each language, so endings still match:
 * "equation" matches "equations", "சமன்பா" matches சமன்பாடு and சமன்பாட்டை.
 */
export interface GlossEntry {
  id: string;
  words: Record<Lang, string[]>;
  def: L;
}

export const GLOSSARY: GlossEntry[] = [
  {
    id: 'equation',
    words: { en: ['equation'], es: ['ecuaci'], ta: ['சமன்பா'] },
    def: {
      en: 'A maths sentence that says two sides are equal, using =. Example: 3x + 5 = 20.',
      es: 'Una frase matemática que dice que dos lados son iguales, usando =. Ejemplo: 3x + 5 = 20.',
      ta: 'இரண்டு பக்கமும் சமம் என்று = குறியோடு சொல்லும் கணக்கு. உதாரணம்: 3x + 5 = 20.',
    },
  },
  {
    id: 'solve',
    words: { en: ['solve'], es: ['resuelve', 'resolver'], ta: [] },
    def: {
      en: 'Find the number that x stands for, so that both sides of the equation are equal.',
      es: 'Encontrar el número que representa x, para que los dos lados de la ecuación sean iguales.',
      ta: 'சமன்பாட்டின் இரண்டு பக்கமும் சமமாக வர, x எந்த எண் என்று கண்டுபிடிப்பது.',
    },
  },
  {
    id: 'constant',
    words: { en: ['constant'], es: ['constante'], ta: ['தனி எண்'] },
    def: {
      en: 'A plain number with no letter next to it. In 3x + 5, the constant is 5.',
      es: 'Un número solo, sin letra al lado. En 3x + 5, la constante es 5.',
      ta: 'பக்கத்தில் எழுத்து இல்லாத எண். 3x + 5-இல் தனி எண் 5.',
    },
  },
  {
    id: 'term',
    words: { en: ['x-term', 'term'], es: ['término'], ta: [] },
    def: {
      en: 'One piece of an expression, between the + and − signs. In 3x + 5 the terms are 3x and 5.',
      es: 'Una parte de una expresión, entre los signos + y −. En 3x + 5 los términos son 3x y 5.',
      ta: '+, − குறிகளுக்கு இடையே உள்ள ஒரு பகுதி. 3x + 5-இல் 3x ஒன்று, 5 இன்னொன்று.',
    },
  },
  {
    id: 'brackets',
    words: { en: ['bracket'], es: ['paréntesis'], ta: ['அடைப்பு', 'அடைப்பை'] },
    def: {
      en: 'The ( ) signs. A number right in front means multiply everything inside: 3(x + 2) = 3x + 6.',
      es: 'Los signos ( ). Un número justo delante significa multiplicar todo lo de adentro: 3(x + 2) = 3x + 6.',
      ta: '( ) குறிகள். முன்னால் ஒரு எண் இருந்தால், உள்ளே உள்ள எல்லாவற்றையும் அதால் பெருக்க வேண்டும்: 3(x + 2) = 3x + 6.',
    },
  },
  {
    id: 'fraction',
    words: { en: ['fraction'], es: ['fracci'], ta: ['பின்னம'] },
    def: {
      en: 'A part of a whole, written with /. 5/2 means 5 divided by 2, which is 2.5.',
      es: 'Una parte de un entero, escrita con /. 5/2 significa 5 dividido entre 2, que es 2.5.',
      ta: '/ குறியோடு எழுதும் ஒரு பங்கு. 5/2 என்றால் 5-ஐ 2-ஆல் வகுத்தது, அதாவது 2.5.',
    },
  },
  {
    id: 'decimal',
    words: { en: ['decimal'], es: ['decimal'], ta: ['தசம'] },
    def: {
      en: 'A number with a point in it, like 2.5. The digits after the point are parts smaller than 1.',
      es: 'Un número con punto, como 2.5. Las cifras después del punto son partes menores que 1.',
      ta: 'புள்ளி உள்ள எண், 2.5 மாதிரி. புள்ளிக்குப் பின் உள்ளவை 1-ஐ விடச் சிறிய பகுதிகள்.',
    },
  },
  {
    id: 'whole-number',
    words: { en: ['whole number', 'integer'], es: ['entero'], ta: ['முழு எண்'] },
    def: {
      en: 'A number with no fraction or decimal part, like −2, 0, 7 or 15.',
      es: 'Un número sin fracción ni decimales, como −2, 0, 7 o 15.',
      ta: 'பின்னமோ தசமமோ இல்லாத எண்: −2, 0, 7, 15 மாதிரி.',
    },
  },
  {
    id: 'consecutive',
    words: { en: ['consecutive'], es: ['consecutiv'], ta: ['தொடர்ச்சியான', 'அடுத்தடுத்த'] },
    def: {
      en: 'Coming one right after another, with no gaps. 7, 8, 9 are consecutive numbers.',
      es: 'Uno justo después del otro, sin saltos. 7, 8, 9 son números consecutivos.',
      ta: 'இடைவெளி இல்லாமல் ஒன்றன் பின் ஒன்றாக வருவது. 7, 8, 9 தொடர்ச்சியான எண்கள்.',
    },
  },
  {
    id: 'perimeter',
    words: { en: ['perimeter'], es: ['perímetro'], ta: ['சுற்றளவு'] },
    def: {
      en: 'The total distance all the way around the outside of a shape. For a rectangle: 2 × (length + width).',
      es: 'La distancia total alrededor de una figura. Para un rectángulo: 2 × (largo + ancho).',
      ta: 'ஒரு வடிவத்தைச் சுற்றி அளந்த மொத்த நீளம். செவ்வகத்துக்கு: 2 × (நீளம் + அகலம்).',
    },
  },
  {
    id: 'area',
    words: { en: ['area'], es: ['área'], ta: ['பரப்பு'] },
    def: {
      en: 'How much flat space a shape covers. For a rectangle: length × width.',
      es: 'Cuánto espacio plano cubre una figura. Para un rectángulo: largo × ancho.',
      ta: 'ஒரு வடிவம் மூடும் இடத்தின் அளவு. செவ்வகத்துக்கு: நீளம் × அகலம்.',
    },
  },
  {
    id: 'rectangle',
    words: { en: ['rectangle'], es: ['rectángulo'], ta: ['செவ்வக'] },
    def: {
      en: 'A shape with 4 straight sides and 4 square corners. Opposite sides are the same length.',
      es: 'Una figura con 4 lados rectos y 4 esquinas rectas. Los lados opuestos miden lo mismo.',
      ta: '4 நேர் பக்கங்களும் 4 செங்கோண மூலைகளும் உள்ள வடிவம். எதிர்ப் பக்கங்கள் சம நீளம்.',
    },
  },
  {
    id: 'midpoint',
    words: { en: ['midpoint'], es: ['punto medio'], ta: ['நடுப்புள்ளி'] },
    def: {
      en: 'The point exactly halfway between two points.',
      es: 'El punto que está justo a la mitad entre dos puntos.',
      ta: 'இரண்டு புள்ளிகளுக்குச் சரியாக நடுவில் உள்ள புள்ளி.',
    },
  },
  {
    id: 'distance',
    words: { en: ['distance'], es: ['distancia'], ta: ['தொலைவ', 'தொலைவு'] },
    def: {
      en: 'How far apart two things are.',
      es: 'Qué tan lejos están dos cosas.',
      ta: 'இரண்டு பொருட்களுக்கு இடையே எவ்வளவு தூரம் என்பது.',
    },
  },
  {
    id: 'origin',
    words: { en: ['origin'], es: ['origen'], ta: ['ஆதிப்புள்ளி'] },
    def: {
      en: 'The point (0, 0), where the x-axis and the y-axis cross.',
      es: 'El punto (0, 0), donde se cruzan el eje x y el eje y.',
      ta: '(0, 0) என்ற புள்ளி. x-அச்சும் y-அச்சும் சந்திக்கும் இடம்.',
    },
  },
  {
    id: 'point',
    words: { en: ['point'], es: ['punto'], ta: ['புள்ளி'] },
    def: {
      en: 'A place on a grid, written (x, y): x is how far across, y is how far up.',
      es: 'Un lugar en una cuadrícula, escrito (x, y): x es cuánto hacia el lado, y es cuánto hacia arriba.',
      ta: 'வரைபடத்தில் ஒரு இடம், (x, y) என்று எழுதுவது: x பக்கவாட்டில் எவ்வளவு, y மேலே எவ்வளவு.',
    },
  },
  {
    id: 'circle',
    words: { en: ['circle'], es: ['circunferencia', 'círculo'], ta: ['வட்ட'] },
    def: {
      en: 'A round shape. Every point on its edge is the same distance from the center.',
      es: 'Una figura redonda. Cada punto del borde está a la misma distancia del centro.',
      ta: 'உருண்டையான வடிவம். அதன் ஓரத்தில் உள்ள ஒவ்வொரு புள்ளியும் மையத்திலிருந்து ஒரே தொலைவில் இருக்கும்.',
    },
  },
  {
    id: 'center',
    words: { en: ['center', 'centre'], es: ['centro'], ta: ['மைய'] },
    def: {
      en: 'The point in the exact middle of a circle.',
      es: 'El punto justo en el medio de una circunferencia.',
      ta: 'வட்டத்தின் சரியான நடுவில் உள்ள புள்ளி.',
    },
  },
  {
    id: 'radius',
    words: { en: ['radius'], es: ['radio'], ta: ['ஆரம'] },
    def: {
      en: 'The distance from the center of a circle to its edge. It is written r.',
      es: 'La distancia del centro de una circunferencia a su borde. Se escribe r.',
      ta: 'வட்டத்தின் மையத்திலிருந்து ஓரம் வரை உள்ள தொலைவு. r என்று எழுதுவோம்.',
    },
  },
  {
    id: 'square-root',
    words: { en: ['square root'], es: ['raíz cuadrada', 'raíz'], ta: ['வர்க்கமூல'] },
    def: {
      en: '√ means: which number, times itself, gives this? √25 = 5, because 5 × 5 = 25.',
      es: '√ significa: ¿qué número, multiplicado por sí mismo, da esto? √25 = 5, porque 5 × 5 = 25.',
      ta: '√ என்றால்: எந்த எண்ணை அதாலேயே பெருக்கினால் இது வரும்? √25 = 5, ஏனென்றால் 5 × 5 = 25.',
    },
  },
  {
    id: 'square',
    words: { en: ['squared', 'square'], es: ['cuadrado'], ta: ['வர்க்க'] },
    def: {
      en: 'A number times itself, written with a small ². 5² ("5 squared") = 5 × 5 = 25.',
      es: 'Un número multiplicado por sí mismo, escrito con un ² pequeño. 5² ("5 al cuadrado") = 5 × 5 = 25.',
      ta: 'ஒரு எண்ணை அதாலேயே பெருக்குவது, சின்ன ² போட்டு எழுதுவோம். 5² = 5 × 5 = 25.',
    },
  },
  {
    id: 'pythagoras',
    words: { en: ['pythagoras'], es: ['pitágoras'], ta: ['பிதாகரஸ்'] },
    def: {
      en: 'In a right triangle: (short side)² + (other short side)² = (long side)². Example: 3² + 4² = 5².',
      es: 'En un triángulo rectángulo: (lado corto)² + (otro lado corto)² = (lado largo)². Ejemplo: 3² + 4² = 5².',
      ta: 'செங்கோண முக்கோணத்தில்: (சிறிய பக்கம்)² + (மற்ற சிறிய பக்கம்)² = (நீண்ட பக்கம்)². உதாரணம்: 3² + 4² = 5².',
    },
  },
  {
    id: 'right-triangle',
    words: { en: ['right triangle'], es: ['triángulo rectángulo'], ta: ['செங்கோண'] },
    def: {
      en: 'A triangle with one square corner (90°), like the corner of a page.',
      es: 'Un triángulo con una esquina recta (90°), como la esquina de una hoja.',
      ta: 'ஒரு மூலை செங்கோணமாக (90°) உள்ள முக்கோணம், காகிதத்தின் மூலை மாதிரி.',
    },
  },
  {
    id: 'triangle',
    words: { en: ['triangle'], es: ['triángulo'], ta: ['முக்கோண'] },
    def: {
      en: 'A shape with 3 straight sides. Its 3 angles always add up to 180°.',
      es: 'Una figura con 3 lados rectos. Sus 3 ángulos siempre suman 180°.',
      ta: '3 நேர் பக்கங்கள் உள்ள வடிவம். அதன் 3 கோணங்களைக் கூட்டினால் எப்போதும் 180°.',
    },
  },
  {
    id: 'angle',
    words: { en: ['angle'], es: ['ángulo'], ta: ['கோண'] },
    def: {
      en: 'How wide a corner is, measured in degrees (°). A square corner is 90°.',
      es: 'Qué tan abierta es una esquina, medida en grados (°). Una esquina recta mide 90°.',
      ta: 'ஒரு மூலை எவ்வளவு விரிந்திருக்கிறது என்பது, டிகிரியில் (°) அளப்போம். செங்கோணம் 90°.',
    },
  },
  {
    id: 'extras',
    words: { en: ['extras'], es: ['extras'], ta: ['உதிரி'] },
    def: {
      en: 'In cricket, runs the batting team gets because of the bowlers’ mistakes, like wides and no-balls.',
      es: 'En críquet, carreras que recibe el equipo que batea por errores de los lanzadores, como wides y no-balls.',
      ta: 'கிரிக்கெட்டில், பந்து வீச்சாளரின் தவறுகளால் (wide, no-ball) பேட்டிங் அணிக்குக் கிடைக்கும் ரன்கள்.',
    },
  },
  {
    id: 'gb',
    words: { en: ['GB'], es: ['GB'], ta: ['GB'] },
    def: {
      en: 'Gigabyte: an amount of phone internet data. Watching videos uses a lot of GB.',
      es: 'Gigabyte: una cantidad de datos de internet del teléfono. Ver videos gasta muchos GB.',
      ta: 'ஜிகாபைட்: போனில் இணையம் பயன்படுத்தும் அளவு. வீடியோ பார்த்தால் நிறைய GB செலவாகும்.',
    },
  },
];

const LETTER = '[\\p{L}\\p{M}]';
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** One pattern per language. Longer words are tried first, so "square root" wins over "square". */
const patterns = new Map<Lang, { re: RegExp; stems: { stem: string; entry: GlossEntry }[] }>();

function patternFor(lang: Lang) {
  let p = patterns.get(lang);
  if (!p) {
    const stems = GLOSSARY.flatMap((entry) => entry.words[lang].map((stem) => ({ stem, entry }))).sort((a, b) => b.stem.length - a.stem.length);
    const re = new RegExp(`(?<!${LETTER})(?:${stems.map((s) => escape(s.stem)).join('|')})${LETTER}*`, 'giu');
    p = { re, stems };
    patterns.set(lang, p);
  }
  return p;
}

export type GlossPiece = string | { word: string; entry: GlossEntry };

/** Splits text into plain parts and maths words that have a definition. */
export function glossPieces(text: string, lang: Lang): GlossPiece[] {
  const { re, stems } = patternFor(lang);
  const out: GlossPiece[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const word = m[0];
    const lower = word.toLowerCase();
    const hit = stems.find((s) => lower.startsWith(s.stem.toLowerCase()));
    if (!hit) continue;
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ word, entry: hit.entry });
    last = m.index! + word.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
