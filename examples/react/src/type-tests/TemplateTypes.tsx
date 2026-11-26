// TASK-502 / TASK-508：React JSX 型別（@anchor-ui/core/react）的正反例，由 tsc 檢查（pnpm typecheck:examples）。
// 正確寫法必須通過；標記 @ts-expect-error 的錯誤寫法必須報錯——型別宣告失效時，
// 這些標記會變成「沒有對應錯誤的 @ts-expect-error」而讓型別檢查失敗。
// 本檔不會被應用程式引用，只供型別檢查。
import type {
  ButtonVariant,
  FileDropDetail,
  ModalHideDetail,
  SegmentedOption,
} from '@anchor-ui/core';

const variant: ButtonVariant = 'primary';
const options: SegmentedOption[] = [{ value: 'a', label: 'A' }];

function onDrop(event: CustomEvent<FileDropDetail>): number {
  return event.detail.files.length;
}
function onHide(event: CustomEvent<ModalHideDetail>): string {
  return event.detail.reason;
}

export function TemplateTypes() {
  return (
    <>
      {/* 屬性：使用元件的型別 */}
      <aui-button variant={variant} size="sm" fullWidth>
        OK
      </aui-button>
      {/* @ts-expect-error variant 不是 ButtonVariant */}
      <aui-button variant="bogus">x</aui-button>
      {/* @ts-expect-error size 不是 ButtonSize */}
      <aui-button size="xl">x</aui-button>

      <aui-segmented options={options} value="a"></aui-segmented>
      {/* @ts-expect-error options 必須是 SegmentedOption[] */}
      <aui-segmented options={['a']}></aui-segmented>

      <aui-card heading="Card" headingLevel={2} lines={3}></aui-card>
      {/* @ts-expect-error headingLevel 只能是 1 ~ 6 */}
      <aui-card heading="Card" headingLevel={9}></aui-card>
      {/* @ts-expect-error JSX 中數值不寫成字串（React 會設定 property） */}
      <aui-card heading="Card" lines="3"></aui-card>

      {/* 事件：on<事件名稱> 監聽 aui- 自訂事件，處理器的參數帶入 detail 型別；行內函式自動推斷 */}
      <aui-dropzone
        onaui-file-drop={onDrop}
        onaui-file-reject={(event) => event.detail.rejections.map((item) => item.reason)}
      ></aui-dropzone>
      {/* @ts-expect-error 處理器要求的 detail 型別與 aui-file-drop 不符 */}
      <aui-dropzone
        onaui-file-drop={(event: CustomEvent<{ value: number }>) => event.detail.value}
      />
      <aui-modal onaui-hide={onHide}></aui-modal>
      {/* @ts-expect-error aui-show 沒有 detail.reason */}
      <aui-modal onaui-show={(event) => event.detail.reason}></aui-modal>

      {/* 原生事件沿用 React 的事件型別：currentTarget 為元件本身 */}
      <aui-input onInput={(event) => event.currentTarget.value.toUpperCase()}></aui-input>
    </>
  );
}
