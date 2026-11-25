// TASK-508：以 tarball 安裝的 @anchor-ui/core/react 必須讓 tsc 檢查 JSX（skipLibCheck: false 也涵蓋宣告檔本身）。
// 標記 @ts-expect-error 的錯誤寫法必須報錯。本檔不會被應用程式引用，只供型別檢查。
import type { FileDropDetail } from '@anchor-ui/core/dropzone';

function onDrop(event: CustomEvent<FileDropDetail>): number {
  return event.detail.files.length;
}

export function TemplateTypes() {
  return (
    <>
      <aui-button variant="primary" size="sm">
        OK
      </aui-button>
      {/* @ts-expect-error variant 不是 ButtonVariant */}
      <aui-button variant="bogus">x</aui-button>
      <aui-dropzone onaui-file-drop={onDrop}></aui-dropzone>
      {/* @ts-expect-error detail 型別不符 */}
      <aui-dropzone
        onaui-file-drop={(event: CustomEvent<{ value: number }>) => event.detail.value}
      />
    </>
  );
}
