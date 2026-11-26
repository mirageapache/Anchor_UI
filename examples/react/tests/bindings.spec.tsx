import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import '@anchor-ui/core';
import type {
  AuiButton,
  AuiFooter,
  AuiInput,
  AuiMenu,
  AuiSegmented,
  AuiTag,
  FooterColumn,
  MenuSelectDetail,
  SegmentedOption,
  TagRemoveDetail,
} from '@anchor-ui/core';
import { App } from '../src/App';

// React 18 以前需要這個旗標才不會對 act() 發出警告；React 19 沿用
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | undefined;
let container: HTMLElement | undefined;

async function render(node: React.ReactNode): Promise<HTMLElement> {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  await act(async () => root!.render(node));
  return container;
}

/** 等待 Lit 元件完成渲染 */
const settle = (element: Element) =>
  (element as unknown as { updateComplete: Promise<unknown> }).updateComplete;

afterEach(async () => {
  await act(async () => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
});

describe('React 19 + Anchor UI', () => {
  describe('properties', () => {
    it('sets string, boolean and array props as element properties', async () => {
      const options: SegmentedOption[] = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
      ];
      const page = await render(
        <>
          <aui-button variant="accent" disabled>
            OK
          </aui-button>
          <aui-segmented options={options} value="b"></aui-segmented>
        </>,
      );
      const button = page.querySelector<AuiButton>('aui-button')!;
      const segmented = page.querySelector<AuiSegmented>('aui-segmented')!;
      await settle(button);
      await settle(segmented);
      expect(button.variant).toBe('accent');
      expect(button.disabled).toBe(true);
      // 陣列以 property 設定（React 18 以前會變成 "[object Object]" 字串 attribute）
      expect(segmented.options).toBe(options);
      expect(segmented.shadowRoot!.querySelectorAll('[role="radio"]')).toHaveLength(2);
      expect(segmented.value).toBe('b');
    });

    it('sets camelCase props through the property, not as a lowercased attribute', async () => {
      const page = await render(
        <aui-button fullWidth size="lg">
          Wide
        </aui-button>,
      );
      const button = page.querySelector<AuiButton>('aui-button')!;
      await settle(button);
      expect(button.fullWidth).toBe(true);
      // 走 attribute 時 React 會寫成元件不認得的 fullwidth
      expect(button.hasAttribute('fullwidth')).toBe(false);
      // 元件把 property 反映成自己的 attribute
      expect(button.hasAttribute('full-width')).toBe(true);
    });

    it('re-binds a new array when the state changes', async () => {
      function Columns() {
        const [columns, setColumns] = useState<FooterColumn[]>([
          { heading: 'A', links: [{ label: 'One', href: '#one' }] },
        ]);
        return (
          <>
            <aui-footer columns={columns}></aui-footer>
            <button
              id="more"
              onClick={() =>
                setColumns((current) => [
                  ...current,
                  { heading: 'B', links: [{ label: 'Two', href: '#two' }] },
                ])
              }
            >
              more
            </button>
          </>
        );
      }
      const page = await render(<Columns />);
      const footer = page.querySelector<AuiFooter>('aui-footer')!;
      await settle(footer);
      expect(footer.shadowRoot!.querySelectorAll('a[href]')).toHaveLength(1);
      await act(async () => page.querySelector<HTMLButtonElement>('#more')!.click());
      await settle(footer);
      expect(footer.columns).toHaveLength(2);
      expect(footer.shadowRoot!.querySelectorAll('a[href]')).toHaveLength(2);
    });
  });

  describe('custom events', () => {
    it('listens to aui- events with on<event-name> and receives the typed detail', async () => {
      const removed: string[] = [];
      const page = await render(
        <aui-tag
          removable
          onaui-remove={(event: CustomEvent<TagRemoveDetail>) =>
            removed.push(event.detail.tag.textContent ?? '')
          }
        >
          react
        </aui-tag>,
      );
      const tag = page.querySelector<AuiTag>('aui-tag')!;
      await settle(tag);
      await act(async () =>
        tag.shadowRoot!.querySelector<HTMLButtonElement>('[part~="remove-button"]')!.click(),
      );
      expect(removed).toEqual(['react']);
    });

    it('updates state from aui-select of a menu', async () => {
      const page = await render(<App />);
      const menu = page.querySelector<AuiMenu>('aui-menu')!;
      await settle(menu);
      await act(async () => menu.show());
      await act(async () => menu.querySelector<HTMLButtonElement>('[value="delete"]')!.click());
      expect(page.querySelector('#react-last-action')!.textContent).toBe('delete');
      // aui-select 的 detail 型別：值與項目
      const selected = await new Promise<MenuSelectDetail>((resolve) => {
        menu.addEventListener(
          'aui-select',
          (event) => resolve((event as CustomEvent<MenuSelectDetail>).detail),
          {
            once: true,
          },
        );
        menu.show();
        void menu.updateComplete.then(() =>
          menu.querySelector<HTMLButtonElement>('[value="duplicate"]')!.click(),
        );
      });
      expect(selected.value).toBe('duplicate');
    });
  });

  describe('controlled form values', () => {
    it('writes state into aui-input and reads it back with onInput', async () => {
      const page = await render(<App />);
      const input = page.querySelector<AuiInput>('#react-input')!;
      await settle(input);
      expect(input.value).toBe('Hello, Anchor UI!');

      // happy-dom 不會把 Shadow DOM 內的事件 retarget 到元件本身（React 依 event.target 尋找元件），
      // 因此在元件本身分派 input；真實瀏覽器中內部輸入框的 input 事件即以元件為 target（見 input.test.ts）
      await act(async () => {
        input.value = 'typed in React';
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
      expect(page.querySelector('#react-text')!.textContent).toBe('typed in React');
    });

    it('pushes a state change back into the element (controlled)', async () => {
      function Controlled() {
        const [text, setText] = useState('first');
        return (
          <>
            <aui-input
              value={text}
              onInput={(event) => setText(event.currentTarget.value)}
            ></aui-input>
            <button id="reset" onClick={() => setText('reset by state')}>
              reset
            </button>
          </>
        );
      }
      const page = await render(<Controlled />);
      const input = page.querySelector<AuiInput>('aui-input')!;
      await settle(input);
      expect(input.value).toBe('first');
      await act(async () => page.querySelector<HTMLButtonElement>('#reset')!.click());
      await settle(input);
      expect(input.value).toBe('reset by state');
      // 內部的原生輸入框也同步顯示
      expect(input.shadowRoot!.querySelector<HTMLInputElement>('.control')!.value).toBe(
        'reset by state',
      );
    });

    it('selects a segmented option through onInput', async () => {
      const page = await render(<App />);
      const segmented = page.querySelector<AuiSegmented>('#react-mode')!;
      await settle(segmented);
      await act(async () => {
        segmented.value = 'decode';
        segmented.dispatchEvent(new Event('input', { bubbles: true }));
      });
      expect(page.querySelector('#react-mode-value')!.textContent).toBe('decode');
    });
  });

  it('re-renders a changed prop from a click handler', async () => {
    const page = await render(<App />);
    const button = page.querySelector<AuiButton>('#react-button')!;
    await settle(button);
    expect(button.variant).toBe('primary');
    await act(async () => button.click());
    await settle(button);
    expect(button.variant).toBe('accent');
  });
});
