import type { Meta, StoryObj } from '@storybook/web-components';
import { expect, userEvent, waitFor } from '@storybook/test';
import { html } from 'lit';
import '../components/alert/index.js';
import '../components/button/index.js';
import '../components/field/index.js';
import '../components/input/index.js';
import '../components/modal/index.js';
import '../components/output/index.js';
import '../components/segmented/index.js';
import '../components/toast/index.js';
import { AlertService } from '../components/alert/alert-service.js';
import { ToastService } from '../components/toast/toast-service.js';
import type { AuiAlert } from '../components/alert/alert.js';
import type { AuiInput } from '../components/input/input.js';
import type { AuiModal } from '../components/modal/modal.js';
import type { AuiOutput } from '../components/output/output.js';
import type { AuiSegmented } from '../components/segmented/segmented.js';
import type { SegmentedOption } from '../components/segmented/segmented.types.js';
import {
  chooseOption,
  clickButton,
  deepActiveElement,
  inShadow,
  query,
  toastViewport,
  typeInto,
  visibleToasts,
} from './play-utils.js';

/**
 * TASK-213：表單與回饋的整合情境，以 play function 驗證跨元件互動。
 * `pnpm test:storybook` 以 Storybook Test Runner 對 build-storybook 產物執行所有 story（含這些 play function）。
 */
const meta: Meta = {
  title: 'Scenarios',
  parameters: {
    docs: {
      description: {
        component:
          '表單與回饋元件的整合情境。每個情境都附有 play function（可於 Interactions 面板逐步檢視），並由 Storybook Test Runner 在 CI 中執行。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ─── 1. 註冊表單 ─── */

const PLANS: SegmentedOption[] = [
  { value: 'free', label: 'Free' },
  { value: 'pro', label: 'Pro' },
  { value: 'team', label: 'Team' },
];

/** 依目前的表單值更新預覽摘要（Email 格式不符時以警告呈現） */
function updatePreview(form: HTMLFormElement): void {
  const name = form.querySelector<AuiInput>('[name="name"]')!;
  const email = form.querySelector<AuiInput>('[name="email"]')!;
  const plan = form.querySelector<AuiSegmented>('[name="plan"]')!;
  const preview = form.querySelector<AuiOutput>('#preview')!;
  const parts = [
    name.value,
    email.value && `<${email.value}>`,
    plan.value && `方案：${plan.value}`,
  ];
  preview.value = parts.filter(Boolean).join(' ');
  preview.status = email.value && email.validity?.typeMismatch ? 'warning' : 'success';
}

export const RegistrationForm: Story = {
  name: '註冊表單（驗證、預覽、送出、重設）',
  render: () => {
    const handleSubmit = (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;
      const data = Object.fromEntries(new FormData(form));
      form.querySelector('#result')!.textContent = JSON.stringify(data);
      ToastService.success(`歡迎加入，${String(data.name)}！`, { id: 'signup' });
    };
    const handleReset = (event: Event) => {
      const form = event.target as HTMLFormElement;
      form.querySelector('#result')!.textContent = '';
      // reset 事件先於控制項還原觸發，下一個 microtask 才讀得到還原後的值
      void Promise.resolve().then(() => updatePreview(form));
    };
    return html`
      <form
        id="signup"
        style="display: flex; flex-direction: column; gap: 16px; max-width: 480px;"
        @input=${(event: Event) => updatePreview(event.currentTarget as HTMLFormElement)}
        @change=${(event: Event) => updatePreview(event.currentTarget as HTMLFormElement)}
        @submit=${handleSubmit}
        @reset=${handleReset}
      >
        <aui-field label="名稱" description="2 至 20 個字元">
          <aui-input name="name" required minlength="2" maxlength="20"></aui-input>
        </aui-field>
        <aui-field label="Email">
          <aui-input name="email" type="email" required placeholder="name@example.com"></aui-input>
        </aui-field>
        <aui-field label="方案">
          <aui-segmented name="plan" required .options=${PLANS}></aui-segmented>
        </aui-field>
        <aui-field label="備註">
          <aui-input name="notes" multiline rows="2"></aui-input>
        </aui-field>
        <aui-field label="預覽" copyable>
          <aui-output id="preview" placeholder="填寫後顯示摘要"></aui-output>
        </aui-field>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <aui-button id="reset" type="reset" variant="ghost">重設</aui-button>
          <aui-button id="submit" type="submit">送出</aui-button>
        </div>
        <pre id="result" style="margin: 0; font-family: var(--font-mono); font-size: 12px;"></pre>
      </form>
    `;
  },
  play: async ({ canvasElement, step }) => {
    await ToastService.closeAll();
    const form = query<HTMLFormElement>(canvasElement, '#signup');
    const name = query<AuiInput>(form, '[name="name"]');
    const email = query<AuiInput>(form, '[name="email"]');
    const plan = query<AuiSegmented>(form, '[name="plan"]');
    const notes = query<AuiInput>(form, '[name="notes"]');
    const preview = query<AuiOutput>(form, '#preview');
    const result = query(form, '#result');

    await step('必填欄位未填時，送出會被原生驗證擋下', async () => {
      await clickButton(query(form, '#submit'));
      await expect(result.textContent).toBe('');
      await expect(name.validity?.valueMissing).toBe(true);
      await expect(plan.validity?.valueMissing).toBe(true);
      await expect(form.checkValidity()).toBe(false);
    });

    await step('Email 格式不符時，預覽以警告呈現', async () => {
      await typeInto(name, 'Anchor');
      await typeInto(email, 'anchor@');
      await expect(email.validity?.typeMismatch).toBe(true);
      await expect(preview.status).toBe('warning');
    });

    await step('補齊欄位：鍵盤切換方案、填寫多行備註，預覽即時更新', async () => {
      await typeInto(email, 'example.com');
      await chooseOption(plan, 0);
      await userEvent.keyboard('{ArrowRight}');
      await expect(plan.value).toBe('pro');
      await typeInto(notes, 'Line 1{Enter}Line 2');
      await expect(notes.value).toBe('Line 1\nLine 2');
      await expect(preview.status).toBe('success');
      await expect(preview.value).toBe('Anchor <anchor@example.com> 方案：pro');
    });

    await step('送出：FormData 帶出所有值，並以 Toast 通知', async () => {
      await clickButton(query(form, '#submit'));
      await expect(JSON.parse(result.textContent!)).toEqual({
        name: 'Anchor',
        email: 'anchor@example.com',
        plan: 'pro',
        notes: 'Line 1\nLine 2',
      });
      const viewport = toastViewport();
      await waitFor(() =>
        expect(visibleToasts(viewport).map((toast) => toast.message)).toEqual([
          '歡迎加入，Anchor！',
        ]),
      );
      await expect(visibleToasts(viewport)[0].variant).toBe('success');
    });

    await step('重設：所有欄位還原，預覽清空', async () => {
      await clickButton(query(form, '#reset'));
      await waitFor(() => expect(name.value).toBe(''));
      await expect(email.value).toBe('');
      await expect(plan.value).toBe('');
      await expect(notes.value).toBe('');
      await expect(preview.value).toBe('');
      await expect(result.textContent).toBe('');
    });

    await ToastService.closeAll();
  },
};

/* ─── 2. 非同步儲存通知 ─── */

/** 模擬非同步儲存：Loading 通知原地轉為 Success 或 Error */
async function save(shouldFail: boolean): Promise<void> {
  const toast = ToastService.loading('儲存中…', { id: 'save' });
  await delay(400);
  if (shouldFail) {
    toast.update({ variant: 'error', title: '儲存失敗', message: '連線逾時，請稍後再試' });
  } else {
    toast.update({ variant: 'success', title: '', message: '已儲存' });
  }
}

export const AsyncSave: Story = {
  name: '非同步儲存（Loading 轉 Success / Error）',
  render: () => html`
    <div style="display: flex; gap: 8px;">
      <aui-button id="save" @click=${() => save(false)}>儲存</aui-button>
      <aui-button id="save-fail" variant="danger" @click=${() => save(true)}
        >儲存（模擬失敗）</aui-button
      >
    </div>
  `,
  play: async ({ canvasElement, step }) => {
    await ToastService.closeAll();

    await step('儲存：先顯示 Loading，完成後原地更新為 Success', async () => {
      await clickButton(query(canvasElement, '#save'));
      const viewport = toastViewport();
      await waitFor(() => expect(visibleToasts(viewport)).toHaveLength(1));
      const [toast] = visibleToasts(viewport);
      await expect(toast.variant).toBe('loading');
      await expect(inShadow(toast, '[part~="icon"] .aui-spinner')).toBeTruthy();
      await expect(inShadow(toast, '[part~="content"]').getAttribute('role')).toBe('status');

      await waitFor(() => expect(toast.variant).toBe('success'));
      await expect(toast.message).toBe('已儲存');
      await expect(visibleToasts(viewport), '同一則通知被更新，而非新增').toEqual([toast]);
    });

    await step('失敗：轉為 Error，並改以 alert live region 播報', async () => {
      await clickButton(query(canvasElement, '#save-fail'));
      const viewport = toastViewport();
      await waitFor(() => expect(visibleToasts(viewport)[0]?.variant).toBe('error'));
      const [toast] = visibleToasts(viewport);
      await expect(toast.heading).toBe('儲存失敗');
      await waitFor(() =>
        expect(inShadow(toast, '[part~="content"]').getAttribute('role')).toBe('alert'),
      );
      await expect(inShadow(toast, '[part~="content"]').textContent).toContain('連線逾時');
    });

    await ToastService.closeAll();
  },
};

/* ─── 3. 在 Modal 中確認刪除 ─── */

export const ConfirmDeleteInModal: Story = {
  name: 'Modal 中確認刪除（Alert + Toast 疊加）',
  render: () => {
    const remove = async (event: Event) => {
      const item = (event.currentTarget as HTMLElement).closest('li')!;
      const label = item.dataset.name!;
      const confirmed = await AlertService.confirm({
        icon: 'warning',
        title: `刪除「${label}」？`,
        message: '刪除後無法復原。',
        confirmText: '刪除',
        destructive: true,
      });
      if (!confirmed) return;
      item.remove();
      ToastService.success(`已刪除「${label}」`);
    };
    return html`
      <div class="scenario">
        <aui-button
          id="open"
          @click=${(event: Event) => {
            (event.currentTarget as HTMLElement)
              .closest('.scenario')!
              .querySelector<AuiModal>('aui-modal')!.open = true;
          }}
          >管理項目</aui-button
        >
        <aui-modal heading="項目">
          <ul
            style="display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none;"
          >
            ${['報告.pdf', '草稿.docx'].map(
              (name) => html`
                <li
                  data-name=${name}
                  style="display: flex; justify-content: space-between; align-items: center;"
                >
                  <span>${name}</span>
                  <aui-button size="sm" variant="danger" @click=${remove}>刪除</aui-button>
                </li>
              `,
            )}
          </ul>
        </aui-modal>
      </div>
    `;
  },
  play: async ({ canvasElement, step }) => {
    await ToastService.closeAll();
    const modal = query<AuiModal>(canvasElement, 'aui-modal');
    const deleteButtonOf = (name: string) => query(modal, `li[data-name="${name}"] aui-button`);
    const openAlert = () => document.body.querySelector<AuiAlert>(':scope > aui-alert');

    await step('開啟 Modal', async () => {
      await clickButton(query(canvasElement, '#open'));
      await waitFor(() => expect(inShadow<HTMLDialogElement>(modal, 'dialog').open).toBe(true));
    });

    await step('破壞性確認：初始焦點在取消鈕，按 Enter 取消，項目保留', async () => {
      await clickButton(deleteButtonOf('報告.pdf'));
      await waitFor(() => expect(openAlert()?.open).toBe(true));
      const alert = openAlert()!;
      const cancel = inShadow(inShadow(alert, '[part~="cancel-button"]'), 'button');
      await waitFor(() => expect(deepActiveElement()).toBe(cancel));

      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(openAlert()).toBeNull());
      await expect(modal.querySelector('li[data-name="報告.pdf"]')).toBeTruthy();
      await expect(modal.open, 'Modal 仍開啟').toBe(true);
    });

    await step('確認刪除：項目移除，Toast 出現在 Modal 之上', async () => {
      await clickButton(deleteButtonOf('報告.pdf'));
      await waitFor(() => expect(openAlert()?.open).toBe(true));
      await clickButton(inShadow(openAlert()!, '[part~="confirm-button"]'));

      await waitFor(() => expect(modal.querySelector('li[data-name="報告.pdf"]')).toBeNull());
      await waitFor(() =>
        expect(visibleToasts(toastViewport()).map((toast) => toast.message)).toEqual([
          '已刪除「報告.pdf」',
        ]),
      );
      // Modal 開啟期間 Viewport 移入其 overlay slot，才不會被 modal 的 inert 邊界擋住
      await expect(toastViewport()?.parentElement).toBe(modal);
    });

    await step('關閉 Modal：通知回到頁面，焦點返還至開啟按鈕', async () => {
      await userEvent.click(inShadow(modal, '[part="close-button"]'));
      await waitFor(() => expect(modal.open).toBe(false));
      await waitFor(() => expect(toastViewport()?.parentElement).toBe(document.body));
      await waitFor(() =>
        expect(deepActiveElement()).toBe(inShadow(query(canvasElement, '#open'), 'button')),
      );
    });

    await ToastService.closeAll();
  },
};
