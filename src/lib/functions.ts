// src/lib/functions.ts
export const functionsOrigin =
  process.env.NEXT_PUBLIC_FUNCTIONS_ORIGIN || ""; 
// e.g. https://us-central1-<PROJECT_ID>.cloudfunctions.net

export const fn = (name: string) =>
  functionsOrigin
    ? `${functionsOrigin}/${name}`
    : `/${name}`; // optional local emulator fallback
// e.g. https://us-central1-<PROJECT_ID>.cloudfunctions.net/<name>