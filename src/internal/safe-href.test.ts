import { expect } from '@open-wc/testing';
import { safeHref } from './safe-href.js';

describe('safeHref', () => {
  it('keeps http(s), mailto, tel and relative URLs unchanged', () => {
    for (const href of [
      'https://example.com/a?b=1#c',
      'http://example.com',
      'HTTPS://EXAMPLE.COM',
      'mailto:hi@example.com',
      'tel:+886212345678',
      '/tools/uuid',
      'docs/guide',
      '../up',
      '#section',
      '?page=2',
      '//cdn.example.com/a.js',
      '',
    ]) {
      expect(safeHref(href), href).to.equal(href);
    }
  });

  it('rejects script and other non-link protocols, however they are written', () => {
    for (const href of [
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      '  javascript:alert(1)',
      'java\tscript:alert(1)',
      'java\nscript:alert(1)',
      '\u0001javascript:alert(1)',
      'vbscript:msgbox(1)',
      'data:text/html,<script>alert(1)</script>',
      'blob:https://example.com/uuid',
      'file:///etc/passwd',
    ]) {
      expect(safeHref(href), JSON.stringify(href)).to.be.undefined;
    }
  });

  it('rejects URLs that cannot be parsed, and missing values', () => {
    expect(safeHref('http://[invalid')).to.be.undefined;
    expect(safeHref(null)).to.be.undefined;
    expect(safeHref(undefined)).to.be.undefined;
  });
});
