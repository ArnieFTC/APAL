import { frac, show } from '../lib/rational';
import { linear, num, plus, term } from '../lib/format';
import type { Pathway } from './types';

/**
 * Sevalaya, 9th grade: linear equations.
 * Tamil and Spanish text is a first draft and needs a check by a fluent reader.
 */
export const sevalaya: Pathway = {
  id: 'sevalaya-9',
  title: {
    en: 'Algebra: linear equations',
    es: 'Álgebra: ecuaciones lineales',
    ta: 'இயற்கணிதம்: நேரியல் சமன்பாடுகள்',
  },
  skills: [
    {
      id: 'two-step',
      title: {
        en: 'Two-step equations',
        es: 'Ecuaciones de dos pasos',
        ta: 'இரண்டு படி சமன்பாடுகள்',
      },
      summary: {
        en: 'Equations like 3x + 5 = 20.',
        es: 'Ecuaciones como 3x + 5 = 20.',
        ta: '3x + 5 = 20 போன்ற சமன்பாடுகள்.',
      },
      prereqs: [],
      lesson: {
        body: {
          en: 'An equation is a balance: both sides are equal. To find x, undo what was done to it, in reverse order. Do the same thing to both sides so it stays balanced. First undo the adding or subtracting, then undo the multiplying or dividing.',
          es: 'Una ecuación es una balanza: los dos lados son iguales. Para hallar x, deshaz lo que se le hizo, en orden inverso. Haz lo mismo en ambos lados para que siga en equilibrio. Primero deshaz la suma o la resta, luego la multiplicación o la división.',
          ta: 'சமன்பாடு ஒரு தராசு போன்றது: இரு பக்கங்களும் சமம். x-ஐக் கண்டுபிடிக்க, அதற்குச் செய்யப்பட்டதைத் தலைகீழ் வரிசையில் நீக்குங்கள். சமநிலை மாறாமல் இருக்க, இரு பக்கங்களிலும் ஒரே செயலைச் செய்யுங்கள். முதலில் கூட்டல் அல்லது கழித்தலை நீக்குங்கள், பிறகு பெருக்கல் அல்லது வகுத்தலை நீக்குங்கள்.',
        },
        example: {
          en: '3x + 5 = 20\nSubtract 5 from both sides: 3x = 15\nDivide both sides by 3: x = 5',
          es: '3x + 5 = 20\nResta 5 en ambos lados: 3x = 15\nDivide ambos lados entre 3: x = 5',
          ta: '3x + 5 = 20\nஇரு பக்கங்களிலும் 5-ஐக் கழிக்க: 3x = 15\nஇரு பக்கங்களையும் 3-ஆல் வகுக்க: x = 5',
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
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-இன் மதிப்பைக் காண்க:\n{eq}' },
          hint: {
            en: 'Move the constant first: do the opposite operation on both sides. Then divide both sides by the number in front of x.',
            es: 'Primero mueve la constante: haz la operación opuesta en ambos lados. Luego divide ambos lados entre el número que acompaña a x.',
            ta: 'முதலில் மாறிலியை நகர்த்துங்கள்: இரு பக்கங்களிலும் எதிர்ச் செயலைச் செய்யுங்கள். பிறகு x-க்கு முன் உள்ள எண்ணால் இரு பக்கங்களையும் வகுக்குங்கள்.',
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
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-இன் மதிப்பைக் காண்க:\n{eq}' },
          hint: {
            en: 'Move the constant first. Then multiply both sides by {a} to undo the dividing.',
            es: 'Primero mueve la constante. Luego multiplica ambos lados por {a} para deshacer la división.',
            ta: 'முதலில் மாறிலியை நகர்த்துங்கள். பிறகு வகுத்தலை நீக்க இரு பக்கங்களையும் {a}-ஆல் பெருக்குங்கள்.',
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
            en: 'An auto-rickshaw charges ₹{b} to start, plus ₹{a} for every km. A ride cost ₹{c}. How many km long was the ride?',
            es: 'Un mototaxi cobra ₹{b} al subir, más ₹{a} por cada km. Un viaje costó ₹{c}. ¿Cuántos km fue el viaje?',
            ta: 'ஒரு ஆட்டோ ஏறியவுடன் ₹{b} வசூலிக்கிறது, மேலும் ஒவ்வொரு கி.மீ.க்கும் ₹{a}. ஒரு பயணத்திற்கு ₹{c} ஆனது. பயணம் எத்தனை கி.மீ.?',
          },
          hint: {
            en: 'Let x be the number of km. Write an equation: {b} + {a}x = {c}.',
            es: 'Sea x el número de km. Escribe una ecuación: {b} + {a}x = {c}.',
            ta: 'கி.மீ. எண்ணிக்கையை x எனக் கொள்க. சமன்பாடு: {b} + {a}x = {c}.',
          },
          solution: { en: '{b} + {a}x = {c}\n{a}x = {rest}\nx = {km}' },
        },
      ],
    },
    {
      id: 'both-sides',
      title: {
        en: 'Variables on both sides',
        es: 'Variables en ambos lados',
        ta: 'இரு பக்கங்களிலும் மாறிகள்',
      },
      summary: {
        en: 'Equations like 5x + 2 = 3x + 10.',
        es: 'Ecuaciones como 5x + 2 = 3x + 10.',
        ta: '5x + 2 = 3x + 10 போன்ற சமன்பாடுகள்.',
      },
      prereqs: ['two-step'],
      lesson: {
        body: {
          en: 'When x appears on both sides, first gather all the x-terms on one side by subtracting one of them from both sides. Then it becomes a two-step equation you already know how to solve.',
          es: 'Cuando x aparece en ambos lados, primero junta todos los términos con x en un lado, restando uno de ellos en ambos lados. Así se convierte en una ecuación de dos pasos que ya sabes resolver.',
          ta: 'x இரு பக்கங்களிலும் வரும்போது, முதலில் x உள்ள உறுப்புகளை ஒரு பக்கத்திற்குக் கொண்டு வாருங்கள்: அவற்றில் ஒன்றை இரு பக்கங்களிலிருந்தும் கழியுங்கள். அதன் பிறகு அது உங்களுக்குத் தெரிந்த இரண்டு படி சமன்பாடாக மாறும்.',
        },
        example: {
          en: '5x + 2 = 3x + 10\nSubtract 3x from both sides: 2x + 2 = 10\nSubtract 2: 2x = 8\nDivide by 2: x = 4',
          es: '5x + 2 = 3x + 10\nResta 3x en ambos lados: 2x + 2 = 10\nResta 2: 2x = 8\nDivide entre 2: x = 4',
          ta: '5x + 2 = 3x + 10\nஇரு பக்கங்களிலும் 3x-ஐக் கழிக்க: 2x + 2 = 10\n2-ஐக் கழிக்க: 2x = 8\n2-ஆல் வகுக்க: x = 4',
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
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-இன் மதிப்பைக் காண்க:\n{eq}' },
          hint: {
            en: 'Subtract {cx} from both sides so x is only on the left.',
            es: 'Resta {cx} en ambos lados para que x quede solo a la izquierda.',
            ta: 'x இடப்பக்கம் மட்டும் இருக்க, இரு பக்கங்களிலும் {cx}-ஐக் கழியுங்கள்.',
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
            en: 'Phone plan A costs ₹{b} a month plus ₹{a} per GB of data. Plan B costs ₹{d} a month plus ₹{c} per GB. For how many GB do both plans cost the same?',
            es: 'El plan A cuesta ₹{b} al mes más ₹{a} por GB de datos. El plan B cuesta ₹{d} al mes más ₹{c} por GB. ¿Con cuántos GB cuestan lo mismo los dos planes?',
            ta: 'கைபேசித் திட்டம் A மாதம் ₹{b} மற்றும் ஒவ்வொரு GB-க்கும் ₹{a}. திட்டம் B மாதம் ₹{d} மற்றும் ஒவ்வொரு GB-க்கும் ₹{c}. எத்தனை GB-க்கு இரண்டு திட்டங்களின் செலவும் சமமாக இருக்கும்?',
          },
          hint: {
            en: 'Let x be the GB. Set the costs equal: {b} + {a}x = {d} + {c}x.',
            es: 'Sea x los GB. Iguala los costos: {b} + {a}x = {d} + {c}x.',
            ta: 'GB-ஐ x எனக் கொள்க. செலவுகளைச் சமப்படுத்துக: {b} + {a}x = {d} + {c}x.',
          },
          solution: { en: '{b} + {a}x = {d} + {c}x\n{k}x = {dmb}\nx = {x}' },
        },
      ],
    },
    {
      id: 'brackets',
      title: {
        en: 'Equations with brackets',
        es: 'Ecuaciones con paréntesis',
        ta: 'அடைப்புக்குறிகளுடன் சமன்பாடுகள்',
      },
      summary: {
        en: 'Equations like 3(x − 2) = 12.',
        es: 'Ecuaciones como 3(x − 2) = 12.',
        ta: '3(x − 2) = 12 போன்ற சமன்பாடுகள்.',
      },
      prereqs: ['two-step'],
      lesson: {
        body: {
          en: 'If an equation has brackets, multiply them out first: a(x + b) = ax + ab. Multiply every term inside by the number outside. Then solve as usual. Answers can be fractions; type them like 5/2.',
          es: 'Si una ecuación tiene paréntesis, primero multiplícalos: a(x + b) = ax + ab. Multiplica cada término de adentro por el número de afuera. Luego resuelve como siempre. Las respuestas pueden ser fracciones; escríbelas como 5/2.',
          ta: 'சமன்பாட்டில் அடைப்புக்குறிகள் இருந்தால், முதலில் அவற்றை விரித்து எழுதுங்கள்: a(x + b) = ax + ab. உள்ளே உள்ள ஒவ்வொரு உறுப்பையும் வெளியே உள்ள எண்ணால் பெருக்குங்கள். பிறகு வழக்கம் போல் தீர்க்கவும். விடைகள் பின்னங்களாகவும் இருக்கலாம்; 5/2 என்பது போல் தட்டச்சு செய்யுங்கள்.',
        },
        example: {
          en: '3(x − 2) = 12\nMultiply out: 3x − 6 = 12\nAdd 6: 3x = 18\nDivide by 3: x = 6',
          es: '3(x − 2) = 12\nMultiplica: 3x − 6 = 12\nSuma 6: 3x = 18\nDivide entre 3: x = 6',
          ta: '3(x − 2) = 12\nவிரிக்க: 3x − 6 = 12\n6-ஐக் கூட்ட: 3x = 18\n3-ஆல் வகுக்க: x = 6',
        },
      },
      teacherNotes: [
        'Common mistake: multiplying only the first term inside (3(x − 2) → 3x − 2).',
        'Some answers are fractions. Show how to type 5/2 on the keypad, and that 2.5 is accepted too.',
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
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-இன் மதிப்பைக் காண்க:\n{eq}' },
          hint: {
            en: 'Multiply out the brackets first: multiply each term inside by {a}.',
            es: 'Primero multiplica el paréntesis: multiplica cada término de adentro por {a}.',
            ta: 'முதலில் அடைப்புக்குறியை விரியுங்கள்: உள்ளே உள்ள ஒவ்வொரு உறுப்பையும் {a}-ஆல் பெருக்குங்கள்.',
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
          prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-இன் மதிப்பைக் காண்க:\n{eq}' },
          hint: {
            en: 'Multiply out the brackets first, then get all the x-terms on one side.',
            es: 'Primero multiplica el paréntesis y luego junta los términos con x en un lado.',
            ta: 'முதலில் அடைப்புக்குறியை விரியுங்கள், பிறகு x உள்ள உறுப்புகளை ஒரு பக்கத்திற்குக் கொண்டு வாருங்கள்.',
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
            en: 'Solve for x. The answer is a fraction.\n{eq}',
            es: 'Resuelve para x. La respuesta es una fracción.\n{eq}',
            ta: 'x-இன் மதிப்பைக் காண்க. விடை ஒரு பின்னம்.\n{eq}',
          },
          hint: {
            en: 'Multiply out the brackets, solve as usual, and leave the answer as a fraction like 7/3.',
            es: 'Multiplica el paréntesis, resuelve como siempre y deja la respuesta como fracción, por ejemplo 7/3.',
            ta: 'அடைப்புக்குறியை விரித்து, வழக்கம் போல் தீர்த்து, விடையை 7/3 போன்ற பின்னமாக எழுதுங்கள்.',
          },
          solution: { en: '{eq}\n{expanded} = {c}\n{a}x = {cab}\nx = {x}' },
        },
      ],
    },
    {
      id: 'word-problems',
      title: {
        en: 'Write and solve equations',
        es: 'Plantear y resolver ecuaciones',
        ta: 'சமன்பாடுகளை அமைத்துத் தீர்த்தல்',
      },
      summary: {
        en: 'Turn a story into an equation, then solve it.',
        es: 'Convierte una historia en una ecuación y resuélvela.',
        ta: 'ஒரு கதையைச் சமன்பாடாக மாற்றித் தீர்க்கவும்.',
      },
      prereqs: ['both-sides', 'brackets'],
      lesson: {
        body: {
          en: 'Pick a letter for the unknown, usually x. Write the other amounts using x. Then use the story to write an equation, and solve it. Check: does your answer make sense in the story?',
          es: 'Elige una letra para lo desconocido, normalmente x. Escribe las otras cantidades usando x. Luego usa la historia para escribir una ecuación y resuélvela. Comprueba: ¿tu respuesta tiene sentido en la historia?',
          ta: 'தெரியாத மதிப்பிற்கு ஒரு எழுத்தைத் தேர்ந்தெடுங்கள், பொதுவாக x. மற்ற அளவுகளை x-ஐக் கொண்டு எழுதுங்கள். பிறகு கதையைப் பயன்படுத்தி ஒரு சமன்பாட்டை அமைத்துத் தீர்க்கவும். சரிபாருங்கள்: உங்கள் விடை கதைக்குப் பொருந்துகிறதா?',
        },
        example: {
          en: 'Three consecutive numbers add up to 48.\nCall them x, x + 1, x + 2.\nx + (x + 1) + (x + 2) = 48\n3x + 3 = 48, so x = 15.\nThe numbers are 15, 16, 17.',
          es: 'Tres números consecutivos suman 48.\nLlámalos x, x + 1, x + 2.\nx + (x + 1) + (x + 2) = 48\n3x + 3 = 48, así que x = 15.\nLos números son 15, 16, 17.',
          ta: 'அடுத்தடுத்த மூன்று எண்களின் கூடுதல் 48.\nஅவற்றை x, x + 1, x + 2 எனக் கொள்க.\nx + (x + 1) + (x + 2) = 48\n3x + 3 = 48, எனவே x = 15.\nஎண்கள் 15, 16, 17.',
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
            const n = r.int(-20, 40);
            const s = 3 * n + 3;
            return { vars: { s: num(s), s3: num(s - 3), n: num(n) }, answer: frac(n) };
          },
          prompt: {
            en: 'Three consecutive integers add up to {s}. What is the smallest of them?',
            es: 'Tres enteros consecutivos suman {s}. ¿Cuál es el menor?',
            ta: 'அடுத்தடுத்த மூன்று முழு எண்களின் கூடுதல் {s}. அவற்றில் மிகச் சிறியது எது?',
          },
          hint: {
            en: 'Call them x, x + 1 and x + 2. Add them and set the total equal to {s}.',
            es: 'Llámalos x, x + 1 y x + 2. Súmalos e iguala el total a {s}.',
            ta: 'அவற்றை x, x + 1, x + 2 எனக் கொள்க. அவற்றைக் கூட்டி, கூடுதலை {s}-க்குச் சமமாக்குங்கள்.',
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
            en: 'Kavin is {k} years older than his sister Meena. Their ages add up to {s}. How old is Meena?',
            es: 'Kavin tiene {k} años más que su hermana Meena. Sus edades suman {s}. ¿Cuántos años tiene Meena?',
            ta: 'கவின் தன் தங்கை மீனாவை விட {k} வயது மூத்தவன். அவர்களின் வயதுகளின் கூடுதல் {s}. மீனாவின் வயது என்ன?',
          },
          hint: {
            en: "Let Meena's age be x. Then Kavin is x + {k}.",
            es: 'Sea x la edad de Meena. Entonces Kavin tiene x + {k}.',
            ta: 'மீனாவின் வயதை x எனக் கொள்க. அப்படியானால் கவினின் வயது x + {k}.',
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
            en: 'A rectangle is {k} cm longer than it is wide. Its perimeter is {p} cm. How wide is it, in cm?',
            es: 'Un rectángulo mide {k} cm más de largo que de ancho. Su perímetro es {p} cm. ¿Cuánto mide de ancho, en cm?',
            ta: 'ஒரு செவ்வகத்தின் நீளம் அதன் அகலத்தை விட {k} செ.மீ. அதிகம். அதன் சுற்றளவு {p} செ.மீ. அதன் அகலம் எத்தனை செ.மீ.?',
          },
          hint: {
            en: 'Let the width be x. The length is x + {k}. Perimeter = 2 × (length + width).',
            es: 'Sea x el ancho. El largo es x + {k}. Perímetro = 2 × (largo + ancho).',
            ta: 'அகலத்தை x எனக் கொள்க. நீளம் x + {k}. சுற்றளவு = 2 × (நீளம் + அகலம்).',
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
            en: 'Priya has ₹{a} and saves ₹{r} each week. Arun has ₹{b} and saves ₹{q} each week. After how many weeks will they have the same amount?',
            es: 'Priya tiene ₹{a} y ahorra ₹{r} cada semana. Arun tiene ₹{b} y ahorra ₹{q} cada semana. ¿Después de cuántas semanas tendrán la misma cantidad?',
            ta: 'பிரியாவிடம் ₹{a} உள்ளது, அவள் ஒவ்வொரு வாரமும் ₹{r} சேமிக்கிறாள். அருணிடம் ₹{b} உள்ளது, அவன் ஒவ்வொரு வாரமும் ₹{q} சேமிக்கிறான். எத்தனை வாரங்களுக்குப் பிறகு இருவரிடமும் ஒரே தொகை இருக்கும்?',
          },
          hint: {
            en: "After x weeks Priya has {a} + {r}x. Write Arun's amount the same way and set them equal.",
            es: 'Después de x semanas Priya tiene {a} + {r}x. Escribe la cantidad de Arun de la misma forma e iguálalas.',
            ta: 'x வாரங்களுக்குப் பிறகு பிரியாவிடம் {a} + {r}x இருக்கும். அருணின் தொகையையும் அதேபோல் எழுதி இரண்டையும் சமப்படுத்துங்கள்.',
          },
          solution: { en: '{a} + {r}x = {b} + {q}x\n{k}x = {diff}\nx = {w}' },
        },
      ],
    },
  ],
};
