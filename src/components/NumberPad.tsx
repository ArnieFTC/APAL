import { useEffect, useRef } from 'react';

const KEYS = ['7', '8', '9', '⌫', '4', '5', '6', '/', '1', '2', '3', '−', '0', '.'];

/**
 * On-screen keypad so learners never need the phone keyboard (which often hides "/" and "−").
 * A physical keyboard works too.
 */
export function NumberPad(props: { value: string; onChange(v: string): void; onSubmit(value: string): void; disabled?: boolean; submitLabel: string }) {
  const { value, onChange, onSubmit, disabled, submitLabel } = props;
  // Tracks the latest value so quick key presses before a re-render aren't lost.
  const current = useRef(value);
  current.current = value;

  const press = (key: string) => {
    if (disabled) return;
    const v = current.current;
    const next = key === '⌫' ? v.slice(0, -1) : v.length < 12 ? v + key : v;
    current.current = next;
    onChange(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled || e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9./]$/.test(e.key)) press(e.key);
      else if (e.key === '-') press('−');
      else if (e.key === 'Backspace') press('⌫');
      else if (e.key === 'Enter') {
        if (current.current) onSubmit(current.current);
      }
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="pad">
      <div className="pad-display" aria-live="polite">
        {value || <span className="pad-placeholder">x =</span>}
      </div>
      <div className="pad-grid">
        {KEYS.map((k) => (
          <button key={k} type="button" className={k === '⌫' ? 'pad-key pad-key-muted' : 'pad-key'} onClick={() => press(k)} disabled={disabled} aria-label={k === '⌫' ? 'Delete' : k}>
            {k}
          </button>
        ))}
        <button type="button" className="pad-key pad-submit" onClick={() => onSubmit(current.current)} disabled={disabled || !value}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
