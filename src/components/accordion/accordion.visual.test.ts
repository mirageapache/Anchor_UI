import { html } from '@open-wc/testing';
import { describeVisual } from '../../test-utils/visual.js';
import './index.js';

const column = 'flex-direction: column; align-items: stretch; width: 440px;';

describeVisual('AuiAccordion visual regression', [
  {
    name: 'accordion-doc',
    render: () => html`
      <div class="visual-frame" style=${column}>
        <aui-accordion heading="使用說明" open>
          <p>貼上 JSON 後按下格式化，即可取得排版後的結果。</p>
          <ul>
            <li>支援最大 5 MB 的文件</li>
            <li>所有運算皆在瀏覽器內完成</li>
          </ul>
          <p>格式錯誤時會標示錯誤所在的行與欄。</p>
        </aui-accordion>
        <aui-accordion heading="限制規範"><p>不支援 JSON5。</p></aui-accordion>
      </div>
    `,
  },
  {
    name: 'accordion-faq',
    render: () => html`
      <div class="visual-frame" style="${column} gap: 8px;">
        <aui-accordion heading="資料會上傳到伺服器嗎？" variant="faq" name="faq" open>
          <p>不會，所有運算皆在本機完成。</p>
        </aui-accordion>
        <aui-accordion heading="支援哪些瀏覽器？" variant="faq" name="faq">
          <p>最新兩個版本的 Chrome、Edge、Firefox 與 Safari。</p>
        </aui-accordion>
        <aui-accordion
          heading="averyverylongunbrokenquestionthatmustwrapwithoutoverflowingthecontainer"
          variant="faq"
          name="faq"
        ></aui-accordion>
      </div>
    `,
  },
  {
    // 側欄的可收合選單：外框由外層容器提供
    name: 'accordion-plain',
    render: () => html`
      <div
        class="visual-frame"
        style="${column} width: 240px; padding: 8px 12px; border: 1px solid var(--color-border);"
      >
        <aui-accordion heading="報表" variant="plain" open>
          <ul>
            <li>日報表</li>
            <li>月報表</li>
          </ul>
        </aui-accordion>
        <aui-accordion heading="設定" variant="plain"></aui-accordion>
      </div>
    `,
  },
]);
