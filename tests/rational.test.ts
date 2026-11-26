import { describe, expect, it } from 'vitest';
import { answerMatches, equal, frac, parseAnswer, show } from '../src/lib/rational';

describe('parseAnswer', () => {
  it.each([
    ['7', frac(7)],
    ['-3', frac(-3)],
    ['−3', frac(-3)],
    [' 12 ', frac(12)],
    ['2.5', frac(5, 2)],
    ['5/2', frac(5, 2)],
    ['-5/2', frac(-5, 2)],
    ['5/-2', frac(-5, 2)],
    ['10/4', frac(5, 2)],
    ['.5', frac(1, 2)],
    ['2,5', frac(5, 2)],
  ])('reads %s', (input, expected) => {
    const got = parseAnswer(input);
    expect(got).not.toBeNull();
    expect(equal(got!, expected)).toBe(true);
  });

  it.each(['', 'x', '1/0', '--2', '3x', '1/2/3'])('rejects %s', (input) => {
    expect(parseAnswer(input)).toBeNull();
  });

  it('shows fractions in lowest terms with a real minus', () => {
    expect(show(frac(-6, 4))).toBe('−3/2');
    expect(show(frac(8, 2))).toBe('4');
  });
});

describe('answerMatches', () => {
  it('accepts exact fractions and decimals', () => {
    expect(answerMatches('7/3', frac(7, 3))).toBe(true);
    expect(answerMatches('14/6', frac(7, 3))).toBe(true);
    expect(answerMatches('2.5', frac(5, 2))).toBe(true);
    expect(answerMatches('−2.5', frac(-5, 2))).toBe(true);
  });
  it('accepts decimals rounded or cut off to 2 or more places', () => {
    expect(answerMatches('2.33', frac(7, 3))).toBe(true);
    expect(answerMatches('2.333', frac(7, 3))).toBe(true);
    expect(answerMatches('2.67', frac(8, 3))).toBe(true);
    expect(answerMatches('2.66', frac(8, 3))).toBe(true);
    expect(answerMatches('−2.33', frac(-7, 3))).toBe(true);
  });
  it('rejects rough or wrong decimals', () => {
    expect(answerMatches('2.3', frac(7, 3))).toBe(false);
    expect(answerMatches('2.34', frac(7, 3))).toBe(false);
    expect(answerMatches('2.4', frac(5, 2))).toBe(false);
    expect(answerMatches('2.51', frac(5, 2))).toBe(false);
  });
});
