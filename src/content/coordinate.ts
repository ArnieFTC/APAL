import { frac, show, type Rational } from '../lib/rational';
import { num } from '../lib/format';
import type { Rng } from '../lib/rng';
import type { L, Skill, Vars } from './types';

/** Coordinate geometry for Sevalaya 9th grade: midpoint, distance, and the equation of a circle. */

const COORD: L = { en: 'Coordinate geometry', es: 'Geometría analítica', ta: 'ஆயத்தொலை வடிவியல்' };

const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;
/** A number inside a sum, bracketed when negative: "(−3)". */
const p = (n: number) => (n < 0 ? `(${num(n)})` : `${n}`);
const n = (v: Vars, k: string) => Number(v[k]);
const R = (x: number, d = 1) => frac(x, d);

/** "(x − 3)²", "(y + 2)²", or "x²" when the center coordinate is 0. */
function square(letter: string, c: Rational): string {
  if (c.n === 0) return `${letter}²`;
  return `(${letter} ${c.n > 0 ? '−' : '+'} ${show(frac(Math.abs(c.n), c.d))})²`;
}
const circleEq = (h: Rational, k: Rational, r2: Rational) => `${square('x', h)} + ${square('y', k)} = ${show(r2)}`;

// Right triangles with whole-number sides, so distances come out whole.
const TRIPLES = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
];
function legs(r: Rng): [number, number, number] {
  const [a, b, c] = r.pick(TRIPLES);
  const swap = r.int(0, 1) === 1;
  return [(swap ? b : a) * r.sign(), (swap ? a : b) * r.sign(), c];
}

export const coordinateSkills: Skill[] = [
  {
    id: 'midpoint',
    unit: COORD,
    title: { en: 'Midpoint of two points', es: 'Punto medio de dos puntos', ta: 'இரு புள்ளிகளின் நடுப்புள்ளி' },
    summary: {
      en: 'The point exactly halfway between A and B.',
      es: 'El punto que está justo a la mitad entre A y B.',
      ta: 'A-க்கும் B-க்கும் சரியாக நடுவில் உள்ள புள்ளி.',
    },
    prereqs: [],
    lesson: {
      body: {
        en: 'The midpoint is exactly halfway between two points. Add the two x-values and divide by 2. Then add the two y-values and divide by 2. Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2).',
        es: 'El punto medio está justo a la mitad entre dos puntos. Suma los dos valores de x y divide entre 2. Luego suma los dos valores de y y divide entre 2. Punto medio = ((x₁ + x₂)/2, (y₁ + y₂)/2).',
        ta: 'நடுப்புள்ளி இரண்டு புள்ளிகளுக்கும் சரியாக நடுவில் இருக்கும். இரண்டு x-களையும் கூட்டி 2-ஆல் வகுங்கள். பிறகு இரண்டு y-களையும் கூட்டி 2-ஆல் வகுங்கள். நடுப்புள்ளி = ((x₁ + x₂)/2, (y₁ + y₂)/2).',
      },
      example: {
        en: 'A(2, 3) and B(8, −1)\nx: (2 + 8) / 2 = 5\ny: (3 + (−1)) / 2 = 1\nMidpoint: (5, 1)',
        es: 'A(2, 3) y B(8, −1)\nx: (2 + 8) / 2 = 5\ny: (3 + (−1)) / 2 = 1\nPunto medio: (5, 1)',
        ta: 'A(2, 3), B(8, −1)\nx: (2 + 8) / 2 = 5\ny: (3 + (−1)) / 2 = 1\nநடுப்புள்ளி: (5, 1)',
      },
    },
    teacherNotes: [
      'Common mistake: subtracting instead of adding ((x₂ − x₁)/2).',
      'Common mistake: adding but forgetting to divide by 2.',
      'Students enter the x and y in separate boxes. Halves can be typed as 5/2 or 2.5.',
      'Finding a missing endpoint (B = 2M − A) is the hardest version; ask them to sketch it.',
    ],
    templates: [
      {
        id: 'midpoint-basic',
        fields: ['x', 'y'],
        gen(r) {
          const x1 = r.int(-9, 9);
          const y1 = r.int(-9, 9);
          const x2 = x1 + 2 * r.nonzero(-6, 6);
          const y2 = y1 + 2 * r.int(-6, 6);
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          return {
            vars: { A: pt(x1, y1), B: pt(x2, y2), sx: `${num(x1)} + ${p(x2)}`, sy: `${num(y1)} + ${p(y2)}`, mx: num(mx), my: num(my), x1, y1, x2, y2 },
            answer: [R(mx), R(my)],
          };
        },
        prompt: {
          en: 'Find the midpoint of A{A} and B{B}.',
          es: 'Halla el punto medio de A{A} y B{B}.',
          ta: 'A{A}, B{B} இவற்றின் நடுப்புள்ளியைக் கண்டுபிடியுங்கள்.',
        },
        hint: {
          en: 'Add the two x-values and divide by 2. Do the same with the two y-values.',
          es: 'Suma los dos valores de x y divide entre 2. Haz lo mismo con los dos valores de y.',
          ta: 'இரண்டு x-களையும் கூட்டி 2-ஆல் வகுங்கள். இரண்டு y-களுக்கும் அதேபோல் செய்யுங்கள்.',
        },
        solution: { en: 'x = ({sx}) / 2 = {mx}\ny = ({sy}) / 2 = {my}\nMidpoint: ({mx}, {my})' },
        mistakes: (v, a) => [
          [R(n(v, 'x2') - n(v, 'x1'), 2), R(n(v, 'y2') - n(v, 'y1'), 2)],
          [R(n(v, 'x1') + n(v, 'x2')), R(n(v, 'y1') + n(v, 'y2'))],
          [a[1], a[0]],
        ],
      },
      {
        id: 'midpoint-half',
        fields: ['x', 'y'],
        gen(r) {
          const x1 = r.int(-9, 9);
          const y1 = r.int(-9, 9);
          const x2 = x1 + 2 * r.nonzero(-5, 5) + 1;
          const y2 = y1 + r.nonzero(-9, 9);
          const mx = frac(x1 + x2, 2);
          const my = frac(y1 + y2, 2);
          return {
            vars: { A: pt(x1, y1), B: pt(x2, y2), sx: `${num(x1)} + ${p(x2)}`, sy: `${num(y1)} + ${p(y2)}`, mx: show(mx), my: show(my), x1, y1, x2, y2 },
            answer: [mx, my],
          };
        },
        prompt: {
          en: 'Find the midpoint of A{A} and B{B}.\nEnter your answer as a fraction or decimal, like 5/2 or 2.5.',
          es: 'Halla el punto medio de A{A} y B{B}.\nEscribe tu respuesta como fracción o decimal, por ejemplo 5/2 o 2.5.',
          ta: 'A{A}, B{B} இவற்றின் நடுப்புள்ளியைக் கண்டுபிடியுங்கள்.\nவிடையைப் பின்னமாகவோ (5/2) தசம எண்ணாகவோ (2.5) எழுதுங்கள்.',
        },
        hint: {
          en: 'Add the two x-values and divide by 2. If the sum is odd, enter it as a fraction or decimal, like 7/2 or 3.5.',
          es: 'Suma los dos valores de x y divide entre 2. Si la suma es impar, escríbela como fracción o decimal, por ejemplo 7/2 o 3.5.',
          ta: 'இரண்டு x-களையும் கூட்டி 2-ஆல் வகுங்கள். கூட்டல் ஒற்றைப்படை என்றால், விடையைப் பின்னமாகவோ (7/2) தசம எண்ணாகவோ (3.5) எழுதுங்கள்.',
        },
        solution: { en: 'x = ({sx}) / 2 = {mx}\ny = ({sy}) / 2 = {my}\nMidpoint: ({mx}, {my})' },
        mistakes: (v, a) => [
          [R(n(v, 'x2') - n(v, 'x1'), 2), R(n(v, 'y2') - n(v, 'y1'), 2)],
          [R(n(v, 'x1') + n(v, 'x2')), R(n(v, 'y1') + n(v, 'y2'))],
          [a[1], a[0]],
        ],
      },
      {
        id: 'midpoint-endpoint',
        fields: ['x', 'y'],
        gen(r) {
          const ax = r.int(-8, 8);
          const ay = r.int(-8, 8);
          const mx = ax + r.nonzero(-6, 6);
          const my = ay + r.int(-6, 6);
          const bx = 2 * mx - ax;
          const by = 2 * my - ay;
          return {
            vars: { A: pt(ax, ay), M: pt(mx, my), mx: num(mx), my: num(my), pax: p(ax), pay: p(ay), bx: num(bx), by: num(by), ax, ay, mxn: mx, myn: my },
            answer: [R(bx), R(by)],
          };
        },
        prompt: {
          en: 'M{M} is the midpoint of A{A} and B. Find B.',
          es: 'M{M} es el punto medio de A{A} y B. Halla B.',
          ta: 'A{A}, B இவற்றின் நடுப்புள்ளி M{M}. B-ஐக் கண்டுபிடியுங்கள்.',
        },
        hint: {
          en: 'M is halfway, so B is as far past M as A is before it. For x: 2 × {mx} − {pax}. Do the same for y.',
          es: 'M está a la mitad, así que B está tan lejos después de M como A está antes. Para x: 2 × {mx} − {pax}. Haz lo mismo para y.',
          ta: 'M நடுவில் இருக்கிறது. அதனால் A-இலிருந்து M எவ்வளவு தூரமோ, M-இலிருந்து B-யும் அவ்வளவு தூரம். x-க்கு: 2 × {mx} − {pax}. y-க்கும் அதேபோல்.',
        },
        solution: { en: 'x = 2 × {mx} − {pax} = {bx}\ny = 2 × {my} − {pay} = {by}\nB = ({bx}, {by})' },
        mistakes: (v) => [
          [R(n(v, 'ax') + n(v, 'mxn'), 2), R(n(v, 'ay') + n(v, 'myn'), 2)],
          [R(n(v, 'mxn') - n(v, 'ax')), R(n(v, 'myn') - n(v, 'ay'))],
          [R(2 * n(v, 'mxn') + n(v, 'ax')), R(2 * n(v, 'myn') + n(v, 'ay'))],
        ],
      },
    ],
  },
  {
    id: 'distance',
    unit: COORD,
    title: { en: 'Distance between two points', es: 'Distancia entre dos puntos', ta: 'இரு புள்ளிகளுக்கு இடையே உள்ள தொலைவு' },
    summary: {
      en: 'How far apart A and B are, using Pythagoras.',
      es: 'Qué tan lejos están A y B, usando Pitágoras.',
      ta: 'A-க்கும் B-க்கும் எவ்வளவு தூரம் (பிதாகரஸ் மூலம்).',
    },
    prereqs: [],
    lesson: {
      body: {
        en: 'First find how far apart the points are across (the change in x) and up or down (the change in y). These are the two short sides of a right triangle, and the distance is the long side. By Pythagoras: d = √((x₂ − x₁)² + (y₂ − y₁)²).',
        es: 'Primero halla qué tan lejos están los puntos de lado (el cambio en x) y hacia arriba o abajo (el cambio en y). Son los dos lados cortos de un triángulo rectángulo, y la distancia es el lado largo. Por Pitágoras: d = √((x₂ − x₁)² + (y₂ − y₁)²).',
        ta: 'முதலில் இரண்டு புள்ளிகளும் பக்கவாட்டில் (x-இல்) எவ்வளவு தள்ளி, மேலே/கீழே (y-இல்) எவ்வளவு தள்ளி என்று பாருங்கள். இவை ஒரு செங்கோண முக்கோணத்தின் இரண்டு சிறிய பக்கங்கள். தொலைவு தான் நீளமான பக்கம். பிதாகரஸ் படி: d = √((x₂ − x₁)² + (y₂ − y₁)²).',
      },
      example: {
        en: 'A(1, 2) and B(4, 6)\nAcross: 4 − 1 = 3\nUp: 6 − 2 = 4\nd = √(3² + 4²) = √25 = 5',
        es: 'A(1, 2) y B(4, 6)\nDe lado: 4 − 1 = 3\nHacia arriba: 6 − 2 = 4\nd = √(3² + 4²) = √25 = 5',
        ta: 'A(1, 2), B(4, 6)\nபக்கவாட்டில்: 4 − 1 = 3\nமேலே: 6 − 2 = 4\nd = √(3² + 4²) = √25 = 5',
      },
    },
    teacherNotes: [
      'Common mistake: adding the changes (3 + 4 = 7) instead of squaring them.',
      'Common mistake: forgetting the square root at the end (answering 25 instead of 5).',
      'A negative change is fine: (−3)² = 9. Remind them to square before adding.',
      'The "√□" questions check the sum of squares when the distance is not a whole number.',
    ],
    templates: [
      {
        id: 'distance-origin',
        fields: ['d'],
        gen(r) {
          const [a, b, c] = legs(r);
          return { vars: { P: pt(a, b), pa: p(a), pb: p(b), sum: c * c, d: c, a, b }, answer: R(c) };
        },
        prompt: {
          en: 'How far is the point P{P} from the point O(0, 0)?',
          es: '¿Qué tan lejos está P{P} del origen O(0, 0)?',
          ta: 'P{P} என்ற புள்ளி, ஆதிப்புள்ளி O(0, 0)-இலிருந்து எவ்வளவு தொலைவு?',
        },
        hint: {
          en: 'The changes are just the coordinates. d = √({pa}² + {pb}²).',
          es: 'Los cambios son las coordenadas mismas. d = √({pa}² + {pb}²).',
          ta: 'இங்கே மாற்றங்கள் புள்ளியின் எண்களே. d = √({pa}² + {pb}²).',
        },
        solution: { en: 'd = √({pa}² + {pb}²)\nd = √{sum} = {d}' },
        mistakes: (v, a) => [[R(Math.abs(n(v, 'a')) + Math.abs(n(v, 'b')))], [R(a[0].n * a[0].n)], [R(Math.abs(Math.abs(n(v, 'a')) - Math.abs(n(v, 'b'))))]],
      },
      {
        id: 'distance-triple',
        fields: ['d'],
        gen(r) {
          const [dx, dy, c] = legs(r);
          const x1 = r.int(-8, 8);
          const y1 = r.int(-8, 8);
          const x2 = x1 + dx;
          const y2 = y1 + dy;
          return {
            vars: {
              A: pt(x1, y1),
              B: pt(x2, y2),
              across: `${num(x2)} − ${p(x1)} = ${num(dx)}`,
              updown: `${num(y2)} − ${p(y1)} = ${num(dy)}`,
              pdx: p(dx),
              pdy: p(dy),
              sum: c * c,
              d: c,
              dx,
              dy,
            },
            answer: R(c),
          };
        },
        prompt: {
          en: 'Find the distance between A{A} and B{B}.',
          es: 'Halla la distancia entre A{A} y B{B}.',
          ta: 'A{A}, B{B} இவற்றுக்கு இடையே உள்ள தொலைவைக் கண்டுபிடியுங்கள்.',
        },
        hint: {
          en: 'Find the change in x and the change in y. Square each, add them, then take the square root.',
          es: 'Halla el cambio en x y el cambio en y. Eleva cada uno al cuadrado, súmalos y saca la raíz cuadrada.',
          ta: 'x-இல் எவ்வளவு மாற்றம், y-இல் எவ்வளவு மாற்றம் என்று பாருங்கள். ஒவ்வொன்றையும் வர்க்கம் செய்து, கூட்டி, வர்க்கமூலம் எடுங்கள்.',
        },
        solution: { en: 'Change in x: {across}\nChange in y: {updown}\nd = √({pdx}² + {pdy}²) = √{sum} = {d}' },
        mistakes: (v, a) => [[R(Math.abs(n(v, 'dx')) + Math.abs(n(v, 'dy')))], [R(a[0].n * a[0].n)], [R(Math.abs(Math.abs(n(v, 'dx')) - Math.abs(n(v, 'dy'))))]],
      },
      {
        id: 'distance-squared',
        fields: ['d²'],
        gen(r) {
          let dx = 0;
          let dy = 0;
          let sum = 0;
          do {
            dx = r.nonzero(-7, 7);
            dy = r.nonzero(-7, 7);
            sum = dx * dx + dy * dy;
          } while (Number.isInteger(Math.sqrt(sum)));
          const x1 = r.int(-8, 8);
          const y1 = r.int(-8, 8);
          return {
            vars: { A: pt(x1, y1), B: pt(x1 + dx, y1 + dy), pdx: p(dx), pdy: p(dy), dx2: dx * dx, dy2: dy * dy, sum, dx, dy },
            answer: R(sum),
          };
        },
        prompt: {
          en: 'The distance between A{A} and B{B} is √□.\nWhat number goes under the square root?',
          es: 'La distancia entre A{A} y B{B} es √□.\n¿Qué número va dentro de la raíz?',
          ta: 'A{A}, B{B} இவற்றுக்கு இடையே உள்ள தொலைவு √□.\n√ குறிக்குள் என்ன எண் வரும்?',
        },
        hint: {
          en: 'Find the change in x and the change in y, square each, and add. Don’t take the square root: that number is the answer.',
          es: 'Halla el cambio en x y en y, eleva cada uno al cuadrado y súmalos. No saques la raíz: ese número es la respuesta.',
          ta: 'x மாற்றம், y மாற்றம் இரண்டையும் வர்க்கம் செய்து கூட்டுங்கள். வர்க்கமூலம் எடுக்க வேண்டாம்: அந்த எண்ணே விடை.',
        },
        solution: { en: 'd² = {pdx}² + {pdy}²\nd² = {dx2} + {dy2} = {sum}\nd = √{sum}' },
        mistakes: (v) => {
          const dx = Math.abs(n(v, 'dx'));
          const dy = Math.abs(n(v, 'dy'));
          return [[R((dx + dy) ** 2)], [R(dx + dy)], [R(Math.abs(dx * dx - dy * dy) || 2 * dx)]];
        },
      },
    ],
  },
  {
    id: 'circle',
    unit: COORD,
    title: { en: 'Equation of a circle', es: 'Ecuación de una circunferencia', ta: 'வட்டத்தின் சமன்பாடு' },
    summary: {
      en: 'Write the equation from the center and radius.',
      es: 'Escribe la ecuación a partir del centro y el radio.',
      ta: 'மையம், ஆரம் தெரிந்தால் சமன்பாட்டை எழுதுவது.',
    },
    prereqs: [],
    lesson: {
      body: {
        en: 'A circle is all the points that are the same distance (the radius r) from its center (h, k). Its equation is (x − h)² + (y − k)² = r². Watch the signs: the center (3, −2) gives (x − 3)² + (y + 2)², because y − (−2) = y + 2. Remember to square the radius.',
        es: 'Una circunferencia son todos los puntos a la misma distancia (el radio r) de su centro (h, k). Su ecuación es (x − h)² + (y − k)² = r². Cuidado con los signos: el centro (3, −2) da (x − 3)² + (y + 2)², porque y − (−2) = y + 2. Recuerda elevar el radio al cuadrado.',
        ta: 'வட்டம் என்பது மையம் (h, k)-இலிருந்து ஒரே தொலைவில் (ஆரம் r) உள்ள எல்லாப் புள்ளிகளும். அதன் சமன்பாடு (x − h)² + (y − k)² = r². குறிகளைக் கவனியுங்கள்: மையம் (3, −2) என்றால் (x − 3)² + (y + 2)², ஏனென்றால் y − (−2) = y + 2. ஆரத்தை வர்க்கம் செய்ய மறக்காதீர்கள்.',
      },
      example: {
        en: 'Center (3, −2), radius 5\n(x − 3)² + (y − (−2))² = 5²\n(x − 3)² + (y + 2)² = 25',
        es: 'Centro (3, −2), radio 5\n(x − 3)² + (y − (−2))² = 5²\n(x − 3)² + (y + 2)² = 25',
        ta: 'மையம் (3, −2), ஆரம் 5\n(x − 3)² + (y − (−2))² = 5²\n(x − 3)² + (y + 2)² = 25',
      },
    },
    teacherNotes: [
      'Common mistake: sign flips. Center (3, −2) is (x − 3)² + (y + 2)², not (x + 3)² + (y − 2)².',
      'Common mistake: writing r instead of r² on the right side.',
      'In "enter h, k and r²", h and k are the center itself (they type −2, not +2), which targets the sign mistake directly.',
      'The last question type joins this to distance: the radius is the distance from the center to a point on the circle.',
    ],
    templates: [
      {
        id: 'circle-origin',
        fields: ['r²'],
        gen(r) {
          const rad = r.int(2, 12);
          return { vars: { r: rad, r2: rad * rad }, answer: R(rad * rad) };
        },
        prompt: {
          en: 'A circle has center O(0, 0) and radius {r}.\nIts equation is x² + y² = □. What number goes in the box?',
          es: 'Una circunferencia tiene centro O(0, 0) y radio {r}.\nSu ecuación es x² + y² = □. ¿Qué número va en la casilla?',
          ta: 'ஒரு வட்டத்தின் மையம் O(0, 0), ஆரம் {r}.\nஅதன் சமன்பாடு x² + y² = □. கட்டத்தில் என்ன எண் வரும்?',
        },
        hint: {
          en: 'The right side is the radius squared: {r} × {r}.',
          es: 'El lado derecho es el radio al cuadrado: {r} × {r}.',
          ta: 'வலது பக்கம் ஆரத்தின் வர்க்கம்: {r} × {r}.',
        },
        solution: { en: 'x² + y² = {r}²\nx² + y² = {r2}' },
        mistakes: (v) => [[R(n(v, 'r'))], [R(2 * n(v, 'r'))], [R(n(v, 'r2') + n(v, 'r'))]],
      },
      {
        id: 'circle-equation',
        fields: ['h', 'k', 'r²'],
        display: ([h, k, r2]) => circleEq(h, k, r2),
        gen(r) {
          let h = 0;
          let k = 0;
          while (h === 0 && k === 0) {
            h = r.int(-8, 8);
            k = r.int(-8, 8);
          }
          const rad = r.int(2, 10);
          return {
            vars: { C: pt(h, k), h: num(h), k: num(k), r: rad, r2: rad * rad, eq: circleEq(R(h), R(k), R(rad * rad)) },
            answer: [R(h), R(k), R(rad * rad)],
          };
        },
        prompt: {
          en: 'A circle has center {C} and radius {r}.\nWrite its equation as\n(x − h)² + (y − k)² = r²\nEnter h, k and r².',
          es: 'Una circunferencia tiene centro {C} y radio {r}.\nEscribe su ecuación como\n(x − h)² + (y − k)² = r²\nEscribe h, k y r².',
          ta: 'ஒரு வட்டத்தின் மையம் {C}, ஆரம் {r}.\nஅதன் சமன்பாட்டை இப்படி எழுதுங்கள்:\n(x − h)² + (y − k)² = r²\nh, k, r² என்ன?',
        },
        hint: {
          en: 'h and k are just the center: h = {h}, k = {k}. Then square the radius.',
          es: 'h y k son el centro: h = {h}, k = {k}. Luego eleva el radio al cuadrado.',
          ta: 'h, k என்பது மையமே: h = {h}, k = {k}. பிறகு ஆரத்தை வர்க்கம் செய்யுங்கள்.',
        },
        solution: { en: 'h = {h}, k = {k}, r² = {r}² = {r2}\n{eq}' },
        mistakes: (_v, [h, k, r2]) => [
          [frac(-h.n, h.d), frac(-k.n, k.d), r2],
          [h, k, R(Math.round(Math.sqrt(r2.n)))],
          [frac(-h.n, h.d), frac(-k.n, k.d), R(Math.round(Math.sqrt(r2.n)))],
        ],
      },
      {
        id: 'circle-read',
        fields: ['h', 'k', 'r'],
        display: ([h, k, rad]) => `(${show(h)}, ${show(k)}), r = ${show(rad)}`,
        gen(r) {
          const h = r.nonzero(-8, 8);
          const k = r.nonzero(-8, 8);
          const rad = r.int(2, 9);
          return {
            vars: { eq: circleEq(R(h), R(k), R(rad * rad)), h: num(h), k: num(k), r: rad, r2: rad * rad },
            answer: [R(h), R(k), R(rad)],
          };
        },
        prompt: {
          en: 'A circle has the equation\n{eq}\nFind its center (h, k) and radius r.',
          es: 'Una circunferencia tiene la ecuación\n{eq}\nHalla su centro (h, k) y su radio r.',
          ta: 'ஒரு வட்டத்தின் சமன்பாடு\n{eq}\nஅதன் மையம் (h, k), ஆரம் r என்ன?',
        },
        hint: {
          en: 'Compare with (x − h)² + (y − k)² = r². A "+" inside the bracket means the center number is negative. The radius is the square root of {r2}.',
          es: 'Compara con (x − h)² + (y − k)² = r². Un "+" dentro del paréntesis significa que el número del centro es negativo. El radio es la raíz cuadrada de {r2}.',
          ta: '(x − h)² + (y − k)² = r² உடன் ஒப்பிடுங்கள். அடைப்புக்குள் "+" இருந்தால், மையத்தின் எண் குறை எண். ஆரம் = {r2}-இன் வர்க்கமூலம்.',
        },
        solution: { en: '{eq}\nCenter: ({h}, {k})\nr = √{r2} = {r}' },
        mistakes: (_v, [h, k, rad]) => [
          [frac(-h.n, h.d), frac(-k.n, k.d), rad],
          [h, k, R(rad.n * rad.n)],
          [frac(-h.n, h.d), frac(-k.n, k.d), R(rad.n * rad.n)],
        ],
      },
      {
        id: 'circle-through',
        fields: ['r²'],
        gen(r) {
          const h = r.int(-6, 6);
          const k = r.int(-6, 6);
          const dx = r.nonzero(-6, 6);
          const dy = r.nonzero(-6, 6);
          const r2 = dx * dx + dy * dy;
          return {
            vars: { C: pt(h, k), P: pt(h + dx, k + dy), pdx: p(dx), pdy: p(dy), r2, dx, dy },
            answer: R(r2),
          };
        },
        prompt: {
          en: 'A circle has its center at C{C}, and the point P{P} is on the circle.\nIts equation is (x − h)² + (y − k)² = r². What is r²?',
          es: 'Una circunferencia tiene centro C{C} y pasa por P{P}.\nSu ecuación es (x − h)² + (y − k)² = r². ¿Cuánto es r²?',
          ta: 'ஒரு வட்டத்தின் மையம் C{C}, அது P{P} வழியாகச் செல்கிறது.\nஅதன் சமன்பாடு (x − h)² + (y − k)² = r². r² என்ன?',
        },
        hint: {
          en: 'The radius is the distance from C to P. r² = (change in x)² + (change in y)². No square root needed.',
          es: 'El radio es la distancia de C a P. r² = (cambio en x)² + (cambio en y)². No hace falta la raíz.',
          ta: 'ஆரம் = C-இலிருந்து P-க்கு உள்ள தொலைவு. r² = (x மாற்றம்)² + (y மாற்றம்)². வர்க்கமூலம் தேவையில்லை.',
        },
        solution: { en: 'r² = {pdx}² + {pdy}²\nr² = {r2}' },
        mistakes: (v) => {
          const dx = Math.abs(n(v, 'dx'));
          const dy = Math.abs(n(v, 'dy'));
          return [[R(dx + dy)], [R((dx + dy) ** 2)], [R(Math.abs(dx * dx - dy * dy) || 2 * dx)]];
        },
      },
    ],
  },
];
