export const GPT_SCRIPT_ID = 'react-gpt-hooks-script';

const SCRIPT_URL = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';

let scriptLoadPromise: Promise<void> | null = null;

function injectScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      resolve();
      return;
    }

    const existing = document.getElementById(GPT_SCRIPT_ID);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = GPT_SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load GPT script'));
    };
    document.head.appendChild(script);
  });
}

export function loadGptScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = injectScript();
  return scriptLoadPromise;
}

export function resetScriptLoader(): void {
  scriptLoadPromise = null;
}
