/**
 * Storybook play function 的共用工具。
 *
 * Testing Library 的查詢（within / getByRole）無法穿透 Shadow DOM，
 * 因此以元件的 part / class 取得內部元素，再交給 userEvent 操作。
 */
import { userEvent } from '@storybook/test';
import type { AuiInput } from '../components/input/input.js';
import type { AuiSegmented } from '../components/segmented/segmented.js';
import type { AuiToast } from '../components/toast/toast.js';

/** 取得元件 Shadow DOM 內的元素（找不到時拋錯，讓測試直接失敗並指出原因） */
export function inShadow<T extends Element = HTMLElement>(host: Element, selector: string): T {
  const element = host.shadowRoot?.querySelector<T>(selector);
  if (!element) throw new Error(`在 <${host.localName}> 的 Shadow DOM 中找不到 ${selector}`);
  return element;
}

/** 取得 canvas 內的元素 */
export function query<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`找不到 ${selector}`);
  return element;
}

/** 點擊元件內部的原生 <button>（如 <aui-button>） */
export async function clickButton(host: Element): Promise<void> {
  await userEvent.click(inShadow(host, 'button'));
}

/** 在 <aui-input> 中輸入文字（點擊內部控制項後逐字輸入） */
export async function typeInto(input: AuiInput, text: string): Promise<void> {
  await userEvent.click(inShadow(input, '.control'));
  await userEvent.keyboard(text);
}

/** 點擊 <aui-segmented> 的第 index 個選項 */
export async function chooseOption(segmented: AuiSegmented, index: number): Promise<void> {
  const options = segmented.shadowRoot?.querySelectorAll<HTMLButtonElement>('.option') ?? [];
  await userEvent.click(options[index]);
}

/** 穿透 Shadow DOM 取得實際聚焦的元素 */
export function deepActiveElement(): Element | null {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** 目前 Toast Viewport 中的通知（Viewport 可能已移入 modal 的子樹，從保留的參照查詢） */
export function visibleToasts(viewport: Element | null): AuiToast[] {
  return viewport ? [...viewport.querySelectorAll<AuiToast>('aui-toast:not([leaving])')] : [];
}

/** Toast Viewport（尚未建立或已移入 Shadow DOM 時為 null） */
export function toastViewport(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-aui-toast-viewport]');
}
