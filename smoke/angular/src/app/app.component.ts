import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
// 子路徑入口的型別宣告必須能被解析（驗證 package.json 的 exports → types）
import type { AuiButton, ButtonVariant } from '@anchor-ui/core/button';
import type { CardHeadingLevel } from '@anchor-ui/core/card';
import { ToastService } from '@anchor-ui/core/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  // aui- 開頭的標籤是自訂元素
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main>
      <aui-field label="Name" clearable>
        <aui-input name="text" [(ngModel)]="text" ngDefaultControl></aui-input>
      </aui-field>
      <aui-button #button [variant]="variant" (click)="notify()">Notify</aui-button>
      <aui-card
        heading="Card"
        description="Installed from the tarball"
        href="#card"
        [headingLevel]="headingLevel"
      ></aui-card>
    </main>
  `,
})
export class AppComponent {
  @ViewChild('button') button?: ElementRef<AuiButton>;

  variant: ButtonVariant = 'primary';
  headingLevel: CardHeadingLevel = 2;
  text = 'hello';

  notify(): void {
    // 透過元素的型別存取屬性：型別宣告需包含元件類別的公開 API
    const disabled: boolean = this.button?.nativeElement.disabled ?? false;
    ToastService.success(`value: ${this.text}, disabled: ${disabled}`);
  }
}
