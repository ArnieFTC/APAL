import { frac, show } from '../lib/rational';
import { linear, num, plus, term } from '../lib/format';
import type { L, Pathway } from './types';
import { coordinateSkills } from './coordinate';
import { withExtras } from './extra';

const LINEAR: L = { en: 'Linear equations', es: 'Ecuaciones lineales', ta: 'ஒருபடிச் சமன்பாடுகள்' };

/**
 * Sevalaya, 9th grade: linear equations, then coordinate geometry.
 * Tamil uses plain, everyday words, keeping the maths terms students see in Tamil Nadu textbooks
 * (சமன்பாடு, பின்னம், நடுப்புள்ளி, தொலைவு, வட்டம், மையம், ஆரம்). Tamil and Spanish still need a check by a fluent reader.
 */
export const sevalaya: Pathway = {
  id: 'sevalaya-9',
  title: {
    en: 'Class 9 maths',
    es: 'Matemáticas de 9.º',
    ta: '9-ஆம் வகுப்பு கணக்கு',
  },
  skills: withExtras([
    {
      id: 'two-step',
      unit: LINEAR,
      title: {
        en: 'Two-step equations',
        es: 'Ecuaciones de dos pasos',
        ta: 'இரண்டு படிச் சமன்பாடுகள்',
      },
      summary: {
        en: 'Equations like 3x + 5 = 20.',
        es: 'Ecuaciones como 3x + 5 = 20.',
        ta: '3x + 5 = 20 மாதிரி சமன்பாடுகள்.',
      },
      prereqs: [],
      lesson: {
        body: {
          en: 'An equation is a balance: both sides are equal. To find x, undo what was done to it, in reverse order. Do the same thing to both sides so it stays balanced. First undo the adding or subtracting, then undo the multiplying or dividing.',
          es: 'Una ecuación es una balanza: los dos lados son iguales. Para hallar x, deshaz lo que se le hizo, en orden inverso. Haz lo mismo en ambos lados para que siga en equilibrio. Primero deshaz la suma o la resta, luego la multiplicación o la división.',
          ta: 'சமன்பாடு ஒரு தராசு மாதிரி: இரண்டு பக்கமும் சமம். x-ஐக் கண்டுபிடிக்க, x-க்குச் செய்ததை ஒவ்வொன்றாக, பின்னாலிருந்து நீக்குங்கள். தராசு சாயாமல் இருக்க, இரண்டு பக்கமும் ஒரே வேலையைச் செய்யுங்கள். முதலில் கூட்டியதையோ கழித்ததையோ நீக்குங்கள். பிறகு பெருக்கியதையோ வகுத்ததையோ நீக்குங்கள்.',
        },
        example: {
          en: '3x + 5 = 20\nSubtract 5 from both sides: 3x = 15\nDivide both sides by 3: x = 5',
          es: '3x + 5 = 20\nResta 5 en ambos lados: 3x = 15\nDivide ambos lados entre 3: x = 5',
          ta: '3x + 5 = 20\nஇரண்டு பக்கமும் 5 கழிக்கவும்: 3x = 15\nஇரண்டு பக்கமும் 3-ஆல் வகுக்கவும்: x = 5',
        },
      },
      teacherNotes: [
        'Common mistake: dividing before moving the constant (3x + 5 = 20 → x + 5 = 20/3).',
        'Common mistake: sign errors when the constant is negative. Ask "what was done to x, and what undoes it?"',
        'Quick check: have them substitute their answer back into the equation.',
      ],
      templates: [
        {
          id: 'two-step-basic',
          gen(r) {
            const a = r.sign() * r.int(2, 9);
            const x = r.nonzero(-10, 10);
            const b = r.nonzero(-20, 20);
            const c = a * x + b;
            return {
              vars: { eq: `${linear(a, b)} = ${num(c)}`, ax: term(a), rhs: num(c - b), x: num(x) },
              answer: frac(x),
            };
          },
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
          hint: {
            en: 'First move the constant: do the opposite on both sides. Then divide both sides by the number in front of x.',
            es: 'Primero mueve la constante: haz lo contrario en ambos lados. Luego divide ambos lados entre el número que está delante de x.',
            ta: 'முதலில் தனி எண்ணை மறுபக்கம் கொண்டு செல்லுங்கள்: இரண்டு பக்கமும் அதற்கு எதிரானதைச் செய்யுங்கள். பிறகு x-க்கு முன் உள்ள எண்ணால் இரண்டு பக்கமும் வகுக்கவும்.',
          },
          solution: { en: '{eq}\n{ax} = {rhs}\nx = {x}' },
        },
        {
          id: 'two-step-divide',
          gen(r) {
            const a = r.int(2, 6);
            const q = r.nonzero(-9, 9);
            const b = r.nonzero(-15, 15);
            const c = q + b;
            return {
              vars: { eq: `x/${a}${plus(b)} = ${num(c)}`, a, q: num(q), x: num(a * q) },
              answer: frac(a * q),
            };
          },
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
          hint: {
            en: 'First move the constant by doing the opposite on both sides. Then multiply both sides by {a} to undo the dividing.',
            es: 'Primero mueve la constante haciendo lo contrario en ambos lados. Luego multiplica ambos lados por {a} para deshacer la división.',
            ta: 'முதலில் தனி எண்ணை மறுபக்கம் கொண்டு செல்லுங்கள். பிறகு வகுத்ததை நீக்க, இரண்டு பக்கமும் {a}-ஆல் பெருக்கவும்.',
          },
          solution: { en: '{eq}\nx/{a} = {q}\nx = {x}' },
        },
        {
          id: 'two-step-auto',
          gen(r) {
            const b = r.pick([30, 40, 50, 60]);
            const a = r.int(12, 25);
            const km = r.int(2, 15);
            const c = b + a * km;
            return { vars: { a, b, c, rest: c - b, km }, answer: frac(km) };
          },
          prompt: {
            en: 'An auto-rickshaw costs ₹{b} as soon as you get in, and then ₹{a} more for every km. One ride cost ₹{c} in total. How many km was the ride?',
            es: 'Un mototaxi cuesta ₹{b} apenas te subes, y luego ₹{a} más por cada km. Un viaje costó ₹{c} en total. ¿Cuántos km fue el viaje?',
            ta: 'ஆட்டோவில் ஏறியதும் ₹{b}, பிறகு ஒவ்வொரு கி.மீ.க்கும் ₹{a}. ஒரு பயணத்துக்கு ₹{c} ஆனது. பயணம் எத்தனை கி.மீ.?',
          },
          hint: {
            en: 'Let x be the number of km. Write an equation: {b} + {a}x = {c}.',
            es: 'Sea x el número de km. Escribe una ecuación: {b} + {a}x = {c}.',
            ta: 'கி.மீ.-ஐ x என்று வைத்துக்கொள்ளுங்கள். அப்போது: {b} + {a}x = {c}.',
          },
          solution: { en: '{b} + {a}x = {c}\n{a}x = {rest}\nx = {km}' },
        },
      ],
    },
    {
      id: 'both-sides',
      unit: LINEAR,
      title: {
        en: 'Variables on both sides',
        es: 'Variables en ambos lados',
        ta: 'இரண்டு பக்கமும் x',
      },
      summary: {
        en: 'Equations like 5x + 2 = 3x + 10.',
        es: 'Ecuaciones como 5x + 2 = 3x + 10.',
        ta: '5x + 2 = 3x + 10 மாதிரி சமன்பாடுகள்.',
      },
      prereqs: ['two-step'],
      lesson: {
        body: {
          en: 'When there is an x on both sides, first get all the x’s on one side: take away the smaller x part from both sides. Then it becomes a two-step equation, which you already know how to solve.',
          es: 'Cuando x aparece en ambos lados, primero junta todas las x en un lado: quita la parte con x más pequeña de ambos lados. Así se convierte en una ecuación de dos pasos que ya sabes resolver.',
          ta: 'x இரண்டு பக்கமும் வந்தால், முதலில் எல்லா x-களையும் ஒரு பக்கம் கொண்டு வாருங்கள்: ஒரு பக்கத்து x-ஐ இரண்டு பக்கமும் கழியுங்கள். அதன் பிறகு இது உங்களுக்குத் தெரிந்த இரண்டு படிச் சமன்பாடு ஆகிவிடும்.',
        },
        example: {
          en: '5x + 2 = 3x + 10\nSubtract 3x from both sides: 2x + 2 = 10\nSubtract 2: 2x = 8\nDivide by 2: x = 4',
          es: '5x + 2 = 3x + 10\nResta 3x en ambos lados: 2x + 2 = 10\nResta 2: 2x = 8\nDivide entre 2: x = 4',
          ta: '5x + 2 = 3x + 10\nஇரண்டு பக்கமும் 3x கழிக்கவும்: 2x + 2 = 10\n2 கழிக்கவும்: 2x = 8\n2-ஆல் வகுக்கவும்: x = 4',
        },
      },
      teacherNotes: [
        'Common mistake: adding the x-terms instead of subtracting (5x + 2 = 3x + 10 → 8x + 2 = 10).',
        'Encourage moving the smaller x-term so the coefficient stays positive.',
        'If they are stuck, check two-step equations first.',
      ],
      templates: [
        {
          id: 'both-sides-basic',
          gen(r) {
            let a = 0;
            let c = 0;
            while (a === c) {
              a = r.nonzero(-9, 9);
              c = r.nonzero(-9, 9);
            }
            const x = r.int(-10, 10);
            const b = r.int(-15, 15);
            const d = (a - c) * x + b;
            return {
              vars: {
                eq: `${linear(a, b)} = ${linear(c, d)}`,
                cx: term(c),
                left: linear(a - c, b),
                kx: term(a - c),
                rhs: num(d),
                dmb: num(d - b),
                x: num(x),
              },
              answer: frac(x),
            };
          },
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
          hint: {
            en: 'Subtract {cx} from both sides so x is only on the left.',
            es: 'Resta {cx} en ambos lados para que x quede solo a la izquierda.',
            ta: 'x இடது பக்கம் மட்டும் இருக்க, இரண்டு பக்கமும் {cx} கழியுங்கள்.',
          },
          solution: { en: '{eq}\n{left} = {rhs}\n{kx} = {dmb}\nx = {x}' },
        },
        {
          id: 'both-sides-plans',
          gen(r) {
            const c = r.int(5, 12);
            const a = c + r.int(3, 10);
            const x = r.int(2, 12);
            const b = 10 * r.int(5, 15);
            const d = b + (a - c) * x;
            return { vars: { a, b, c, d, k: a - c, dmb: d - b, x }, answer: frac(x) };
          },
          prompt: {
            en: 'Phone plan A costs ₹{b} every month, plus ₹{a} for each GB of internet data you use. Plan B costs ₹{d} every month, plus ₹{c} for each GB. How many GB would you need to use for both plans to cost the same?',
            es: 'El plan de teléfono A cuesta ₹{b} cada mes, más ₹{a} por cada GB de datos que uses. El plan B cuesta ₹{d} cada mes, más ₹{c} por cada GB. ¿Cuántos GB tendrías que usar para que los dos planes cuesten lo mismo?',
            ta: 'போன் பிளான் A: மாதம் ₹{b}, ஒவ்வொரு GB-க்கும் ₹{a}. பிளான் B: மாதம் ₹{d}, ஒவ்வொரு GB-க்கும் ₹{c}. எத்தனை GB-க்கு இரண்டு பிளானுக்கும் ஒரே செலவு?',
          },
          hint: {
            en: 'Let x be the GB. Set the costs equal: {b} + {a}x = {d} + {c}x.',
            es: 'Sea x los GB. Iguala los costos: {b} + {a}x = {d} + {c}x.',
            ta: 'GB-ஐ x என்று வைத்துக்கொள்ளுங்கள். இரண்டு செலவையும் சமமாக்குங்கள்: {b} + {a}x = {d} + {c}x.',
          },
          solution: { en: '{b} + {a}x = {d} + {c}x\n{k}x = {dmb}\nx = {x}' },
        },
      ],
    },
    {
      id: 'brackets',
      unit: LINEAR,
      title: {
        en: 'Equations with brackets',
        es: 'Ecuaciones con paréntesis',
        ta: 'அடைப்புக்குறி உள்ள சமன்பாடுகள்',
      },
      summary: {
        en: 'Equations like 3(x − 2) = 12.',
        es: 'Ecuaciones como 3(x − 2) = 12.',
        ta: '3(x − 2) = 12 மாதிரி சமன்பாடுகள்.',
      },
      prereqs: ['two-step'],
      lesson: {
        body: {
          en: 'If an equation has brackets, multiply them out first: a(x + b) = ax + ab. Multiply everything inside the brackets by the number outside. Then solve as usual. Answers can be fractions; enter them as a fraction or decimal, like 5/2 or 2.5.',
          es: 'Si una ecuación tiene paréntesis, primero multiplícalos: a(x + b) = ax + ab. Multiplica todo lo que está dentro del paréntesis por el número de afuera. Luego resuelve como siempre. Las respuestas pueden ser fracciones; escríbelas como fracción o decimal, por ejemplo 5/2 o 2.5.',
          ta: 'சமன்பாட்டில் அடைப்புக்குறி இருந்தால், முதலில் அதைத் திறந்து பெருக்குங்கள்: a(x + b) = ax + ab. உள்ளே உள்ள ஒவ்வொன்றையும் வெளியே உள்ள எண்ணால் பெருக்க வேண்டும். பிறகு வழக்கம் போல் செய்யுங்கள். விடை பின்னமாகவும் வரலாம்; அப்போது பின்னமாகவோ (5/2) தசம எண்ணாகவோ (2.5) எழுதுங்கள்.',
        },
        example: {
          en: '3(x − 2) = 12\nOpen the brackets: 3x − 6 = 12\nAdd 6: 3x = 18\nDivide by 3: x = 6',
          es: '3(x − 2) = 12\nMultiplica: 3x − 6 = 12\nSuma 6: 3x = 18\nDivide entre 3: x = 6',
          ta: '3(x − 2) = 12\nதிறந்து பெருக்கவும்: 3x − 6 = 12\n6 கூட்டவும்: 3x = 18\n3-ஆல் வகுக்கவும்: x = 6',
        },
      },
      teacherNotes: [
        'Common mistake: multiplying only the first term inside (3(x − 2) → 3x − 2).',
        'Some answers are fractions. Show how to type 5/2 on the keypad. Decimals work too: exact ones like 2.5, or rounded to 2 places like 2.33 for 7/3.',
      ],
      templates: [
        {
          id: 'brackets-basic',
          gen(r) {
            const a = r.int(2, 9);
            const b = r.nonzero(-9, 9);
            const x = r.int(-10, 10);
            const c = a * (x + b);
            return {
              vars: {
                eq: `${a}(${linear(1, b)}) = ${num(c)}`,
                a,
                expanded: linear(a, a * b),
                c: num(c),
                cab: num(c - a * b),
                x: num(x),
              },
              answer: frac(x),
            };
          },
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
          hint: {
            en: 'Open the brackets first: multiply everything inside them by {a}.',
            es: 'Primero multiplica el paréntesis: multiplica cada término de adentro por {a}.',
            ta: 'முதலில் அடைப்பைத் திறந்து பெருக்குங்கள்: உள்ளே உள்ள ஒவ்வொன்றையும் {a}-ஆல் பெருக்கவும்.',
          },
          solution: { en: '{eq}\n{expanded} = {c}\n{a}x = {cab}\nx = {x}' },
        },
        {
          id: 'brackets-both',
          gen(r) {
            const a = r.int(2, 7);
            let c = a;
            while (c === a) c = r.int(1, 9);
            const b = r.nonzero(-6, 6);
            const x = r.int(-8, 8);
            const d = a * (x + b) - c * x;
            return {
              vars: {
                eq: `${a}(${linear(1, b)}) = ${linear(c, d)}`,
                a,
                expanded: linear(a, a * b),
                right: linear(c, d),
                kx: term(a - c),
                rest: num(d - a * b),
                x: num(x),
              },
              answer: frac(x),
            };
          },
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
          hint: {
            en: 'Open the brackets first by multiplying. Then get all the x’s on one side.',
            es: 'Primero abre el paréntesis multiplicando y luego junta todas las x en un lado.',
            ta: 'முதலில் அடைப்பைத் திறந்து பெருக்குங்கள். பிறகு எல்லா x-களையும் ஒரு பக்கம் கொண்டு வாருங்கள்.',
          },
          solution: { en: '{eq}\n{expanded} = {right}\n{kx} = {rest}\nx = {x}' },
        },
        {
          id: 'brackets-fraction',
          gen(r) {
            const a = r.int(2, 6);
            const b = r.nonzero(-5, 5);
            let c = 0;
            do c = r.int(-20, 20);
            while ((c - a * b) % a === 0);
            const answer = frac(c - a * b, a);
            return {
              vars: {
                eq: `${a}(${linear(1, b)}) = ${num(c)}`,
                a,
                expanded: linear(a, a * b),
                c: num(c),
                cab: num(c - a * b),
                x: show(answer),
              },
              answer,
            };
          },
          prompt: {
            en: 'Solve for x. Enter your answer as a fraction or decimal.\n{eq}',
            es: 'Resuelve para x. Escribe tu respuesta como fracción o decimal.\n{eq}',
            ta: 'x-ஐக் கண்டுபிடியுங்கள். விடையைப் பின்னமாகவோ தசம எண்ணாகவோ எழுதுங்கள்.\n{eq}',
          },
          hint: {
            en: 'Open the brackets by multiplying, and solve as usual. Enter the answer as a fraction like 7/3, or a decimal rounded to 2 places like 2.33.',
            es: 'Multiplica el paréntesis y resuelve como siempre. Escribe la respuesta como fracción, por ejemplo 7/3, o como decimal redondeado a 2 cifras, por ejemplo 2.33.',
            ta: 'அடைப்பைத் திறந்து பெருக்கி, வழக்கம் போல் செய்யுங்கள். விடையை 7/3 மாதிரி பின்னமாகவோ, 2.33 மாதிரி இரண்டு தசம இடங்களுக்குத் தசம எண்ணாகவோ எழுதுங்கள்.',
          },
          solution: { en: '{eq}\n{expanded} = {c}\n{a}x = {cab}\nx = {x}' },
        },
      ],
    },
    {
      id: 'word-problems',
      unit: LINEAR,
      title: {
        en: 'Write and solve equations',
        es: 'Plantear y resolver ecuaciones',
        ta: 'கதைக் கணக்குகள்',
      },
      summary: {
        en: 'Turn a story into an equation, then solve it.',
        es: 'Convierte una historia en una ecuación y resuélvela.',
        ta: 'கதையைச் சமன்பாடாக எழுதி, விடை காணுங்கள்.',
      },
      prereqs: ['both-sides', 'brackets'],
      lesson: {
        body: {
          en: 'Pick a letter for the unknown, usually x. Write the other amounts using x. Then use the story to write an equation, and solve it. Check: does your answer make sense in the story?',
          es: 'Elige una letra para lo desconocido, normalmente x. Escribe las otras cantidades usando x. Luego usa la historia para escribir una ecuación y resuélvela. Comprueba: ¿tu respuesta tiene sentido en la historia?',
          ta: 'தெரியாத எண்ணுக்கு ஒரு எழுத்தை வையுங்கள், பொதுவாக x. மற்ற அளவுகளை x வைத்து எழுதுங்கள். பிறகு கதையில் சொன்னதை வைத்து சமன்பாடு எழுதி, விடை காணுங்கள். கடைசியில் பாருங்கள்: விடை கதைக்குப் பொருந்துகிறதா?',
        },
        example: {
          en: 'Three numbers in a row add up to 48.\nCall them x, x + 1, x + 2.\nx + (x + 1) + (x + 2) = 48\n3x + 3 = 48, so x = 15.\nThe numbers are 15, 16, 17.',
          es: 'Tres números consecutivos suman 48.\nLlámalos x, x + 1, x + 2.\nx + (x + 1) + (x + 2) = 48\n3x + 3 = 48, así que x = 15.\nLos números son 15, 16, 17.',
          ta: 'அடுத்தடுத்த மூன்று எண்களைக் கூட்டினால் 48.\nஅவற்றை x, x + 1, x + 2 என்று வைப்போம்.\nx + (x + 1) + (x + 2) = 48\n3x + 3 = 48, அதனால் x = 15.\nஎண்கள்: 15, 16, 17.',
        },
      },
      teacherNotes: [
        'The hard part is setting up the equation, not solving it. Ask them to say in words what x stands for before writing anything.',
        'If they set up correctly but solve wrongly, send them back to the earlier skills.',
        'Ask them to check the answer against the story (is the age positive? does the perimeter match?).',
      ],
      templates: [
        {
          id: 'word-consecutive',
          gen(r) {
            const n = r.int(1, 40);
            const s = 3 * n + 3;
            return { vars: { s: num(s), s3: num(s - 3), n: num(n) }, answer: frac(n) };
          },
          prompt: {
            en: 'Three consecutive whole numbers add up to {s}. What is the smallest of the three?',
            es: 'Tres números enteros consecutivos suman {s}. ¿Cuál es el más pequeño de los tres?',
            ta: 'தொடர்ச்சியான மூன்று முழு எண்களைக் கூட்டினால் {s}. அவற்றில் சிறிய எண் எது?',
          },
          hint: {
            en: 'Call them x, x + 1 and x + 2. Add them and set the total equal to {s}.',
            es: 'Llámalos x, x + 1 y x + 2. Súmalos e iguala el total a {s}.',
            ta: 'அவற்றை x, x + 1, x + 2 என்று வையுங்கள். மூன்றையும் கூட்டி, {s}-க்குச் சமமாக்குங்கள்.',
          },
          solution: { en: 'x + (x + 1) + (x + 2) = {s}\n3x + 3 = {s}\n3x = {s3}\nx = {n}' },
        },
        {
          id: 'word-ages',
          gen(r) {
            const y = r.int(6, 20);
            const k = r.int(2, 10);
            const s = 2 * y + k;
            return { vars: { k, s, s2: s - k, y }, answer: frac(y) };
          },
          prompt: {
            en: 'Kavin is {k} years older than his sister Meena. If you add their two ages together, you get {s}. How old is Meena?',
            es: 'Kavin tiene {k} años más que su hermana Meena. Sus edades suman {s}. ¿Cuántos años tiene Meena?',
            ta: 'கவின், தங்கை மீனாவை விட {k} வயது பெரியவன். இருவர் வயதையும் கூட்டினால் {s}. மீனாவுக்கு என்ன வயது?',
          },
          hint: {
            en: "Let Meena's age be x. Then Kavin is x + {k}.",
            es: 'Sea x la edad de Meena. Entonces Kavin tiene x + {k}.',
            ta: 'மீனாவின் வயதை x என்று வையுங்கள். அப்போது கவினின் வயது x + {k}.',
          },
          solution: { en: 'x + (x + {k}) = {s}\n2x + {k} = {s}\n2x = {s2}\nx = {y}' },
        },
        {
          id: 'word-rectangle',
          gen(r) {
            const w = r.int(3, 25);
            const k = r.int(2, 12);
            const p = 4 * w + 2 * k;
            return { vars: { k, k2: 2 * k, p, rest: p - 2 * k, w }, answer: frac(w) };
          },
          prompt: {
            en: 'The length of a rectangle is {k} cm more than its width. Its perimeter is {p} cm. What is its width, in cm?',
            es: 'El largo de un rectángulo mide {k} cm más que su ancho. Su perímetro es {p} cm. ¿Cuánto mide de ancho, en cm?',
            ta: 'ஒரு செவ்வகத்தின் நீளம், அகலத்தை விட {k} செ.மீ. அதிகம். அதன் சுற்றளவு {p} செ.மீ. அகலம் எத்தனை செ.மீ.?',
          },
          hint: {
            en: 'Let the width be x. The length is x + {k}. Perimeter = 2 × (length + width).',
            es: 'Sea x el ancho. El largo es x + {k}. Perímetro = 2 × (largo + ancho).',
            ta: 'அகலத்தை x என்று வையுங்கள். நீளம் x + {k}. சுற்றளவு = 2 × (நீளம் + அகலம்).',
          },
          solution: { en: '2(x + x + {k}) = {p}\n4x + {k2} = {p}\n4x = {rest}\nx = {w}' },
        },
        {
          id: 'word-savings',
          gen(r) {
            const q = 5 * r.int(4, 12);
            const r2 = q + 5 * r.int(1, 6);
            const w = r.int(2, 15);
            const a = 10 * r.int(5, 30);
            const b = a + (r2 - q) * w;
            return { vars: { a, b, q, r: r2, k: r2 - q, diff: b - a, w }, answer: frac(w) };
          },
          prompt: {
            en: 'Priya has ₹{a}. Every week she gets ₹{r} from her job and keeps all of it. Arun has ₹{b}. Every week he gets ₹{q} from his job and keeps all of it. After how many weeks will they both have the same amount of money?',
            es: 'Priya tiene ₹{a}. Cada semana gana ₹{r} en su trabajo y lo guarda todo. Arun tiene ₹{b}. Cada semana gana ₹{q} en su trabajo y lo guarda todo. ¿Después de cuántas semanas tendrán los dos la misma cantidad de dinero?',
            ta: 'பிரியாவிடம் ₹{a} இருக்கிறது. ஒவ்வொரு வாரமும் வேலையில் ₹{r} சம்பாதித்து, முழுவதையும் வைத்துக்கொள்கிறாள். அருணிடம் ₹{b} இருக்கிறது. ஒவ்வொரு வாரமும் வேலையில் ₹{q} சம்பாதித்து, முழுவதையும் வைத்துக்கொள்கிறான். எத்தனை வாரம் கழித்து இருவரிடமும் ஒரே அளவு பணம் இருக்கும்?',
          },
          hint: {
            en: "After x weeks Priya has {a} + {r}x. Write Arun's amount the same way and set them equal.",
            es: 'Después de x semanas Priya tiene {a} + {r}x. Escribe la cantidad de Arun de la misma forma e iguálalas.',
            ta: 'x வாரம் கழித்து பிரியாவிடம் {a} + {r}x இருக்கும். அருணுக்கும் அதேபோல் எழுதி, இரண்டையும் சமமாக்குங்கள்.',
          },
          solution: { en: '{a} + {r}x = {b} + {q}x\n{k}x = {diff}\nx = {w}' },
        },
      ],
    },
    ...coordinateSkills,
  ]),
};
