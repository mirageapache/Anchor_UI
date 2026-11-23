import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BooleanBindings from './fixtures/BooleanBindings.vue';
import type { AuiButton } from '@anchor-ui/core/button';
import type { AuiSegmented } from '@anchor-ui/core/segmented';

/**
 * Vue 綁定自訂元素屬性的規則（README「在 Vue 3 中設定」的依據）：
 * Vue 只在元素上有同名 property 時直接設定 property，否則寫成 attribute，而 false 會寫成字串 "false"。
 * Lit 的布林屬性只看 attribute 是否存在，所以 "false" 會被讀成 true。
 */
describe('Vue 3 boolean bindings on Anchor UI elements', () => {
  let wrapper: ReturnType<typeof mount> | undefined;

  afterEach(() => {
    wrapper?.unmount();
  });

  const RECOMMENDED = ['camel', 'camel-modifier', 'nullable'];

  const mountWith = (flag: boolean) => {
    wrapper = mount(BooleanBindings, { props: { flag }, attachTo: document.body });
    return (id: string) => wrapper!.find(`#${id}`).element as AuiButton;
  };

  it('reads a kebab-case binding of false as true (the pitfall)', () => {
    const el = mountWith(false)('kebab');
    expect(el.getAttribute('full-width')).toBe('false');
    expect(el.fullWidth).toBe(true);
  });

  it('does not reach the property with .prop on a kebab-case name', () => {
    const el = mountWith(true)('kebab-prop');
    expect((el as unknown as Record<string, unknown>)['full-width']).toBe(true);
    expect(el.fullWidth).toBe(false);
  });

  it('keeps false with camelCase, .camel or null', () => {
    const byId = mountWith(false);
    for (const id of RECOMMENDED) {
      expect(byId(id).fullWidth, id).toBe(false);
      expect(byId(id).hasAttribute('full-width'), id).toBe(false);
    }
  });

  it('sets true with the recommended forms, and single-word properties directly', () => {
    const byId = mountWith(true);
    for (const id of ['kebab', ...RECOMMENDED]) {
      expect(byId(id).fullWidth, id).toBe(true);
    }
    expect(byId('single').disabled).toBe(true);
  });

  it('follows reactive changes from true to false with the recommended forms', async () => {
    const byId = mountWith(true);
    await wrapper!.setProps({ flag: false });
    for (const id of RECOMMENDED) {
      expect(byId(id).fullWidth, id).toBe(false);
    }
    expect(byId('single').disabled).toBe(false);
    // kebab-case 寫成 attribute "false"，仍是 true
    expect(byId('kebab').fullWidth).toBe(true);
  });

  it('passes arrays to properties that exist on the element', () => {
    mountWith(false);
    const segmented = wrapper!.find('#options').element as AuiSegmented;
    expect(Array.isArray(segmented.options)).toBe(true);
    expect(segmented.options).toHaveLength(2);
  });
});
