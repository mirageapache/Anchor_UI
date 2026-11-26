import { useRef, useState } from 'react';
// 子路徑入口的型別宣告必須能被解析（驗證 package.json 的 exports → types）
import type { AuiButton, ButtonVariant } from '@anchor-ui/core/button';
import type { CardHeadingLevel } from '@anchor-ui/core/card';
import { ToastService } from '@anchor-ui/core/toast';

export function App() {
  const [text, setText] = useState('hello');
  const variant: ButtonVariant = 'primary';
  const headingLevel: CardHeadingLevel = 2;
  const button = useRef<AuiButton>(null);

  function notify(): void {
    // 透過元素的型別存取屬性：型別宣告需包含元件類別的公開 API
    const disabled: boolean = button.current?.disabled ?? false;
    ToastService.success(`value: ${text}, disabled: ${disabled}`);
  }

  return (
    <main>
      <aui-field label="Name" clearable>
        <aui-input value={text} onInput={(event) => setText(event.currentTarget.value)}></aui-input>
      </aui-field>
      <aui-button ref={button} variant={variant} onClick={notify}>
        Notify
      </aui-button>
      <aui-card
        heading="Card"
        description="Installed from the tarball"
        href="#card"
        headingLevel={headingLevel}
      ></aui-card>
    </main>
  );
}
