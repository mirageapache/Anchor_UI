import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { resetMouse, sendMouse } from '@web/test-runner-commands';
import './index.js';
import type { AuiDropzone } from './dropzone.js';
import type { FileDropDetail, FileRejectDetail } from './dropzone.types.js';

const zone = (el: AuiDropzone) => el.shadowRoot!.querySelector<HTMLButtonElement>('.dropzone')!;
const input = (el: AuiDropzone) => el.shadowRoot!.querySelector<HTMLInputElement>('input')!;
const part = (el: AuiDropzone, name: string) =>
  el.shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;

const jsonFile = () => new File(['{"ok":true}'], 'data.json', { type: 'application/json' });
const pngFile = () =>
  new File([new Uint8Array([137, 80, 78, 71])], 'photo.PNG', { type: 'image/png' });
const textFile = () => new File(['hello'], 'notes.txt', { type: 'text/plain' });

/** 建立帶有檔案的拖曳事件（DataTransfer 加入檔案後 types 會包含 "Files"） */
function fileDrag(type: string, files: File[]): DragEvent {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  return new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true });
}

/** 拖曳文字（不含檔案） */
function textDrag(type: string): DragEvent {
  const dataTransfer = new DataTransfer();
  dataTransfer.setData('text/plain', 'just text');
  return new DragEvent(type, { dataTransfer, bubbles: true, cancelable: true, composed: true });
}

/** 模擬經由原生檔案選取器選擇檔案 */
function pick(el: AuiDropzone, files: File[]): void {
  const dataTransfer = new DataTransfer();
  for (const file of files) dataTransfer.items.add(file);
  input(el).files = dataTransfer.files;
  input(el).dispatchEvent(new Event('change', { bubbles: true }));
}

/** 收集元件送出的事件 */
function record(el: AuiDropzone) {
  const drops: FileDropDetail[] = [];
  const rejects: FileRejectDetail[] = [];
  el.addEventListener('aui-file-drop', (event) =>
    drops.push((event as CustomEvent<FileDropDetail>).detail),
  );
  el.addEventListener('aui-file-reject', (event) =>
    rejects.push((event as CustomEvent<FileRejectDetail>).detail),
  );
  return { drops, rejects };
}

const names = (files: File[]) => files.map((file) => file.name);

describe('AuiDropzone (<aui-dropzone>)', () => {
  describe('rendering', () => {
    it('renders the default prompt inside a button with a hidden file input', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      expect(el.accept).to.equal('');
      expect(el.multiple).to.be.false;
      expect(el.disabled).to.be.false;

      expect(zone(el).tagName).to.equal('BUTTON');
      expect(zone(el).type).to.equal('button');
      expect(part(el, 'heading').textContent?.trim()).to.equal('拖放檔案到此處，或點擊選擇檔案');
      expect(part(el, 'hint').hidden, 'no hint without accept').to.be.true;
      expect(part(el, 'error').textContent?.trim()).to.equal('');
      // 沒有錯誤訊息時，常駐的 live region 不佔版面
      expect(part(el, 'error').getBoundingClientRect().height).to.equal(0);
      expect(el.getBoundingClientRect().height).to.equal(zone(el).getBoundingClientRect().height);

      expect(input(el).type).to.equal('file');
      expect(input(el).hasAttribute('accept')).to.be.false;
      expect(input(el).multiple).to.be.false;
      expect(getComputedStyle(input(el)).display).to.equal('none');
    });

    it('uses a dashed border', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      expect(getComputedStyle(zone(el)).borderTopStyle).to.equal('dashed');
    });

    it('mirrors accept and multiple onto the native input and shows a format hint', async () => {
      const el = await fixture<AuiDropzone>(
        html`<aui-dropzone accept=".json, image/*" multiple></aui-dropzone>`,
      );
      expect(input(el).accept).to.equal('.json, image/*');
      expect(input(el).multiple).to.be.true;
      expect(part(el, 'hint').hidden).to.be.false;
      expect(part(el, 'hint').textContent?.trim()).to.equal('支援格式：.json、image/*');
    });

    it('prefers the hint attribute and a custom accept label', async () => {
      const el = await fixture<AuiDropzone>(
        html`<aui-dropzone accept=".csv" accept-label="Accepts: "></aui-dropzone>`,
      );
      expect(part(el, 'hint').textContent?.trim()).to.equal('Accepts: .csv');

      el.hint = 'CSV，最大 5 MB';
      await el.updateComplete;
      expect(part(el, 'hint').textContent?.trim()).to.equal('CSV，最大 5 MB');
    });

    it('shows the heading attribute even when the host only contains whitespace or named slots', async () => {
      const el = await fixture<AuiDropzone>(html`
        <aui-dropzone heading="Drop a file">
          <span slot="hint">Custom hint</span>
        </aui-dropzone>
      `);
      expect(part(el, 'heading').textContent?.trim()).to.equal('Drop a file');
      expect(part(el, 'hint').hidden).to.be.false;
    });

    it('replaces the heading with slotted content', async () => {
      const el = await fixture<AuiDropzone>(
        html`<aui-dropzone heading="attr">Drop your <b>JSON</b> here</aui-dropzone>`,
      );
      expect(part(el, 'heading').textContent).to.not.contain('attr');
      const slot = part(el, 'heading').querySelector('slot')!;
      expect(
        slot
          .assignedNodes()
          .map((node) => node.textContent)
          .join(''),
      ).to.equal('Drop your JSON here');
    });
  });

  describe('file picker', () => {
    it('opens the native file picker on click and through open()', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      let opened = 0;
      input(el).click = () => opened++; // 不實際開啟系統對話框

      zone(el).click();
      expect(opened).to.equal(1);
      el.open();
      expect(opened).to.equal(2);
    });

    it('lets outside listeners see one click per activation', async () => {
      // 隱藏 input 的 click 不可穿出 Shadow DOM，否則外層的 click 監聽器會被呼叫兩次
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      let clicks = 0;
      el.addEventListener('click', () => clicks++);
      // 保留原生 click 的事件分派，但不開啟系統對話框
      input(el).addEventListener('click', (event) => event.preventDefault());

      zone(el).click();
      expect(clicks).to.equal(1);
    });

    it('does not throw when open() is called before the first render', () => {
      const el = document.createElement('aui-dropzone');
      expect(() => el.open()).to.not.throw();
    });

    it('does not open the picker when disabled', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone disabled></aui-dropzone>`);
      let opened = 0;
      input(el).click = () => opened++;

      zone(el).click();
      el.open();
      expect(opened).to.equal(0);
      expect(zone(el).disabled).to.be.true;
      expect(input(el).disabled).to.be.true;
    });

    it('fires aui-file-drop with source "picker" and clears the input for re-selection', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      const { drops } = record(el);

      pick(el, [jsonFile()]);
      expect(drops).to.have.lengthOf(1);
      expect(drops[0].source).to.equal('picker');
      expect(names(drops[0].files)).to.deep.equal(['data.json']);
      expect(input(el).files!.length, 'input cleared').to.equal(0);

      // 再次選擇同一個檔案仍會觸發
      pick(el, [jsonFile()]);
      expect(drops).to.have.lengthOf(2);
    });

    it('lists only the first few rejected file names', async () => {
      const el = await fixture<AuiDropzone>(
        html`<aui-dropzone accept=".json" multiple></aui-dropzone>`,
      );
      const files = Array.from(
        { length: 8 },
        (_, index) => new File(['x'], `note-${index}.txt`, { type: 'text/plain' }),
      );
      pick(el, files);
      await el.updateComplete;
      const message = el.shadowRoot!.querySelector('[role="alert"]')!.textContent!;
      expect(message).to.include('note-4.txt');
      expect(message).to.not.include('note-5.txt');
      expect(message).to.include('+3');
    });

    it('filters picker selections too (the native filter can be bypassed)', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone accept=".json"></aui-dropzone>`);
      const { drops, rejects } = record(el);
      pick(el, [textFile()]);
      expect(drops).to.have.lengthOf(0);
      expect(rejects).to.have.lengthOf(1);
      expect(rejects[0].source).to.equal('picker');
    });

    it('ignores an empty selection', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      const { drops, rejects } = record(el);
      pick(el, []);
      expect(drops).to.have.lengthOf(0);
      expect(rejects).to.have.lengthOf(0);
    });
  });

  describe('drag feedback', () => {
    it('tints the zone with the accent colour while files are dragged over it', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      zone(el).style.transition = 'none';
      const idle = getComputedStyle(zone(el));
      const idleBackground = idle.backgroundColor;
      const idleBorder = idle.borderTopColor;

      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging')).to.be.true;
      const dragging = getComputedStyle(zone(el));
      expect(dragging.backgroundColor).to.not.equal(idleBackground);
      expect(dragging.borderTopColor).to.equal('rgb(245, 158, 11)');
      expect(dragging.borderTopColor).to.not.equal(idleBorder);

      zone(el).dispatchEvent(fileDrag('dragleave', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging')).to.be.false;
      expect(getComputedStyle(zone(el)).backgroundColor).to.equal(idleBackground);
    });

    it('keeps the feedback while the pointer moves across child elements', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      const child = part(el, 'heading');

      // 進入拖放區 → 進入子元素 → 離開拖放區本身（仍在子元素上）
      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      child.dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      zone(el).dispatchEvent(fileDrag('dragleave', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging'), 'still inside').to.be.true;

      child.dispatchEvent(fileDrag('dragleave', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging'), 'left the zone').to.be.false;
    });

    it('accepts the drop target by cancelling dragover', async () => {
      // dropEffect 只有在真實的拖曳中才能設定，合成事件無法驗證，這裡只確認預設行為被取消
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      const event = fileDrag('dragover', [jsonFile()]);
      zone(el).dispatchEvent(event);
      expect(event.defaultPrevented).to.be.true;
    });

    it('ignores drags that do not carry files', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      const { drops, rejects } = record(el);
      const enter = textDrag('dragenter');
      const over = textDrag('dragover');
      const drop = textDrag('drop');
      for (const event of [enter, over, drop]) zone(el).dispatchEvent(event);
      await el.updateComplete;

      expect(zone(el).classList.contains('is-dragging')).to.be.false;
      expect(over.defaultPrevented).to.be.false;
      expect(drop.defaultPrevented).to.be.false;
      expect(drops).to.have.lengthOf(0);
      expect(rejects).to.have.lengthOf(0);
    });

    it('removes the feedback when disabled mid-drag and restores it when re-enabled', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging')).to.be.true;

      el.disabled = true;
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging'), 'disabled').to.be.false;

      el.disabled = false;
      await el.updateComplete;
      zone(el).dispatchEvent(fileDrag('dragover', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging'), 're-enabled').to.be.true;
    });

    it('clears the feedback when the drag ends elsewhere without a dragleave', async () => {
      for (const end of ['drop', 'dragend'] as const) {
        const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
        zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
        await el.updateComplete;
        expect(zone(el).classList.contains('is-dragging')).to.be.true;

        // 檔案被放在頁面其他地方，或拖曳被取消：拖放區本身收不到事件
        document.body.dispatchEvent(fileDrag(end, [jsonFile()]));
        await el.updateComplete;
        expect(zone(el).classList.contains('is-dragging'), end).to.be.false;
      }
    });

    it('recovers when dragleave does not expose the dragged types', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      zone(el).dispatchEvent(
        new DragEvent('dragleave', { bubbles: true, composed: true, relatedTarget: document.body }),
      );
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging')).to.be.false;
    });

    it('keeps the amber border while hovered during a drag', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      zone(el).style.transition = 'none';
      const rect = zone(el).getBoundingClientRect();
      await sendMouse({
        type: 'move',
        position: [Math.round(rect.x + rect.width / 2), Math.round(rect.y + rect.height / 2)],
      });
      try {
        expect(zone(el).matches(':hover'), 'pointer is over the zone').to.be.true;
        const hoverBorder = getComputedStyle(zone(el)).borderTopColor;
        zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
        await el.updateComplete;
        expect(getComputedStyle(zone(el)).borderTopColor).to.equal('rgb(245, 158, 11)');
        expect(getComputedStyle(zone(el)).borderTopColor).to.not.equal(hoverBorder);
      } finally {
        await resetMouse();
      }
    });

    it('clears the feedback after a drop and when removed mid-drag', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      zone(el).dispatchEvent(fileDrag('drop', [jsonFile()]));
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging')).to.be.false;

      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      await el.updateComplete;
      const parent = el.parentElement!;
      el.remove();
      parent.appendChild(el);
      await el.updateComplete;
      expect(zone(el).classList.contains('is-dragging')).to.be.false;
    });
  });

  describe('dropping files', () => {
    it('captures dropped File objects and fires aui-file-drop', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone multiple></aui-dropzone>`);
      const drop = fileDrag('drop', [jsonFile(), pngFile()]);
      setTimeout(() => zone(el).dispatchEvent(drop));
      const event = (await oneEvent(el, 'aui-file-drop')) as CustomEvent<FileDropDetail>;

      expect(drop.defaultPrevented, 'prevents the browser from opening the file').to.be.true;
      expect(event.bubbles).to.be.true;
      expect(event.composed).to.be.true;
      expect(event.detail.source).to.equal('drop');

      const [json, png] = event.detail.files;
      expect(json).to.be.instanceOf(File);
      expect(png).to.be.instanceOf(File);
      expect(names(event.detail.files)).to.deep.equal(['data.json', 'photo.PNG']);
      expect(json.type).to.equal('application/json');
      expect(png.type).to.equal('image/png');
      // 是可讀取內容的真實 File，而不只是中繼資料
      expect(await json.text()).to.equal('{"ok":true}');
      expect(png.size).to.equal(4);
    });

    it('accepts only the first file when multiple is not set', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone></aui-dropzone>`);
      const { drops, rejects } = record(el);
      zone(el).dispatchEvent(fileDrag('drop', [jsonFile(), pngFile(), textFile()]));
      await el.updateComplete;

      expect(names(drops[0].files)).to.deep.equal(['data.json']);
      expect(names(rejects[0].files)).to.deep.equal(['photo.PNG', 'notes.txt']);
      expect(rejects[0].rejections.map(({ reason }) => reason)).to.deep.equal(['count', 'count']);
      expect(part(el, 'error').textContent?.trim()).to.equal(
        '一次只能選擇一個檔案，已使用第一個檔案',
      );
    });

    it('does nothing when disabled but still prevents the browser from opening the file', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone disabled></aui-dropzone>`);
      const { drops, rejects } = record(el);
      // 停用的按鈕不接收指標事件，真實的拖放會落在外層容器上
      expect(getComputedStyle(zone(el)).pointerEvents).to.equal('none');
      const area = zone(el).parentElement!;
      const rect = area.getBoundingClientRect();
      const hit = el.shadowRoot!.elementFromPoint(
        rect.x + rect.width / 2,
        rect.y + rect.height / 2,
      );
      expect(hit === area, 'pointer events land on the wrapper').to.be.true;
      expect(getComputedStyle(area).cursor).to.equal('not-allowed');

      const enter = fileDrag('dragenter', [jsonFile()]);
      const over = fileDrag('dragover', [jsonFile()]);
      const drop = fileDrag('drop', [jsonFile()]);
      for (const event of [enter, over, drop]) area.dispatchEvent(event);
      await el.updateComplete;

      expect(zone(el).classList.contains('is-dragging')).to.be.false;
      expect(over.defaultPrevented).to.be.true;
      expect(drop.defaultPrevented).to.be.true;
      expect(drops).to.have.lengthOf(0);
      expect(rejects).to.have.lengthOf(0);
    });
  });

  describe('dropped directories', () => {
    /** 模擬拖入資料夾：資料夾在 files 中是一個 File，只能由對應 item 的 entry 判斷 */
    function directoryDrop(files: File[], directoryNames: string[]): DragEvent {
      const event = fileDrag('drop', files);
      const items = files.map((file) => ({
        kind: 'file',
        getAsFile: () => file,
        webkitGetAsEntry: () => ({ isDirectory: directoryNames.includes(file.name) }),
      }));
      Object.defineProperty(event.dataTransfer, 'items', { value: items });
      return event;
    }

    it('rejects folders instead of emitting them as unreadable files', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone multiple></aui-dropzone>`);
      const { drops, rejects } = record(el);
      const folder = new File([], 'assets', { type: '' });
      zone(el).dispatchEvent(directoryDrop([jsonFile(), folder], ['assets']));
      await el.updateComplete;

      expect(names(drops[0].files)).to.deep.equal(['data.json']);
      expect(rejects[0].rejections.map(({ reason }) => reason)).to.deep.equal(['directory']);
      expect(part(el, 'error').textContent?.trim()).to.equal('不支援的檔案格式：assets');
    });

    it('rejects a folder even when its name matches an accepted extension', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone accept=".json"></aui-dropzone>`);
      const { drops, rejects } = record(el);
      const folder = new File([], 'backup.json', { type: '' });
      zone(el).dispatchEvent(directoryDrop([folder], ['backup.json']));
      await el.updateComplete;

      expect(drops).to.have.lengthOf(0);
      expect(rejects[0].rejections[0].reason).to.equal('directory');
    });
  });

  describe('accept filtering', () => {
    async function dropInto(accept: string, files: File[], multiple = true) {
      const el = await fixture<AuiDropzone>(
        html`<aui-dropzone accept=${accept} ?multiple=${multiple}></aui-dropzone>`,
      );
      const events = record(el);
      zone(el).dispatchEvent(fileDrag('drop', files));
      await el.updateComplete;
      return { el, ...events };
    }

    it('matches file extensions case-insensitively', async () => {
      const { drops, rejects } = await dropInto('.json,.png', [jsonFile(), pngFile(), textFile()]);
      expect(names(drops[0].files)).to.deep.equal(['data.json', 'photo.PNG']);
      expect(names(rejects[0].files)).to.deep.equal(['notes.txt']);
      expect(rejects[0].rejections[0].reason).to.equal('type');
    });

    it('matches exact MIME types', async () => {
      const { drops, rejects } = await dropInto('application/json', [jsonFile(), pngFile()]);
      expect(names(drops[0].files)).to.deep.equal(['data.json']);
      expect(names(rejects[0].files)).to.deep.equal(['photo.PNG']);
    });

    it('matches MIME wildcards such as image/*', async () => {
      const { drops, rejects } = await dropInto('IMAGE/*', [jsonFile(), pngFile()]);
      expect(names(drops[0].files)).to.deep.equal(['photo.PNG']);
      expect(names(rejects[0].files)).to.deep.equal(['data.json']);
    });

    it('does not treat a wildcard prefix as a match for unrelated types', async () => {
      const imagex = new File(['x'], 'file.bin', { type: 'imagex/png' });
      const { drops, rejects } = await dropInto('image/*', [imagex]);
      expect(drops).to.have.lengthOf(0);
      expect(rejects).to.have.lengthOf(1);
    });

    it('ignores invalid accept tokens like the native input does', async () => {
      // 全部不合法：等同沒有限制，也不顯示格式提示
      for (const accept of ['json', '*', '*/*', 'text/*', ' , ']) {
        const { el, drops, rejects } = await dropInto(accept, [jsonFile(), textFile()]);
        expect(names(drops[0].files), accept).to.deep.equal(['data.json', 'notes.txt']);
        expect(rejects, accept).to.have.lengthOf(0);
        expect(part(el, 'hint').hidden, accept).to.be.true;
      }

      // 部分不合法：只套用合法的條件，提示也只列出合法的條件
      const { el, drops, rejects } = await dropInto('.json, pdf', [jsonFile(), textFile()]);
      expect(names(drops[0].files)).to.deep.equal(['data.json']);
      expect(names(rejects[0].files)).to.deep.equal(['notes.txt']);
      expect(part(el, 'hint').textContent?.trim()).to.equal('支援格式：.json');
    });

    it('matches by extension when the browser reports no MIME type', async () => {
      const untyped = new File(['# notes'], 'README.md', { type: '' });
      const byExtension = await dropInto('.md', [untyped]);
      expect(names(byExtension.drops[0].files)).to.deep.equal(['README.md']);

      const byType = await dropInto('text/markdown', [untyped]);
      expect(byType.drops).to.have.lengthOf(0);
      expect(byType.rejects[0].rejections[0].reason).to.equal('type');
    });

    it('announces an identical rejection again after the picker is reopened', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone accept=".json"></aui-dropzone>`);
      input(el).click = () => undefined; // 不實際開啟系統對話框
      const error = part(el, 'error');

      pick(el, [textFile()]);
      await el.updateComplete;
      const message = error.textContent?.trim();
      expect(message).to.contain('notes.txt');

      // 重新開啟選取器時先清空，之後出現相同訊息才算是內容變更（live region 才會再播報）
      zone(el).click();
      await el.updateComplete;
      expect(error.textContent?.trim()).to.equal('');

      pick(el, [textFile()]);
      await el.updateComplete;
      expect(error.textContent?.trim()).to.equal(message);
    });

    it('fires only aui-file-reject and shows the file names when nothing matches', async () => {
      const { el, drops, rejects } = await dropInto('.json', [textFile(), pngFile()]);
      expect(drops).to.have.lengthOf(0);
      expect(rejects).to.have.lengthOf(1);
      expect(rejects[0].source).to.equal('drop');

      const error = part(el, 'error');
      expect(error.getAttribute('role')).to.equal('alert');
      expect(error.textContent?.trim()).to.equal('不支援的檔案格式：notes.txt、photo.PNG');
      expect(error.getBoundingClientRect().height).to.be.greaterThan(0);
    });

    it('combines type and count rejections when multiple is not set', async () => {
      const { el, drops, rejects } = await dropInto(
        '.json',
        [textFile(), jsonFile(), jsonFile()],
        false,
      );
      expect(names(drops[0].files)).to.deep.equal(['data.json']);
      expect(rejects[0].rejections.map(({ reason }) => reason)).to.deep.equal(['type', 'count']);
      expect(part(el, 'error').textContent?.trim()).to.equal(
        '不支援的檔案格式：notes.txt 一次只能選擇一個檔案，已使用第一個檔案',
      );
    });

    it('supports custom error messages', async () => {
      const el = await fixture<AuiDropzone>(
        html`<aui-dropzone accept=".json" invalid-type-message="Unsupported: "></aui-dropzone>`,
      );
      zone(el).dispatchEvent(fileDrag('drop', [textFile()]));
      await el.updateComplete;
      expect(part(el, 'error').textContent?.trim()).to.equal('Unsupported: notes.txt');
    });

    it('clears the error on the next successful drop and when a new drag enters', async () => {
      const el = await fixture<AuiDropzone>(html`<aui-dropzone accept=".json"></aui-dropzone>`);
      const error = part(el, 'error');

      zone(el).dispatchEvent(fileDrag('drop', [textFile()]));
      await el.updateComplete;
      expect(error.textContent?.trim()).to.not.equal('');

      zone(el).dispatchEvent(fileDrag('dragenter', [jsonFile()]));
      await el.updateComplete;
      expect(error.textContent?.trim(), 'cleared on dragenter').to.equal('');

      zone(el).dispatchEvent(fileDrag('drop', [textFile()]));
      await el.updateComplete;
      zone(el).dispatchEvent(fileDrag('drop', [jsonFile()]));
      await el.updateComplete;
      expect(error.textContent?.trim(), 'cleared on success').to.equal('');
      expect(error.getBoundingClientRect().height).to.equal(0);
      expect(getComputedStyle(error).marginTop).to.equal('0px');
    });
  });
});
