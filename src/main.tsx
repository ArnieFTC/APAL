import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { I18nProvider } from './i18n';
import './styles.css';

// Caches the whole app on the device so it opens with no internet, and updates itself when online.
registerSW({ immediate: true });

// A long press on a phone opens a menu ("copy", "open in new tab") that confuses new users.
// Keep it only where it's useful: text boxes and the class code.
document.addEventListener('contextmenu', (e) => {
  if (!(e.target instanceof Element && e.target.closest('input, textarea, .code'))) e.preventDefault();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
);
