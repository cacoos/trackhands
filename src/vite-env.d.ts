/// <reference types="vite/client" />

declare global {
  interface Window {
    __TAURI__?: object;
  }
}

export {};
