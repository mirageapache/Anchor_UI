/**
 * 表單的隱式送出（implicit submission）：在單行輸入框按 Enter 送出所屬表單。
 *
 * 原生 `<input>` 由瀏覽器處理；自訂元素內部的 `<input>` 位於 Shadow DOM、沒有表單擁有者，
 * form-associated custom element 也沒有這項預設行為，因此依 HTML 規範自行實作：
 *
 * - 表單有預設按鈕（第一個送出按鈕）時，等同點擊它：按鈕停用中則不送出。
 * - 沒有送出按鈕時，只有在表單僅含一個單行文字欄位時才送出。
 *
 * 送出一律經由 `requestSubmit()`，因此仍會執行驗證並分派可取消的 `submit` 事件。
 */

/** 會阻擋隱式送出的原生 input 類型（單行文字類） */
const TEXT_INPUT_TYPES = new Set([
  'text',
  'search',
  'url',
  'tel',
  'email',
  'password',
  'date',
  'month',
  'week',
  'time',
  'datetime-local',
  'number',
]);

/** 送出按鈕：原生 `<button type="submit">`、`<input type="submit|image">`，或 `type` 為 `submit` 的自訂元素 */
function isSubmitButton(element: Element): boolean {
  if (element instanceof HTMLInputElement) {
    return element.type === 'submit' || element.type === 'image';
  }
  return (element as Partial<HTMLButtonElement>).type === 'submit';
}

/** 單行文字欄位：原生文字類 input，或單行的 `<aui-input>` */
function isSingleLineField(element: Element): boolean {
  if (element instanceof HTMLInputElement) return TEXT_INPUT_TYPES.has(element.type);
  return element.localName === 'aui-input' && !(element as { multiline?: boolean }).multiline;
}

/**
 * 依隱式送出的規則送出表單。
 * @returns 是否已要求送出（驗證未通過或 `submit` 被取消時，表單仍可能沒有送出）
 */
export function submitImplicitly(form: HTMLFormElement): boolean {
  const elements = [...form.elements];
  const defaultButton = elements.find(isSubmitButton);
  if (defaultButton) {
    // :disabled 涵蓋自身的 disabled 與所屬的 <fieldset disabled>；自訂按鈕的 loading 亦視為不可送出
    if (defaultButton.matches(':disabled') || (defaultButton as { loading?: boolean }).loading) {
      return false;
    }
    // 只有原生送出按鈕可以作為 submitter（其 name / value、formaction 等才會生效）
    const submitter =
      defaultButton instanceof HTMLButtonElement || defaultButton instanceof HTMLInputElement
        ? defaultButton
        : undefined;
    // 以 HTMLFormElement.prototype 呼叫：表單內 name / id 為 "requestSubmit" 的控制項會蓋過同名方法
    HTMLFormElement.prototype.requestSubmit.call(form, submitter);
    return true;
  }
  if (elements.filter(isSingleLineField).length > 1) return false;
  HTMLFormElement.prototype.requestSubmit.call(form);
  return true;
}

/**
 * 等到事件分派完畢再執行預設行為：與原生預設行為相同，使用端在任何階段的監聽器中
 * `preventDefault()` 都能取消（監聽器的執行順序無法保證元件的監聽排在最後，因此延後一個 task）。
 */
export function afterDispatch(event: Event, action: () => void): void {
  setTimeout(() => {
    if (!event.defaultPrevented) action();
  });
}
