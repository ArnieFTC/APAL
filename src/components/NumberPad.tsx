import { useEffect, useRef, useState } from 'react';
import { press as onPress } from './press';

const KEYS = ['7', '8', '9', '⌫', '4', '5', '6', '/', '1', '2', '3', '−', '0', '.'];

/**
 * On-screen keypad so learners never need the phone keyboard (which often hides "/" and "−").
 * Answers with several parts (a point's x and y) get one box each; tap a box to fill it.
 * A physical keyboard works too: Tab or the arrow keys move between boxes.
 */
export function NumberPad(props: {
  values: string[];
  labels: string[];
  onChange(v: string[]): void;
  onSubmit(values: string[]): void;
  disabled?: boolean;
  submitLabel: string;
  nextLabel: string;
}) {
  const { values, labels, onChange, onSubmit, disabled, submitLabel, nextLabel } = props;
  const [active, setActive] = useState(0);
  // Track the latest values so quick key presses before a re-render aren't lost.
  const current = useRef(values);
  current.current = values;
  const activeRef = useRef(active);
  activeRef.current = active;

  const allFilled = values.every((v) => v !== '');

  const press = (key: string) => {
    if (disabled) return;
    const i = activeRef.current;
    const next = [...current.current];
    const v = next[i] ?? '';
    next[i] = key === '⌫' ? v.slice(0, -1) : v.length < 12 ? v + key : v;
    current.current = next;
    onChange(next);
  };

  const move = (step: number) => setActive((i) => (i + step + labels.length) % labels.length);

  /** Submits when every box is filled; otherwise moves on to the next empty box. */
  const go = () => {
    const vals = current.current;
    if (vals.every((v) => v !== '')) return onSubmit(vals);
    if (!vals[activeRef.current]) return;
    for (let k = 1; k <= labels.length; k++) {
      const j = (activeRef.current + k) % labels.length;
      if (!vals[j]) return setActive(j);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9./]$/.test(e.key)) press(e.key);
      else if (e.key === '-') press('−');
      else if (e.key === 'Backspace') press('⌫');
      else if (e.key === 'Enter') go();
      else if (labels.length > 1 && (e.key === 'Tab' || e.key === 'ArrowRight')) move(e.shiftKey ? -1 : 1);
      else if (labels.length > 1 && e.key === 'ArrowLeft') move(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="pad">
      {labels.length === 1 ? (
        <div className="pad-display" aria-live="polite">
          {values[0] || <span className="pad-placeholder">{labels[0]} =</span>}
        </div>
      ) : (
        <div className="pad-fields" style={{ gridTemplateColumns: `repeat(${labels.length}, 1fr)` }}>
          {labels.map((label, i) => (
            <button
              key={label}
              type="button"
              className={i === active ? 'pad-field active' : 'pad-field'}
              {...onPress(() => setActive(i))}
              aria-pressed={i === active}
              aria-label={label}
            >
              <span className="pad-field-label">{label} =</span>
              <span className="pad-field-value">{values[i] || ' '}</span>
            </button>
          ))}
        </div>
      )}
      <div className="pad-grid">
        {KEYS.map((k) => (
          <button key={k} type="button" className={k === '⌫' ? 'pad-key pad-key-muted' : 'pad-key'} {...onPress(() => press(k))} disabled={disabled} aria-label={k === '⌫' ? 'Delete' : k}>
            {k}
          </button>
        ))}
        <button type="button" className="pad-key pad-submit" {...onPress(go)} disabled={disabled || (!allFilled && !values[active])}>
          {allFilled || labels.length === 1 ? submitLabel : nextLabel}
        </button>
      </div>
    </div>
  );
}
