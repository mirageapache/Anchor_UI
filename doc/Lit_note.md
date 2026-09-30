# Lit 核心語法與 Web Component 開發指南 (Anchor UI Note)

> 本手冊記錄 Anchor UI 元件庫所採用的 [Lit](https://lit.dev/) 核心架構、語法特性、渲染機制與最佳實踐，並以已實作的 [`<aui-button>`](src/components/button/button.ts) 為示範實例。

---

## 1. 什麼是 Lit？

**Lit** 是一套由 Google 發起、專注於現代 **Web Components** 標準的輕量宣告式 UI 函式庫（壓縮後約 5KB）。

### 核心特性

- **基於標準 Web Components**：產物為原生客製化 HTML 標籤（Custom Elements），具備跨框架能力（相容於 React、Vue、Angular、Svelte 或純 HTML）。
- **樣式封裝（Shadow DOM）**：內部樣式完全隔離，不污染外部全域 CSS，外部樣式也無法意外破壞內部排版。
- **高效反應式渲染**：利用 ES6 模板字面量標籤（Tagged Template Literals `html`...``），只在相依屬性變更時精確更新該 DOM 節點，無 Virtual DOM 開銷。

---

## 2. 元件基本架構與生命週期

一個標準的 Lit 元件類別由以下核心部分組成：

```typescript
import { LitElement, html, css, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export class AuiExample extends LitElement {
  // 1. 隔離樣式（Shadow DOM Scoped CSS）
  static override styles = css`
    :host {
      display: inline-block;
    }
  `;

  // 2. Shadow Root 選項（焦點委派）
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true, // 焦點自動轉移至內部具可聚焦性的子節點
  };

  // 3. 反應式屬性（外部傳入）
  @property({ type: String, reflect: true })
  label = '';

  // 4. 內部私有狀態（內部變更）
  @state()
  private isOpen = false;

  // 5. 渲染函式
  override render() {
    return html`<div>${this.label}</div>`;
  }
}

// 6. 自訂元素註冊（含多重載入防禦）
if (!customElements.get('aui-example')) {
  customElements.define('aui-example', AuiExample);
}

// 7. 全域型別註冊（提供 TS/IDE 補完）
declare global {
  interface HTMLElementTagNameMap {
    'aui-example': AuiExample;
  }
}
```

### 生命週期階段速查

| 方法                         | 觸發時機                            | 典型用途                                                               |
| :--------------------------- | :---------------------------------- | :--------------------------------------------------------------------- |
| `constructor()`              | 節點實例化時                        | 初始化非反應式成員、註冊宿主原生監聽器                                 |
| `connectedCallback()`        | 元件掛載進 DOM 樹時                 | 監聽全域事件（如 `window`、`document`）、啟動定時器                    |
| `disconnectedCallback()`     | 元件自 DOM 卸載時                   | **務必清理**全域監聽器、定時器與觀察者（防止記憶體洩漏）               |
| `firstUpdated(changedProps)` | 首次 `render()` 完成並渲染至 DOM 後 | 類似 `mounted`，可測量 DOM 尺寸、初始化 Canvas/外部第三方 SDK          |
| `updated(changedProps)`      | 任何反應式屬性變更且重繪完成後      | 類似 `componentDidUpdate`，可依據 `changedProps.has('key')` 執行副作用 |

---

## 3. 反應式屬性與狀態 (`@property` vs `@state`)

Lit 提供兩組裝飾器來管理資料與自動排程重繪：

### 3.1 `@property`（外部公開 API / HTML 屬性）

定義外部可透過 HTML 屬性或 JavaScript Property 傳入的屬性：

```typescript
// 1. 一般字串屬性
@property({ type: String, reflect: true })
variant: 'primary' | 'secondary' = 'primary';

// 2. 布林值屬性（符合 HTML 標準規範：存在即為 true，不存在即為 false）
@property({ type: Boolean, reflect: true })
disabled = false;

// 3. 名稱映射（JS camelCase 轉 HTML kebab-case）
@property({ type: Boolean, reflect: true, attribute: 'full-width' })
fullWidth = false;

// 4. 數值與物件屬性
@property({ type: Number }) count = 0;
@property({ type: Object }) options = {};
```

#### 重要參數說明：

- **`type`**：指定轉換器（`String`、`Boolean`、`Number`、`Object`、`Array`），負責將 HTML 標籤上的字串屬性轉換為 JS 型別。
- **`reflect: true`（屬性反射）**：
  - 當元件內部更新 JS 屬性時（例如 `this.disabled = true`），Lit 會自動把屬性同步寫回 HTML 標籤上：`<aui-button disabled>`。
  - **重要目的**：允許 CSS 使用 `:host([disabled])` 或 `:host([variant='primary'])` 選取器根據狀態套用樣式。
- **`attribute`**：自訂 HTML 標籤屬性名稱（預設會自動轉為全小寫）。

### 3.2 `@state`（內部私有狀態）

純粹作為元件內部狀態，**不對外暴露 HTML 屬性**，但變更時同樣觸發重新渲染：

```typescript
@state()
private isFocused = false;
```

---

## 4. 模板語法與資料綁定（`html` 標籤）

Lit 模板採用 `html\`...\`` 語法，擁有 4 種核心綁定模式：

### 4.1 屬性與資料綁定運算子

| 運算子     | 類型          | 語法範例                         | 說明                                                           |
| :--------- | :------------ | :------------------------------- | :------------------------------------------------------------- |
| **無前綴** | **HTML 屬性** | `id=${this.btnId}`               | 綁定一般 HTML 標籤屬性（自動轉為字串）                         |
| **`?`**    | **布林屬性**  | **`?disabled=${this.disabled}`** | **關鍵**：值為真時加上該屬性，為假時**徹底移除該 HTML 屬性**   |
| **`.`**    | **DOM 屬性**  | `.value=${this.complexData}`     | 直接寫入 DOM 物件屬性（非 HTML 屬性字串，傳遞物件/陣列時使用） |
| **`@`**    | **事件監聽**  | `@click=${this.handleClick}`     | 綁定原生或自訂事件監聽器                                       |

### 4.2 樣式與 Class 指令

Lit 官方提供 `classMap` 與 `styleMap` 指令（Directives）：

```typescript
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

html`
  <div
    class=${classMap({
      'aui-btn': true,
      'aui-btn--active': this.isActive,
      'aui-btn--disabled': this.disabled,
    })}
    style=${styleMap({
      backgroundColor: this.bgColor,
      opacity: this.disabled ? '0.5' : '1',
    })}
  ></div>
`;
```

### 4.3 條件與迴圈渲染

在 Lit 模板內直接使用原生的 JavaScript 表達式：

```typescript
// 1. 三元運算子
${this.loading
  ? html`<span class="spinner"></span>`
  : html`<slot></slot>`
}

// 2. 條件不渲染時使用 nothing（比 null 或 '' 更乾淨，不產生任何文字節點）
${this.showBadge
  ? html`<span class="badge">${this.badgeCount}</span>`
  : nothing
}

// 3. 陣列列表渲染（map）
<ul>
  ${this.items.map((item) => html`<li>${item.name}</li>`)}
</ul>
```

---

## 5. Shadow DOM、樣式封裝與 `:host`

Web Components 的核心在於 Shadow DOM，以下是關鍵 CSS 規範：

### 5.1 `:host` 與狀態偽類

```scss
// :host 代表宿主元素本體（如 <aui-button>）
:host {
  display: inline-block;
  vertical-align: middle;
}

// 隱藏宿主節點（遵守原生 hidden 屬性）
:host([hidden]) {
  display: none !important;
}

// 依據反射屬性套用樣式
:host([disabled]) {
  cursor: not-allowed;
  pointer-events: none;
}

// 鍵盤聚焦外框
:host(:focus-visible) {
  outline: 2px solid var(--color-brand-500);
}
```

### 5.2 CSS Shadow Parts (`part="..."` 與 `::part`)

為了提供外部使用者客製化樣式的途徑，同時避免破壞內部封裝，Lit 支援標準 **CSS Parts**：

```html
<!-- 元件內部模板 -->
<button part="button">
  <span part="label"><slot></slot></span>
</button>
```

```css
/* 外部使用者自訂樣式（不需穿透 Shadow DOM） */
aui-button::part(button) {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

aui-button::part(label) {
  font-weight: 700;
}
```

### 5.3 CSS 變數穿透 (Design Tokens)

CSS 自訂屬性（`var(--token)`）可以**無阻礙自由穿透 Shadow DOM**，這是 Anchor UI 串接設計標記（Design Tokens）的核心機制：

```css
.btn {
  background-color: var(--color-brand-600, #0f4c81);
  border-radius: var(--radius-md, 8px);
}
```

---

## 6. 插槽（Slots）與內容分發

Shadow DOM 使用 `<slot>` 將外部使用者傳入的 HTML 投影到元件特定位置：

```html
<!-- 元件內部模板 -->
<div class="wrapper">
  <!-- 具名插槽（Named Slot） -->
  <slot name="prefix"></slot>

  <!-- 預設插槽（Default Slot） -->
  <slot></slot>

  <!-- 具名插槽 -->
  <slot name="suffix"></slot>
</div>
```

```html
<!-- 外部使用範例 -->
<aui-button variant="primary">
  <aui-icon name="check" slot="prefix"></aui-icon>
  確認送出
  <aui-icon name="arrow-right" slot="suffix"></aui-icon>
</aui-button>
```

---

## 7. 事件處理與跨 Shadow DOM 穿透

Web Components 派發事件時，需注意 Shadow DOM 邊界阻擋：

### 7.1 自訂事件標準派發方式

```typescript
private emitChange(newValue: string) {
  this.dispatchEvent(
    new CustomEvent('aui-change', {
      detail: { value: newValue }, // 攜帶資料
      bubbles: true,   // 允許事件向上冒泡
      composed: true,  // 關鍵！composed: true 才能穿透 Shadow DOM 邊界到達外層 document
    })
  );
}
```

### 7.2 捕獲階段攔截宿主事件

如果元件處於 `disabled` 或 `loading`，必須在 Host 層級攔截並終止所有點擊事件，避免外部綁定的 `@click` 仍被觸發：

```typescript
constructor() {
  super();
  // 在 capture 捕獲階段最早攔截
  this.addEventListener('click', this.handleHostClick, { capture: true });
}

private handleHostClick = (event: MouseEvent) => {
  if (this.disabled || this.loading) {
    event.preventDefault();
    event.stopImmediatePropagation(); // 阻止同節點及後續所有事件監聽器執行
  }
};
```

---

## 8. 完整實例解析：`AuiButton`

以下拆解 [`src/components/button/button.ts`](src/components/button/button.ts) 的關鍵程式碼設計：

```typescript
import { LitElement, html, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { buttonStyles } from './button.styles.js';
import type { ButtonSize, ButtonType, ButtonVariant } from './button.types.js';

export class AuiButton extends LitElement {
  // 1. 樣式載入
  static override styles = buttonStyles;

  // 2. 焦點委派給內部的原生 <button>
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  // 3. 反應式屬性
  @property({ type: String, reflect: true }) variant: ButtonVariant = 'primary';
  @property({ type: String, reflect: true }) size: ButtonSize = 'md';
  @property({ type: String, reflect: true }) type: ButtonType = 'button';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;

  constructor() {
    super();
    // 4. 捕獲階段阻斷 disabled/loading 的點擊行為
    this.addEventListener('click', this.handleHostClick, { capture: true });
  }

  private handleHostClick = (event: MouseEvent) => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    // 5. 原生表單提交/重設連動
    if (this.type === 'submit') {
      const form = this.closest('form');
      if (form) {
        event.preventDefault();
        form.requestSubmit();
      }
    } else if (this.type === 'reset') {
      const form = this.closest('form');
      if (form) {
        event.preventDefault();
        form.reset();
      }
    }
  };

  // 6. 封裝公開方法（原生焦點對齊）
  override focus(options?: FocusOptions): void {
    this.shadowRoot?.querySelector<HTMLButtonElement>('button')?.focus(options);
  }

  override blur(): void {
    this.shadowRoot?.querySelector<HTMLButtonElement>('button')?.blur();
  }

  // 7. 宣告式渲染
  override render() {
    const isInactive = this.disabled || this.loading;

    return html`
      <button
        part="button"
        class=${classMap({
          btn: true,
          [`btn--${this.variant}`]: true,
          [`btn--${this.size}`]: true,
          'btn--disabled': this.disabled,
          'btn--loading': this.loading,
        })}
        type=${this.type}
        ?disabled=${isInactive}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-disabled=${isInactive ? 'true' : 'false'}
      >
        ${
          this.loading
            ? html`
                <span class="btn__spinner" part="spinner" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                  </svg>
                </span>
              `
            : html`
                <span class="btn__prefix" part="prefix">
                  <slot name="prefix"></slot>
                </span>
              `
        }

        <span class="btn__label" part="label">
          <slot></slot>
        </span>

        ${
          !this.loading
            ? html`
                <span class="btn__suffix" part="suffix">
                  <slot name="suffix"></slot>
                </span>
              `
            : nothing
        }
      </button>
    `;
  }
}

// 8. 註冊
if (!customElements.get('aui-button')) {
  customElements.define('aui-button', AuiButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'aui-button': AuiButton;
  }
}
```

---

## 9. 新元件實作檢核清單（Anchor UI 開發標準）

在實作下一個元件時，請依循以下標準步驟：

1. [ ] **介面型別**：於 `[name].types.ts` 定義 Variants, Sizes 與其他 Props 型別。
2. [ ] **隔離樣式**：於 `[name].styles.ts` 撰寫 `css\`...\``樣式，設定`:host`、`:host([hidden])` 與各變體樣式，並充分利用 Design Tokens。
3. [ ] **元件核心**：於 `[name].ts` 繼承 `LitElement`，定義 `@property({ reflect: true })` 與 `render()`。
4. [ ] **CSS Parts**：內部結構加上 `part="..."` 標籤，提供外部自訂樣式接口。
5. [ ] **無障礙支援**：設定合適的 `aria-*` 屬性與鍵盤操作支援（Focus trap / Enter / Space / Arrow 鍵）。
6. [ ] **註冊與防禦**：使用 `customElements.get` 進行防重複註冊，並宣告 `HTMLElementTagNameMap`。
7. [ ] **公開匯出**：於 `index.ts` 與 `src/components/index.ts` 導出。
8. [ ] **Storybook 驗證**：撰寫 `*.stories.ts` 驗證淺色與深色模式。
