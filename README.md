# APAL: Adaptive Pathway App for Learning

Math practice that keeps students going between classes and tutor visits. Students start where they are, master skills one at a time, and get each mastered skill back for a quick review at growing intervals so it stays fresh. It works offline.

Live site: https://arnieftc.github.io/APAL/

## How it works

- **Skill map.** Each pathway is a set of small skills with prerequisites. A skill unlocks when its prerequisites are mastered.
- **Learning loop.** Lesson → practice with hints → mastery check (4 of 5, no hints) → spaced reviews.
- **Question banks.** Every question is a reviewed template whose numbers are generated fresh each time, like WebAssign. Answers can be integers, decimals or fractions (`5/2`).
- **Spaced review.** Mastered skills come back after 2, 5, 12, 30 and 60 days. A pass moves up an interval; a miss sends the skill to a short refresh and steps the interval back one, never to zero. Two misses in a row flag the skill's prerequisites for the teacher. At most 3 reviews per session, and only 1 after a long break.
- **Levels and honors.** XP for correct answers, mastery and reviews. The class leaderboard can be turned on or off by the teacher.
- **Live games.** From a class page the teacher can host a **live quiz** (everyone answers the same multiple-choice question; 100 points for an instant right answer, 0.5 less per second, 0 if wrong; the teacher sets the seconds per question) or a **category board** (the teacher picks the categories; whoever answers right fastest picks the next square). Students see a "Join the game" button on their phone.
- **Teachers' own questions.** Teachers can add questions to any skill, or make new topics with a short lesson. Their questions have fixed numbers and can have several answer boxes.
- **Languages.** English, Spanish and Tamil. Tamil uses plain, everyday words, keeping the maths terms from Tamil Nadu textbooks. Tamil and Spanish still need a check by a fluent reader.

## Accounts

- **Teachers** sign in with Google, create a class and get a 6-character class code.
- **Students** join with the class code, their first name and a password (6+ characters). No email needed. They need internet the first time; after that the app works offline and syncs when it reconnects.
- **Try without a class** keeps progress on the device only (no account). This is the basis for the fully offline facility version.

## Project layout

| Path | What's there |
| --- | --- |
| `src/content/` | Pathways, skills, lessons and question templates (`sevalaya.ts`, `coordinate.ts`, extra story questions in `extra.ts`, teachers' own questions in `custom.ts`) |
| `src/engine/` | Mastery, spaced review, XP, honors and live-game scoring (`live.ts`). `scheduler.ts` has the review settings, including `REVIEW_SCALE` |
| `src/store/` | Firebase classes and accounts, and progress storage (cloud or device-only) |
| `src/i18n/` | Interface text in each language |
| `src/screens/` | Learner and teacher screens |
| `firestore.rules` | Database security rules (paste into the Firebase console) |
| `tests/` | Tests for answer checking, every question template, and the review scheduler |

## Adding a skill

Add an entry to a pathway's `skills` list in `src/content/`, with a lesson, teacher notes and at least two templates. Each template's `gen` function returns the numbers for one question and its exact answer. Run `npm test`: it generates 500 questions per template and checks every placeholder in every language and every answer.

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm test
npm run build
```

Pushing to `main` runs the tests and deploys to GitHub Pages.

## Changing review timing

In `src/engine/scheduler.ts`, set `REVIEW_SCALE` above 1 to space reviews further apart, or below 1 to bring them back sooner.
