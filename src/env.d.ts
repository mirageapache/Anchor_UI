/// <reference types="vite/client" />

// L-01: Injected by Vite define at build time from package.json version.
// This ensures VERSION in index.ts is always in sync with the published package.
declare const __PKG_VERSION__: string;

declare module '*.scss' {
  const content: string;
  export default content;
}

declare module '*.css' {
  const content: string;
  export default content;
}
