import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
// 個別元件入口（@anchor-ui/core/<name>）；此檔不引入全量入口
import { AuiButton } from '@anchor-ui/core/button';
import type { AuiMenu } from '@anchor-ui/core/menu';
import '@anchor-ui/core/menu';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/**
 * 按需載入：Vitest 每個測試檔使用獨立環境，元件註冊表只反映本檔的匯入。
 */
describe('React 19 + per-component entries (@anchor-ui/core/<name>)', () => {
  it('registers only the imported components and what they render or extend', () => {
    expect(customElements.get('aui-button')).toBe(AuiButton);
    expect(customElements.get('aui-menu')).toBeDefined();
    // Menu 繼承 Popover，因此一併註冊 aui-popover
    expect(customElements.get('aui-popover')).toBeDefined();
    for (const tag of ['aui-input', 'aui-segmented', 'aui-tag', 'aui-footer', 'aui-tooltip']) {
      expect(customElements.get(tag), `${tag} should not be registered`).toBeUndefined();
    }
  });

  it('renders an on-demand menu with a button trigger', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = createRoot(container);
    await act(async () =>
      root.render(
        <aui-menu label="Actions">
          <aui-button slot="trigger">Actions</aui-button>
          <button value="edit">Edit</button>
        </aui-menu>,
      ),
    );
    const menu = container.querySelector<AuiMenu>('aui-menu')!;
    await menu.updateComplete;
    expect(menu.items.map((item) => item.getAttribute('role'))).toEqual(['menuitem']);
    await act(async () => root.unmount());
    container.remove();
  });
});
