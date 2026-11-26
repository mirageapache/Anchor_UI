import { afterNextRender, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
// 在元件檔載入全量入口：伺服器的 bundle 同樣會執行這個 import（元件庫在 Node 只定義類別、註冊元件，不渲染）
import { setTheme, ToastService } from '@anchor-ui/core';
import type { SegmentedOption } from '@anchor-ui/core/segmented';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main>
      <h1>Installed from the tarball</h1>
      <aui-field label="Name">
        <aui-input name="name" [(ngModel)]="name" ngDefaultControl></aui-input>
      </aui-field>
      <p id="name-value">{{ name }}</p>

      <aui-segmented
        name="size"
        label="Size"
        [options]="sizes"
        [(ngModel)]="size"
        ngDefaultControl
      ></aui-segmented>
      <p id="size-value">{{ size }}</p>

      <!-- 靜態 attribute 會出現在伺服器輸出的 HTML；[variant] 這類 property 綁定只會在瀏覽器套用 -->
      <aui-button variant="primary" (click)="notify()">Notify</aui-button>
      <aui-card heading="Card" description="Server rendered" [headingLevel]="2"></aui-card>
    </main>
  `,
})
export class AppComponent implements OnInit {
  name = 'hello';
  size = 'md';
  sizes: SegmentedOption[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  constructor() {
    // setTheme 在伺服器端不做任何事（伺服器輸出的 <html> 不帶 data-theme）；
    // 操作 DOM 的程式依 Angular 的建議放在 afterNextRender，只在瀏覽器渲染後執行
    afterNextRender(() => setTheme('dark'));
  }

  ngOnInit(): void {
    // 刻意放在 ngOnInit（README 建議放在 afterNextRender）：ngOnInit 在伺服器與瀏覽器各執行一次，
    // 驗證誤在伺服器端呼叫時 ToastService 不做任何事、不會讓伺服器端渲染失敗，瀏覽器端那一次才顯示
    ToastService.info('Welcome');
  }

  notify(): void {
    // 事件處理只會在瀏覽器觸發，可以直接呼叫 ToastService
    ToastService.success(`${this.name} / ${this.size}`);
  }
}
