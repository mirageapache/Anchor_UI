import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    // 瀏覽器沿用伺服器輸出的 DOM（hydration），而不是重新渲染
    provideClientHydration(withEventReplay()),
  ],
};
