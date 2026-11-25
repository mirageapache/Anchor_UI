import { RenderMode, ServerRoute } from '@angular/ssr';

// 每次請求都在伺服器端渲染（不是建置時預先渲染），與業務專案的執行方式相同
export const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Server }];
