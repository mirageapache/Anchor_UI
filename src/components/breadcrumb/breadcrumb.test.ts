import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import type { AuiBreadcrumb } from './breadcrumb.js';
import type { BreadcrumbItem } from './breadcrumb.types.js';

const trail: BreadcrumbItem[] = [
  { label: '首頁', href: '/' },
  { label: '工具', href: '/tools' },
  { label: 'JSON 格式化' },
];

const shadow = (el: AuiBreadcrumb) => el.shadowRoot!;

describe('AuiBreadcrumb (<aui-breadcrumb>)', () => {
  it('renders a labelled nav with an ordered list of the levels', async () => {
    const el = await fixture<AuiBreadcrumb>(
      html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
    );
    const nav = shadow(el).querySelector('nav')!;
    expect(nav.getAttribute('aria-label')).to.equal('麵包屑');
    const items = [...shadow(el).querySelectorAll('ol > li')];
    expect(items.map((item) => item.textContent!.replace(/\s+/g, ' ').trim())).to.deep.equal([
      '首頁',
      '/ 工具',
      '/ JSON 格式化',
    ]);
  });

  it('links the ancestors and marks the last level as the current page', async () => {
    const el = await fixture<AuiBreadcrumb>(
      html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
    );
    const links = [...shadow(el).querySelectorAll('a')];
    expect(links.map((link) => link.getAttribute('href'))).to.deep.equal(['/', '/tools']);
    expect(links.some((link) => link.hasAttribute('aria-current'))).to.be.false;
    const current = shadow(el).querySelector('[aria-current="page"]')!;
    expect(current.localName).to.equal('span');
    expect(current.textContent).to.equal('JSON 格式化');
  });

  it('keeps the current page as a link when it has an href', async () => {
    const el = await fixture<AuiBreadcrumb>(html`
      <aui-breadcrumb
        .items=${[
          { label: '首頁', href: '/' },
          { label: '設定', href: '/settings' },
        ]}
      ></aui-breadcrumb>
    `);
    const current = shadow(el).querySelector('[aria-current="page"]')!;
    expect(current.localName).to.equal('a');
    expect(current.getAttribute('href')).to.equal('/settings');
  });

  it('hides separators from assistive technology and supports a custom separator', async () => {
    const el = await fixture<AuiBreadcrumb>(
      html`<aui-breadcrumb .items=${trail} separator="›"></aui-breadcrumb>`,
    );
    const separators = [...shadow(el).querySelectorAll('[part="separator"]')];
    expect(separators).to.have.length(2);
    expect(separators.every((separator) => separator.getAttribute('aria-hidden') === 'true')).to.be
      .true;
    expect(separators[0].textContent!.trim()).to.equal('›');
  });

  it('renders unsafe or missing links as plain text', async () => {
    const el = await fixture<AuiBreadcrumb>(html`
      <aui-breadcrumb
        .items=${[
          { label: '危險', href: 'javascript:alert(1)' },
          { label: '沒有連結' },
          { label: '目前' },
        ]}
      ></aui-breadcrumb>
    `);
    expect(shadow(el).querySelectorAll('a')).to.have.length(0);
    expect(
      [...shadow(el).querySelectorAll('[part~="text"]')].map((node) => node.textContent),
    ).to.deep.equal(['危險', '沒有連結', '目前']);
  });

  it('has no stray whitespace between the inline list items', async () => {
    const el = await fixture<AuiBreadcrumb>(
      html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
    );
    const blankText = (parent: Element) =>
      [...parent.childNodes].filter(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent !== '',
      );
    // <ol> 與 <li> 之內只有元素（與 Lit 的註解標記），沒有會被渲染成空格的文字
    expect(blankText(shadow(el).querySelector('ol')!)).to.have.length(0);
    for (const item of shadow(el).querySelectorAll('li')) expect(blankText(item)).to.have.length(0);
    expect(shadow(el).querySelectorAll('li')[1].textContent).to.equal(' / 工具');
  });

  it('skips levels without a label and ignores a non-string href', async () => {
    const el = await fixture<AuiBreadcrumb>(html`
      <aui-breadcrumb
        .items=${
          [
            { label: '  ', href: '/blank' },
            { label: '數字', href: 123 },
            { label: '目前' },
          ] as unknown as BreadcrumbItem[]
        }
      ></aui-breadcrumb>
    `);
    expect(
      [...shadow(el).querySelectorAll('li')].map((li) => li.textContent!.trim()),
    ).to.deep.equal(['數字', '/ 目前']);
    expect(shadow(el).querySelectorAll('a')).to.have.length(0);
  });

  it('renders nothing for empty or malformed items', async () => {
    const el = await fixture<AuiBreadcrumb>(html`<aui-breadcrumb></aui-breadcrumb>`);
    expect(shadow(el).querySelector('nav')).to.be.null;
    el.items = [null, { href: '/' }, 'text'] as unknown as BreadcrumbItem[];
    await el.updateComplete;
    expect(shadow(el).querySelector('nav')).to.be.null;
    el.items = null as unknown as BreadcrumbItem[];
    await el.updateComplete;
    expect(shadow(el).querySelector('nav')).to.be.null;
  });

  it('updates when the items change', async () => {
    const el = await fixture<AuiBreadcrumb>(
      html`<aui-breadcrumb .items=${trail}></aui-breadcrumb>`,
    );
    el.items = [...trail.slice(0, 2)];
    await el.updateComplete;
    expect(shadow(el).querySelectorAll('li')).to.have.length(2);
    expect(shadow(el).querySelector('[aria-current="page"]')!.textContent).to.equal('工具');
  });

  it('uses a custom label', async () => {
    const el = await fixture<AuiBreadcrumb>(
      html`<aui-breadcrumb .items=${trail} label="目前位置"></aui-breadcrumb>`,
    );
    expect(shadow(el).querySelector('nav')!.getAttribute('aria-label')).to.equal('目前位置');
  });
});
