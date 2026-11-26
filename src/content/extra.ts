import { frac } from '../lib/rational';
import { linear, num } from '../lib/format';
import type { Template } from './types';

/**
 * More question types for each skill, mostly everyday stories, so practice doesn't feel like
 * the same question over and over. Added to the end of each skill's templates.
 */

const pt = (x: number, y: number) => `(${num(x)}, ${num(y)})`;

export const extraTemplates: Record<string, Template[]> = {
  'two-step': [
    {
      id: 'two-step-apples',
      gen(r) {
        const n = r.int(3, 9);
        const x = r.int(8, 30);
        const b = r.int(5, 20);
        const c = n * x + b;
        return { vars: { n, b, c, rest: c - b, x }, answer: frac(x) };
      },
      prompt: {
        en: 'At the market you buy {n} apples and a cloth bag for ₹{b}. You pay ₹{c} in all. How much does one apple cost, in ₹?',
        es: 'En el mercado compras {n} manzanas y una bolsa de tela de ₹{b}. Pagas ₹{c} en total. ¿Cuánto cuesta una manzana, en ₹?',
        ta: 'சந்தையில் {n} ஆப்பிள்களும், ₹{b}-க்கு ஒரு துணிப் பையும் வாங்குகிறீர்கள். மொத்தம் ₹{c} கொடுக்கிறீர்கள். ஒரு ஆப்பிள் விலை எத்தனை ரூபாய்?',
      },
      hint: {
        en: 'Let x be the price of one apple. Then {n}x + {b} = {c}.',
        es: 'Sea x el precio de una manzana. Entonces {n}x + {b} = {c}.',
        ta: 'ஒரு ஆப்பிள் விலையை x என்று வையுங்கள். அப்போது {n}x + {b} = {c}.',
      },
      solution: { en: '{n}x + {b} = {c}\n{n}x = {rest}\nx = {x}' },
    },
    {
      id: 'two-step-cricket',
      gen(r) {
        const n = r.int(3, 6);
        const x = r.int(8, 40);
        const b = r.int(4, 18);
        const c = n * x + b;
        return { vars: { n, b, c, rest: c - b, x }, answer: frac(x) };
      },
      prompt: {
        en: 'A cricket team scored {c} runs. {b} of those runs were extras (wides and no-balls). The rest were scored by {n} batters, and each of them scored the same number of runs. How many runs did each batter score?',
        es: 'Un equipo de críquet anotó {c} carreras. {b} fueron extras. El resto lo hicieron {n} bateadores que anotaron lo mismo cada uno. ¿Cuántas carreras anotó cada bateador?',
        ta: 'ஒரு கிரிக்கெட் அணி {c} ரன் எடுத்தது. அதில் {b} ரன் உதிரி (extras). மீதி ரன்களை {n} பேட்ஸ்மேன்கள் ஆளுக்குச் சமமாக எடுத்தார்கள். ஒவ்வொருவரும் எத்தனை ரன்?',
      },
      hint: {
        en: 'Let x be the runs for one batter. Then {n}x + {b} = {c}.',
        es: 'Sea x las carreras de un bateador. Entonces {n}x + {b} = {c}.',
        ta: 'ஒருவர் எடுத்த ரன்களை x என்று வையுங்கள். அப்போது {n}x + {b} = {c}.',
      },
      solution: { en: '{n}x + {b} = {c}\n{n}x = {rest}\nx = {x}' },
    },
    {
      id: 'two-step-puzzle',
      gen(r) {
        const a = r.int(2, 9);
        const b = r.int(2, 20);
        const x = r.nonzero(-10, 15);
        const c = a * x - b;
        return { vars: { a, b, c: num(c), cb: num(c + b), x: num(x) }, answer: frac(x) };
      },
      prompt: {
        en: 'Meena thinks of a number. She multiplies it by {a}, then subtracts {b}. She gets {c}. What was her number?',
        es: 'Meena piensa en un número. Lo multiplica por {a} y luego resta {b}. Obtiene {c}. ¿Qué número pensó?',
        ta: 'மீனா ஒரு எண்ணை நினைக்கிறாள். அதை {a}-ஆல் பெருக்கி, பிறகு {b} கழிக்கிறாள். அவளுக்கு {c} கிடைக்கிறது. அவள் நினைத்த எண் என்ன?',
      },
      hint: {
        en: 'Write it as {a}x − {b} = {c}. Undo the steps backwards: add {b} first, then divide by {a}.',
        es: 'Escríbelo como {a}x − {b} = {c}. Deshaz los pasos al revés: primero suma {b}, luego divide entre {a}.',
        ta: '{a}x − {b} = {c} என்று எழுதுங்கள். பின்னாலிருந்து நீக்குங்கள்: முதலில் {b} கூட்டுங்கள், பிறகு {a}-ஆல் வகுங்கள்.',
      },
      solution: { en: '{a}x − {b} = {c}\n{a}x = {cb}\nx = {x}' },
    },
    {
      id: 'two-step-temperature',
      gen(r) {
        const t0 = r.int(8, 15);
        const a = r.int(2, 3);
        const x = r.int(2, 6);
        const t1 = t0 + a * x;
        return { vars: { t0, a, t1, rise: t1 - t0, x }, answer: frac(x) };
      },
      prompt: {
        en: 'In Ooty it was {t0}°C at 6 am. It got {a}°C warmer every hour and reached {t1}°C. How many hours after 6 am was that?',
        es: 'En Ooty hacía {t0}°C a las 6 de la mañana. Subió {a}°C cada hora y llegó a {t1}°C. ¿Cuántas horas después de las 6 fue?',
        ta: 'ஊட்டியில் காலை 6 மணிக்கு {t0}°C. ஒவ்வொரு மணி நேரமும் {a}°C கூடி, {t1}°C ஆனது. காலை 6 மணியிலிருந்து எத்தனை மணி நேரம் ஆனது?',
      },
      hint: {
        en: 'Let x be the hours. Then {t0} + {a}x = {t1}.',
        es: 'Sea x el número de horas. Entonces {t0} + {a}x = {t1}.',
        ta: 'மணி நேரத்தை x என்று வையுங்கள். அப்போது {t0} + {a}x = {t1}.',
      },
      solution: { en: '{t0} + {a}x = {t1}\n{a}x = {rise}\nx = {x}' },
    },
    {
      id: 'two-step-pens',
      gen(r) {
        const b = r.int(20, 60);
        const p = r.int(5, 15);
        const x = r.int(2, 10);
        const c = b + p * x;
        return { vars: { b, p, c, rest: c - b, x }, answer: frac(x) };
      },
      prompt: {
        en: 'Selvi has ₹{c}. She buys a notebook for ₹{b} and spends the rest on pens that cost ₹{p} each. How many pens does she buy?',
        es: 'Selvi tiene ₹{c}. Compra un cuaderno de ₹{b} y gasta el resto en bolígrafos de ₹{p} cada uno. ¿Cuántos bolígrafos compra?',
        ta: 'செல்வியிடம் ₹{c} இருக்கிறது. ₹{b}-க்கு ஒரு நோட்டு வாங்குகிறாள். மீதிப் பணத்தில் ₹{p} விலையுள்ள பேனாக்கள் வாங்குகிறாள். எத்தனை பேனாக்கள்?',
      },
      hint: {
        en: 'Let x be the number of pens. Then {b} + {p}x = {c}.',
        es: 'Sea x el número de bolígrafos. Entonces {b} + {p}x = {c}.',
        ta: 'பேனாக்களின் எண்ணிக்கையை x என்று வையுங்கள். அப்போது {b} + {p}x = {c}.',
      },
      solution: { en: '{b} + {p}x = {c}\n{p}x = {rest}\nx = {x}' },
    },
  ],

  'both-sides': [
    {
      id: 'both-sides-puzzle',
      gen(r) {
        let a = 0;
        let c = 0;
        while (a <= c) {
          a = r.int(2, 9);
          c = r.int(1, 8);
        }
        const x = r.int(-8, 12);
        const b = r.int(-10, 20);
        const d = (a - c) * x + b;
        return {
          vars: { a, b: num(b), c, d: num(d), lhs: linear(a, b), rhs: linear(c, d), k: a - c, dmb: num(d - b), x: num(x) },
          answer: frac(x),
        };
      },
      prompt: {
        en: 'Think of a number. Multiply it by {a} and add {b}. You get the same answer as when you multiply the number by {c} and add {d}. What is the number?',
        es: 'Piensa en un número. Multiplícalo por {a} y suma {b}. Obtienes lo mismo que si lo multiplicas por {c} y sumas {d}. ¿Cuál es el número?',
        ta: 'ஒரு எண்ணை {a}-ஆல் பெருக்கி {b} கூட்டினாலும், அதே எண்ணை {c}-ஆல் பெருக்கி {d} கூட்டினாலும் ஒரே விடை வருகிறது. அந்த எண் என்ன?',
      },
      hint: {
        en: 'Write {lhs} = {rhs}. Then get all the x’s on one side by taking away the smaller x part from both sides.',
        es: 'Escribe {lhs} = {rhs}. Luego junta todas las x en un lado quitando la parte con x más pequeña de ambos lados.',
        ta: '{lhs} = {rhs} என்று எழுதி, x-களை ஒரு பக்கம் கொண்டு வாருங்கள்.',
      },
      solution: { en: '{lhs} = {rhs}\n{k}x = {dmb}\nx = {x}' },
    },
    {
      id: 'both-sides-tanks',
      gen(r) {
        const c = r.int(2, 6);
        const a = c + r.int(2, 6);
        const x = r.int(3, 15);
        const b = 10 * r.int(1, 6);
        const d = b + (a - c) * x;
        return { vars: { a, b, c, d, k: a - c, dmb: d - b, x }, answer: frac(x) };
      },
      prompt: {
        en: 'Tank A has {b} litres of water, and {a} more litres go into it every minute. Tank B has {d} litres, and {c} more litres go into it every minute. After how many minutes will both tanks have the same amount of water?',
        es: 'El tanque A tiene {b} litros de agua y le entran {a} litros más cada minuto. El tanque B tiene {d} litros y le entran {c} litros más cada minuto. ¿Después de cuántos minutos tendrán los dos la misma cantidad de agua?',
        ta: 'தொட்டி A-யில் {b} லிட்டர் தண்ணீர் இருக்கிறது. ஒவ்வொரு நிமிடமும் அதில் {a} லிட்டர் கூடுதலாக வருகிறது. தொட்டி B-யில் {d} லிட்டர் இருக்கிறது. ஒவ்வொரு நிமிடமும் அதில் {c} லிட்டர் கூடுதலாக வருகிறது. எத்தனை நிமிடம் கழித்து இரண்டிலும் ஒரே அளவு தண்ணீர் இருக்கும்?',
      },
      hint: {
        en: 'After x minutes A has {b} + {a}x. Write B the same way and set them equal.',
        es: 'Después de x minutos A tiene {b} + {a}x. Escribe B igual e iguálalos.',
        ta: 'x நிமிடம் கழித்து A-யில் {b} + {a}x. B-க்கும் அதேபோல் எழுதி, இரண்டையும் சமமாக்குங்கள்.',
      },
      solution: { en: '{b} + {a}x = {d} + {c}x\n{k}x = {dmb}\nx = {x}' },
    },
    {
      id: 'both-sides-spending',
      gen(r) {
        const c = 5 * r.int(2, 6);
        const a = c + 5 * r.int(1, 4);
        const x = r.int(2, 10);
        // Lata still has money left on that day.
        const d = c * x + 10 * r.int(2, 20);
        const b = d + (a - c) * x;
        return { vars: { a, b, c, d, k: a - c, bmd: b - d, x }, answer: frac(x) };
      },
      prompt: {
        en: 'Kumar has ₹{b} and spends ₹{a} of it every day. Lata has ₹{d} and spends ₹{c} of it every day. After how many days will they both have the same amount of money left?',
        es: 'Kumar tiene ₹{b} y gasta ₹{a} al día. Lata tiene ₹{d} y gasta ₹{c} al día. ¿Después de cuántos días les quedará lo mismo?',
        ta: 'குமாரிடம் ₹{b} இருக்கிறது, தினமும் ₹{a} செலவு செய்கிறான். லதாவிடம் ₹{d} இருக்கிறது, தினமும் ₹{c} செலவு செய்கிறாள். எத்தனை நாள் கழித்து இருவரிடமும் ஒரே அளவு பணம் மீதி இருக்கும்?',
      },
      hint: {
        en: 'After x days Kumar has {b} − {a}x and Lata has {d} − {c}x. Set them equal.',
        es: 'Después de x días Kumar tiene {b} − {a}x y Lata {d} − {c}x. Iguálalos.',
        ta: 'x நாள் கழித்து குமாரிடம் {b} − {a}x, லதாவிடம் {d} − {c}x. இரண்டையும் சமமாக்குங்கள்.',
      },
      solution: { en: '{b} − {a}x = {d} − {c}x\n{bmd} = {k}x\nx = {x}' },
    },
    {
      id: 'both-sides-candles',
      gen(r) {
        const c = 1;
        const a = r.int(2, 4);
        const x = r.int(2, 6);
        const d = r.int(8, 14);
        const b = d + (a - c) * x;
        return { vars: { a, b, d, k: a - c, bmd: b - d, x, h: d - x }, answer: frac(x) };
      },
      prompt: {
        en: 'Candle A is {b} cm tall, and as it burns it gets {a} cm shorter every hour. Candle B is {d} cm tall and gets 1 cm shorter every hour. After how many hours will both candles be the same height?',
        es: 'La vela A mide {b} cm y, al quemarse, se acorta {a} cm cada hora. La vela B mide {d} cm y se acorta 1 cm cada hora. ¿Después de cuántas horas medirán lo mismo?',
        ta: 'மெழுகுவர்த்தி A {b} செ.மீ. உயரம். எரியும்போது ஒவ்வொரு மணி நேரமும் {a} செ.மீ. குறைகிறது. மெழுகுவர்த்தி B {d} செ.மீ. உயரம், ஒவ்வொரு மணி நேரமும் 1 செ.மீ. குறைகிறது. எத்தனை மணி நேரம் கழித்து இரண்டும் ஒரே உயரம் ஆகும்?',
      },
      hint: {
        en: 'After x hours, A is {b} − {a}x tall and B is {d} − x tall. Set them equal.',
        es: 'Después de x horas, A mide {b} − {a}x y B mide {d} − x. Iguálalos.',
        ta: 'x மணி நேரம் கழித்து A-வின் உயரம் {b} − {a}x, B-யின் உயரம் {d} − x. இரண்டையும் சமமாக்குங்கள்.',
      },
      solution: { en: '{b} − {a}x = {d} − x\n{bmd} = {k}x\nx = {x}\nBoth are {h} cm tall.' },
    },
  ],

  brackets: [
    {
      id: 'brackets-negative',
      gen(r) {
        const a = -r.int(2, 6);
        const b = r.nonzero(-7, 7);
        const x = r.int(-8, 8);
        const c = a * (x + b);
        return {
          vars: { eq: `${num(a)}(${linear(1, b)}) = ${num(c)}`, a: num(a), expanded: linear(a, a * b), c: num(c), cab: num(c - a * b), x: num(x) },
          answer: frac(x),
        };
      },
      prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
      hint: {
        en: 'Multiply everything inside by {a}. Careful: a minus times a minus is a plus.',
        es: 'Multiplica todo lo de adentro por {a}. Cuidado: menos por menos es más.',
        ta: 'உள்ளே உள்ள எல்லாவற்றையும் {a}-ஆல் பெருக்குங்கள். கவனம்: குறை × குறை = மிகை.',
      },
      solution: { en: '{eq}\n{expanded} = {c}\n{a}x = {cab}\nx = {x}' },
    },
    {
      id: 'brackets-two',
      gen(r) {
        const a = r.int(2, 5);
        const c = r.int(2, 5);
        const b = r.nonzero(-6, 6);
        const d = r.nonzero(-6, 6);
        const x = r.int(-6, 8);
        const e = a * (x + b) + c * (x + d);
        return {
          vars: {
            eq: `${a}(${linear(1, b)}) + ${c}(${linear(1, d)}) = ${num(e)}`,
            expanded: `${linear(a, a * b)} + ${linear(c, c * d)}`,
            joined: linear(a + c, a * b + c * d),
            e: num(e),
            k: a + c,
            rest: num(e - a * b - c * d),
            x: num(x),
          },
          answer: frac(x),
        };
      },
      prompt: { en: 'Solve for x:\n{eq}', es: 'Resuelve para x:\n{eq}', ta: 'x-ஐக் கண்டுபிடியுங்கள்:\n{eq}' },
      hint: {
        en: 'Open both brackets. Then add the x’s together, and add the plain numbers together.',
        es: 'Abre los dos paréntesis. Luego suma las x entre sí, y los números solos entre sí.',
        ta: 'இரண்டு அடைப்பையும் திறந்து பெருக்குங்கள். பிறகு x-களை ஒன்றாகவும், தனி எண்களை ஒன்றாகவும் கூட்டுங்கள்.',
      },
      solution: { en: '{eq}\n{expanded} = {e}\n{joined} = {e}\n{k}x = {rest}\nx = {x}' },
    },
    {
      id: 'brackets-friends',
      gen(r) {
        const n = r.int(3, 8);
        const b = r.int(15, 40);
        const x = r.int(5, 20);
        const c = n * (x + b);
        return { vars: { n, b, c, each: c / n, x }, answer: frac(x) };
      },
      prompt: {
        en: '{n} friends each buy one pen and one ₹{b} notebook. Together they spend ₹{c}. How much does one pen cost, in ₹?',
        es: '{n} amigos compran cada uno un bolígrafo y un cuaderno de ₹{b}. Juntos gastan ₹{c}. ¿Cuánto cuesta un bolígrafo, en ₹?',
        ta: '{n} நண்பர்கள் ஒவ்வொருவரும் ஒரு பேனாவும் ₹{b} நோட்டும் வாங்குகிறார்கள். மொத்தம் ₹{c} செலவு. ஒரு பேனா விலை எத்தனை ரூபாய்?',
      },
      hint: {
        en: 'Each friend spends x + {b}. So {n}(x + {b}) = {c}.',
        es: 'Cada amigo gasta x + {b}. Así que {n}(x + {b}) = {c}.',
        ta: 'ஒவ்வொருவரும் x + {b} செலவு செய்கிறார்கள். அதனால் {n}(x + {b}) = {c}.',
      },
      solution: { en: '{n}(x + {b}) = {c}\nx + {b} = {each}\nx = {x}' },
    },
    {
      id: 'brackets-area',
      gen(r) {
        const a = r.int(3, 9);
        const b = r.int(2, 8);
        const x = r.int(2, 12);
        const c = a * (x + b);
        return { vars: { a, b, c, len: x + b, x }, answer: frac(x) };
      },
      prompt: {
        en: 'A rectangle is {a} cm wide and (x + {b}) cm long. Its area is {c} cm². Find x.',
        es: 'Un rectángulo mide {a} cm de ancho y (x + {b}) cm de largo. Su área es {c} cm². Halla x.',
        ta: 'ஒரு செவ்வகத்தின் அகலம் {a} செ.மீ., நீளம் (x + {b}) செ.மீ. அதன் பரப்பு {c} செ.மீ.². x-ஐக் கண்டுபிடியுங்கள்.',
      },
      hint: {
        en: 'Area = width × length, so {a}(x + {b}) = {c}.',
        es: 'Área = ancho × largo, así que {a}(x + {b}) = {c}.',
        ta: 'பரப்பு = அகலம் × நீளம். அதனால் {a}(x + {b}) = {c}.',
      },
      solution: { en: '{a}(x + {b}) = {c}\nx + {b} = {len}\nx = {x}' },
    },
  ],

  'word-problems': [
    {
      id: 'word-coins',
      gen(r) {
        const x = r.int(3, 20);
        const s = 9 * x;
        return { vars: { s, x, twice: 2 * x }, answer: frac(x) };
      },
      prompt: {
        en: 'Anu has some ₹5 coins. She has twice as many ₹2 coins as ₹5 coins. All her coins together are worth ₹{s}. How many ₹5 coins does she have?',
        es: 'Anu tiene algunas monedas de ₹5 y el doble de monedas de ₹2. En total tiene ₹{s}. ¿Cuántas monedas de ₹5 tiene?',
        ta: 'அனுவிடம் சில ₹5 நாணயங்களும், அதைப் போல் இரண்டு மடங்கு ₹2 நாணயங்களும் உள்ளன. மொத்தம் ₹{s}. அவளிடம் எத்தனை ₹5 நாணயங்கள்?',
      },
      hint: {
        en: 'Let x be the ₹5 coins, so there are 2x ₹2 coins. Their value: 5x + 2(2x) = {s}.',
        es: 'Sea x el número de monedas de ₹5; hay 2x de ₹2. Su valor: 5x + 2(2x) = {s}.',
        ta: '₹5 நாணயங்களை x என்று வையுங்கள். அப்போது ₹2 நாணயங்கள் 2x. மதிப்பு: 5x + 2(2x) = {s}.',
      },
      solution: { en: '5x + 2(2x) = {s}\n9x = {s}\nx = {x}' },
    },
    {
      id: 'word-tickets',
      gen(r) {
        const c = 10 * r.int(2, 5);
        const a = c + 10 * r.int(1, 4);
        const n = r.int(3, 15);
        const x = r.int(5, 30);
        const t = a * x + c * (x + n);
        return { vars: { a, c, n, t, k: a + c, cn: c * n, rest: t - c * n, x }, answer: frac(x) };
      },
      prompt: {
        en: 'Tickets for a school show cost ₹{a} for each adult and ₹{c} for each child. {n} more children came than adults. The school got ₹{t} from tickets in total. How many adults came?',
        es: 'Las entradas de una función escolar cuestan ₹{a} por adulto y ₹{c} por niño. Vinieron {n} niños más que adultos. La escuela recibió ₹{t} en total por las entradas. ¿Cuántos adultos vinieron?',
        ta: 'பள்ளி நிகழ்ச்சிக்குப் பெரியவர்களுக்கு டிக்கெட் ₹{a}, குழந்தைகளுக்கு ₹{c}. பெரியவர்களை விட {n} குழந்தைகள் அதிகம் வந்தார்கள். மொத்தம் ₹{t} வசூல் ஆனது. எத்தனை பெரியவர்கள் வந்தார்கள்?',
      },
      hint: {
        en: 'Let x be the adults, so x + {n} children came. Then {a}x + {c}(x + {n}) = {t}.',
        es: 'Sea x el número de adultos; vinieron x + {n} niños. Entonces {a}x + {c}(x + {n}) = {t}.',
        ta: 'பெரியவர்களை x என்று வையுங்கள். குழந்தைகள் x + {n}. அப்போது {a}x + {c}(x + {n}) = {t}.',
      },
      solution: { en: '{a}x + {c}(x + {n}) = {t}\n{k}x + {cn} = {t}\n{k}x = {rest}\nx = {x}' },
    },
    {
      id: 'word-father',
      gen(r) {
        const k = r.int(3, 5);
        const x = r.int(6, 14);
        const y = r.int(2, 10);
        const s = (k + 1) * x + 2 * y;
        return { vars: { k, y, s, k1: k + 1, y2: 2 * y, rest: s - 2 * y, x }, answer: frac(x) };
      },
      prompt: {
        en: 'A father is {k} times as old as his son. {y} years from now, their two ages added together will be {s}. How old is the son now?',
        es: 'Un padre tiene {k} veces la edad de su hijo. Dentro de {y} años, sus edades sumarán {s}. ¿Cuántos años tiene ahora el hijo?',
        ta: 'அப்பாவின் வயது மகனின் வயதைப் போல் {k} மடங்கு. {y} வருடம் கழித்து இருவர் வயதையும் கூட்டினால் {s}. இப்போது மகனுக்கு என்ன வயது?',
      },
      hint: {
        en: 'Now: son x, father {k}x. In {y} years: x + {y} and {k}x + {y}. Add them and set equal to {s}.',
        es: 'Ahora: hijo x, padre {k}x. Dentro de {y} años: x + {y} y {k}x + {y}. Súmalas e iguala a {s}.',
        ta: 'இப்போது மகன் x, அப்பா {k}x. {y} வருடம் கழித்து x + {y}, {k}x + {y}. இரண்டையும் கூட்டி {s}-க்குச் சமமாக்குங்கள்.',
      },
      solution: { en: '(x + {y}) + ({k}x + {y}) = {s}\n{k1}x + {y2} = {s}\n{k1}x = {rest}\nx = {x}' },
    },
    {
      id: 'word-triangle',
      gen(r) {
        // k must be a multiple of 4 so the first angle is a whole number.
        const k = 4 * r.int(2, 15);
        const x = (180 - k) / 4;
        return { vars: { k, rest: 180 - k, x, second: x + k, third: 2 * x }, answer: frac(x) };
      },
      prompt: {
        en: 'In a triangle, the second angle is {k}° more than the first, and the third angle is twice the first. Find the first angle, in degrees.',
        es: 'En un triángulo, el segundo ángulo mide {k}° más que el primero, y el tercero es el doble del primero. Halla el primer ángulo, en grados.',
        ta: 'ஒரு முக்கோணத்தில் இரண்டாவது கோணம் முதல் கோணத்தை விட {k}° அதிகம். மூன்றாவது கோணம் முதல் கோணத்தின் இரண்டு மடங்கு. முதல் கோணம் எத்தனை டிகிரி?',
      },
      hint: {
        en: 'The angles are x, x + {k} and 2x. The angles of a triangle add up to 180°.',
        es: 'Los ángulos son x, x + {k} y 2x. Los ángulos de un triángulo suman 180°.',
        ta: 'கோணங்கள் x, x + {k}, 2x. முக்கோணத்தின் மூன்று கோணங்களைக் கூட்டினால் 180°.',
      },
      solution: { en: 'x + (x + {k}) + 2x = 180\n4x + {k} = 180\n4x = {rest}\nx = {x}' },
    },
    {
      id: 'word-buses',
      gen(r) {
        const a = 5 * r.int(1, 4);
        const h = r.int(2, 4);
        const x = 5 * r.int(6, 12);
        const d = h * (2 * x + a);
        return { vars: { a, h, d, sum: d / h, two: d / h - a, x }, answer: frac(x) };
      },
      prompt: {
        en: 'Two buses leave Chennai at the same time and drive in opposite directions. Every hour, one bus goes {a} km more than the other. After {h} hours they are {d} km apart. How many km does the slower bus go in one hour?',
        es: 'Dos autobuses salen de Chennai a la vez en direcciones opuestas. Cada hora, uno recorre {a} km más que el otro. Después de {h} horas están a {d} km uno del otro. ¿Cuántos km recorre en una hora el autobús más lento?',
        ta: 'இரண்டு பேருந்துகள் ஒரே நேரத்தில் சென்னையிலிருந்து எதிர் எதிர்த் திசையில் புறப்படுகின்றன. ஒன்று மற்றதை விட மணிக்கு {a} கி.மீ. வேகம் அதிகம். {h} மணி நேரம் கழித்து இரண்டுக்கும் இடையே {d} கி.மீ. மெதுவான பேருந்தின் வேகம் மணிக்கு எத்தனை கி.மீ.?',
      },
      hint: {
        en: 'Speeds: x and x + {a}. Each hour they move apart by x + (x + {a}). So {h}(2x + {a}) = {d}.',
        es: 'Velocidades: x y x + {a}. Cada hora se separan x + (x + {a}). Así que {h}(2x + {a}) = {d}.',
        ta: 'வேகங்கள் x, x + {a}. ஒவ்வொரு மணி நேரமும் x + (x + {a}) கி.மீ. விலகுகின்றன. அதனால் {h}(2x + {a}) = {d}.',
      },
      solution: { en: '{h}(2x + {a}) = {d}\n2x + {a} = {sum}\n2x = {two}\nx = {x}' },
    },
  ],

  midpoint: [
    {
      id: 'midpoint-map',
      fields: ['x', 'y'],
      gen(r) {
        const x1 = r.int(0, 10);
        const y1 = r.int(0, 10);
        const x2 = x1 + 2 * r.nonzero(-5, 5);
        const y2 = y1 + 2 * r.int(-5, 5);
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        return { vars: { A: pt(x1, y1), B: pt(x2, y2), mx: num(mx), my: num(my), x1, y1, x2, y2 }, answer: [frac(mx), frac(my)] };
      },
      prompt: {
        en: "On a map grid, Kavya's house is at {A} and her school is at {B}. A shop is exactly halfway between them. Where is the shop?",
        es: 'En un mapa con cuadrícula, la casa de Kavya está en {A} y su escuela en {B}. Una tienda está justo a la mitad. ¿Dónde está la tienda?',
        ta: 'ஒரு வரைபடத்தில் காவ்யாவின் வீடு {A}, அவள் பள்ளி {B}. இரண்டுக்கும் சரியாக நடுவில் ஒரு கடை இருக்கிறது. கடை எங்கே?',
      },
      hint: {
        en: 'Halfway means the midpoint: add the x-values and halve, then add the y-values and halve.',
        es: 'A la mitad significa el punto medio: suma los valores de x y divide entre 2; luego los de y.',
        ta: 'நடுவில் என்றால் நடுப்புள்ளி: x-களைக் கூட்டி 2-ஆல் வகுங்கள், பிறகு y-களுக்கும் அதேபோல்.',
      },
      solution: { en: 'x = ({x1} + {x2}) / 2 = {mx}\ny = ({y1} + {y2}) / 2 = {my}\nShop: ({mx}, {my})' },
    },
  ],

  distance: [
    {
      id: 'distance-map',
      fields: ['d'],
      gen(r) {
        const [a, b, c] = r.pick([
          [3, 4, 5],
          [6, 8, 10],
          [5, 12, 13],
        ]);
        const x1 = r.int(0, 6);
        const y1 = r.int(0, 6);
        const x2 = x1 + a;
        const y2 = y1 + b;
        return { vars: { A: pt(x1, y1), B: pt(x2, y2), a, b, sum: c * c, d: c }, answer: frac(c) };
      },
      prompt: {
        en: 'On a village map, each square is 1 km. The temple is at {A} and the well is at {B}. How far apart are they in a straight line, in km?',
        es: 'En el mapa de un pueblo, cada cuadro mide 1 km. El templo está en {A} y el pozo en {B}. ¿Qué distancia hay en línea recta, en km?',
        ta: 'ஒரு கிராம வரைபடத்தில் ஒவ்வொரு கட்டமும் 1 கி.மீ. கோயில் {A}-இல், கிணறு {B}-இல். நேர்க்கோட்டில் இரண்டுக்கும் இடையே எத்தனை கி.மீ.?',
      },
      hint: {
        en: 'Across: {a} km. Up: {b} km. d = √({a}² + {b}²).',
        es: 'De lado: {a} km. Hacia arriba: {b} km. d = √({a}² + {b}²).',
        ta: 'பக்கவாட்டில் {a} கி.மீ., மேலே {b} கி.மீ. d = √({a}² + {b}²).',
      },
      solution: { en: 'd = √({a}² + {b}²)\nd = √{sum} = {d}' },
    },
  ],

  circle: [
    {
      id: 'circle-sprinkler',
      fields: ['h', 'k', 'r²'],
      display: ([h, k, r2]) => {
        const sq = (l: string, c: number) => (c === 0 ? `${l}²` : `(${l} ${c > 0 ? '−' : '+'} ${Math.abs(c)})²`);
        return `${sq('x', h.n)} + ${sq('y', k.n)} = ${r2.n}`;
      },
      gen(r) {
        const h = r.int(1, 9);
        const k = r.int(1, 9);
        const rad = r.int(2, 8);
        return {
          vars: { C: pt(h, k), h, k, r: rad, r2: rad * rad, eq: `(x − ${h})² + (y − ${k})² = ${rad * rad}` },
          answer: [frac(h), frac(k), frac(rad * rad)],
        };
      },
      prompt: {
        en: 'A water sprinkler in a garden is at {C}. It wets the ground up to {r} m away in every direction, so the edge of the wet ground is a circle.\nWrite it as (x − h)² + (y − k)² = r²\nEnter h, k and r².',
        es: 'Un aspersor en {C} riega todo hasta {r} m de distancia. El borde de la zona mojada es una circunferencia.\nEscríbela como (x − h)² + (y − k)² = r²\nEscribe h, k y r².',
        ta: '{C}-இல் உள்ள ஒரு தண்ணீர் தெளிப்பான், {r} மீ. தூரம் வரை நனைக்கிறது. நனைந்த பகுதியின் ஓரம் ஒரு வட்டம்.\n(x − h)² + (y − k)² = r² என்று எழுதுங்கள்.\nh, k, r² என்ன?',
      },
      hint: {
        en: 'The sprinkler is the center and {r} m is the radius. Square the radius.',
        es: 'El aspersor es el centro y {r} m es el radio. Eleva el radio al cuadrado.',
        ta: 'தெளிப்பான் தான் மையம், {r} மீ. தான் ஆரம். ஆரத்தை வர்க்கம் செய்யுங்கள்.',
      },
      solution: { en: 'h = {h}, k = {k}, r² = {r}² = {r2}\n{eq}' },
    },
  ],
};

/** Adds the extra question types to each skill. */
export const withExtras = <S extends { id: string; templates: Template[] }>(skills: S[]): S[] =>
  skills.map((s) => (extraTemplates[s.id] ? { ...s, templates: [...s.templates, ...extraTemplates[s.id]] } : s));
