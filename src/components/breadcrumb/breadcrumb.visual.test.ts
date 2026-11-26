import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import '../header/index.js';
import './index.js';
import type { BreadcrumbItem } from './breadcrumb.types.js';

const trail: BreadcrumbItem[] = [
  { label: '首頁', href: '/' },
  { label: '開發工具', href: '/tools' },
  { label: 'JSON 格式化' },
];

describeVisual('AuiBreadcrumb visual regression', [
  {
    name: 'breadcrumb-trail',
    render: () => html`
      <div class="visual-frame" style="flex-direction: column; align-items: stretch; width: 320px;">
        <aui-breadcrumb .items=${trail}></aui-breadcrumb>
        <aui-breadcrumb .items=${trail} separator="›"></aui-breadcrumb>
        <aui-breadcrumb
          .items=${[
            { label: '首頁', href: '/' },
            { label: 'averyverylongunbrokensectionnamethatmustwrap', href: '/long' },
            { label: '這是一個沒有空格而且非常非常長的中文頁面名稱必須在容器內換行', href: '/cjk' },
            { label: '目前頁面' },
          ]}
        ></aui-breadcrumb>
      </div>
    `,
  },
  {
    // 放進工具頁標頭的 breadcrumb slot
    name: 'breadcrumb-in-header',
    render: () => html`
      <div class="visual-frame" style="width: 480px;">
        <aui-header
          heading="JSON 格式化"
          description="格式化、驗證與壓縮 JSON。"
          style="width: 100%;"
        >
          <aui-breadcrumb slot="breadcrumb" .items=${trail}></aui-breadcrumb>
        </aui-header>
      </div>
    `,
  },
]);
