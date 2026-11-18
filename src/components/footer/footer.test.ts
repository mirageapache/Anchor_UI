import { expect, fixture, html } from '@open-wc/testing';
import './index.js';
import type { AuiFooter } from './footer.js';
import type { FooterColumn } from './footer.types.js';

const part = (el: AuiFooter, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`);
const visible = (element: Element | null) =>
  !!element && getComputedStyle(element).display !== 'none';

const YEAR = new Date().getFullYear();

const COLUMNS: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Components', href: '/components' },
      { label: 'Tokens', href: '/tokens' },
    ],
  },
  {
    heading: 'Resources',
    links: [{ label: 'GitHub', href: 'https://github.com/example', external: true }],
  },
];

describe('AuiFooter (<aui-footer>)', () => {
  describe('copyright', () => {
    it('shows "© <this year> <holder>"', async () => {
      const el = await fixture<AuiFooter>(
        html`<aui-footer copyright-holder="Anchor UI"></aui-footer>`,
      );
      expect(part(el, 'copyright')!.textContent!.trim()).to.equal(`© ${YEAR} Anchor UI`);
    });

    it('shows a year range when copyright-since is before this year', async () => {
      const el = await fixture<AuiFooter>(
        html`<aui-footer copyright-holder="Anchor UI" copyright-since="2024"></aui-footer>`,
      );
      expect(part(el, 'copyright')!.textContent!.trim()).to.equal(`© 2024–${YEAR} Anchor UI`);

      for (const since of [YEAR, YEAR + 1, Number.NaN]) {
        el.copyrightSince = since;
        await el.updateComplete;
        expect(part(el, 'copyright')!.textContent!.trim(), String(since)).to.equal(
          `© ${YEAR} Anchor UI`,
        );
      }
    });

    it('lets the copyright slot replace the generated text', async () => {
      const el = await fixture<AuiFooter>(html`
        <aui-footer copyright-holder="Ignored"><span slot="copyright">Custom</span></aui-footer>
      `);
      const slot = part(el, 'copyright')!.querySelector('slot')!;
      expect(slot.assignedElements().map((e) => e.textContent)).to.deep.equal(['Custom']);
      expect(visible(part(el, 'copyright'))).to.be.true;
    });

    it('hides the copyright without a holder or slotted content', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer version="1.0.0"></aui-footer>`);
      expect(visible(part(el, 'copyright'))).to.be.false;
    });
  });

  describe('version', () => {
    it('prefixes the version with "v" once, and hides an empty version', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer version="1.2.0"></aui-footer>`);
      expect(part(el, 'version')!.textContent).to.equal('v1.2.0');
      el.version = 'v2.0.0-beta';
      await el.updateComplete;
      expect(part(el, 'version')!.textContent).to.equal('v2.0.0-beta');
      el.version = '  ';
      await el.updateComplete;
      expect(part(el, 'version')).to.be.null;
    });
  });

  describe('layouts', () => {
    it('is a single row (minimal) without columns', async () => {
      const el = await fixture<AuiFooter>(html`
        <aui-footer copyright-holder="Anchor UI" style="width: 1000px">
          <a slot="links" href="#privacy">Privacy</a>
          <a slot="social" href="#gh" aria-label="GitHub">GH</a>
        </aui-footer>
      `);
      expect(part(el, 'columns')).to.be.null;
      expect(part(el, 'base')!.classList.contains('footer--columns')).to.be.false;
      const [copyright, links, social] = ['copyright', 'links', 'social'].map((name) =>
        part(el, name)!.getBoundingClientRect(),
      );
      expect(Math.round(links.top + links.height / 2)).to.equal(
        Math.round(copyright.top + copyright.height / 2),
      );
      expect(social.left).to.be.above(links.right);
    });

    it('renders columns with headings and link lists, above the bottom row', async () => {
      const el = await fixture<AuiFooter>(html`
        <aui-footer
          copyright-holder="Anchor UI"
          .columns=${COLUMNS}
          style="width: 1000px"
        ></aui-footer>
      `);
      const nav = part(el, 'columns')!;
      expect(nav.localName).to.equal('nav');
      expect(nav.getAttribute('aria-label')).to.equal('網站導覽');
      const columns = el.shadowRoot!.querySelectorAll('[part="column"]');
      expect(columns).to.have.length(2);
      expect([...el.shadowRoot!.querySelectorAll('h2')].map((h) => h.textContent)).to.deep.equal([
        'Product',
        'Resources',
      ]);
      const list = columns[0].querySelector('ul')!;
      expect(list.getAttribute('aria-labelledby')).to.equal('column-0');
      expect([...list.querySelectorAll('a')].map((a) => a.getAttribute('href'))).to.deep.equal([
        '/components',
        '/tokens',
      ]);
      // 多欄並排，版權列在下方並以分隔線區隔
      expect(columns[1].getBoundingClientRect().top).to.equal(
        columns[0].getBoundingClientRect().top,
      );
      const bottom = part(el, 'bottom')!;
      expect(bottom.getBoundingClientRect().top).to.be.above(nav.getBoundingClientRect().bottom);
      expect(getComputedStyle(bottom).borderTopWidth).to.equal('1px');
    });

    it('renders links with an unsafe protocol as text without href', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer></aui-footer>`);
      el.columns = [
        {
          heading: '連結',
          links: [
            { label: 'script', href: 'javascript:alert(1)' },
            { label: 'spaced', href: ' JavaScript:alert(1)', external: true },
            { label: 'data', href: 'data:text/html,x' },
            { label: 'mail', href: 'mailto:hi@example.com' },
            { label: 'relative', href: '/docs' },
          ],
        },
      ];
      await el.updateComplete;
      const links = [...el.shadowRoot!.querySelectorAll<HTMLAnchorElement>('.footer__list a')];
      expect(links.map((a) => a.getAttribute('href'))).to.deep.equal([
        null,
        null,
        null,
        'mailto:hi@example.com',
        '/docs',
      ]);
      // 文字仍然顯示
      expect(links[0].textContent).to.equal('script');
    });

    it('opens external links in a new tab and announces it', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer .columns=${COLUMNS}></aui-footer>`);
      const external = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[href^="https"]')!;
      expect(external.target).to.equal('_blank');
      expect(external.rel).to.equal('noopener noreferrer');
      expect(external.querySelector('.sr-only')!.textContent).to.equal('（另開新視窗）');
      const internal = el.shadowRoot!.querySelector<HTMLAnchorElement>('a[href="/tokens"]')!;
      expect(internal.hasAttribute('target')).to.be.false;
    });

    it('uses heading-level for the column headings', async () => {
      const el = await fixture<AuiFooter>(
        html`<aui-footer heading-level="3" .columns=${COLUMNS}></aui-footer>`,
      );
      expect(el.shadowRoot!.querySelectorAll('h3')).to.have.length(2);
      el.headingLevel = 9 as never;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelectorAll('h2'), 'invalid levels fall back to 2').to.have.length(
        2,
      );
    });

    it('renders no empty heading for a column without one', async () => {
      const el = await fixture<AuiFooter>(html`
        <aui-footer .columns=${[{ heading: '', links: [{ label: 'A', href: '#a' }] }]}></aui-footer>
      `);
      expect(el.shadowRoot!.querySelector('h2')).to.be.null;
      expect(el.shadowRoot!.querySelector('ul')!.hasAttribute('aria-labelledby')).to.be.false;
    });

    it('treats a null version as empty', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer copyright-holder="X"></aui-footer>`);
      el.version = null as never;
      await el.updateComplete;
      expect(part(el, 'version')).to.be.null;
    });

    it('ignores a non-array columns value', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer copyright-holder="X"></aui-footer>`);
      el.columns = null as never;
      await el.updateComplete;
      expect(part(el, 'columns')).to.be.null;
    });

    it('stacks the bottom row when narrower than 640px', async () => {
      const el = await fixture<AuiFooter>(html`
        <aui-footer copyright-holder="Anchor UI" style="width: 400px">
          <a slot="links" href="#privacy">Privacy</a>
        </aui-footer>
      `);
      expect(getComputedStyle(part(el, 'bottom')!).flexDirection).to.equal('column');
      expect(part(el, 'links')!.getBoundingClientRect().top).to.be.above(
        part(el, 'copyright')!.getBoundingClientRect().bottom - 1,
      );
    });

    it('fills a flex row container and sits at the bottom of a flex column', async () => {
      const row = await fixture<HTMLDivElement>(html`
        <div style="display: flex; width: 900px">
          <aui-footer copyright-holder="X"></aui-footer>
        </div>
      `);
      expect(row.querySelector('aui-footer')!.getBoundingClientRect().width).to.equal(900);

      const page = await fixture<HTMLDivElement>(html`
        <div style="display: flex; flex-direction: column; height: 600px">
          <main>Content</main>
          <aui-footer copyright-holder="X"></aui-footer>
        </div>
      `);
      const footer = page.querySelector('aui-footer')!;
      expect(footer.getBoundingClientRect().bottom).to.equal(page.getBoundingClientRect().bottom);
    });

    it('hides the links nav and social area without slotted content', async () => {
      const el = await fixture<AuiFooter>(html`<aui-footer copyright-holder="X"></aui-footer>`);
      expect(visible(part(el, 'links'))).to.be.false;
      expect(visible(part(el, 'social'))).to.be.false;

      const link = document.createElement('a');
      link.slot = 'links';
      link.href = '#terms';
      link.textContent = 'Terms';
      el.appendChild(link);
      await new Promise((resolve) => setTimeout(resolve));
      await el.updateComplete;
      expect(visible(part(el, 'links'))).to.be.true;
      expect(part(el, 'links')!.getAttribute('aria-label')).to.equal('頁尾連結');
    });
  });
});
