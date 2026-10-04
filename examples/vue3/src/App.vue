<script setup lang="ts">
import { ref } from 'vue';

// ─── 主題模式切換 ───
const isDark = ref(false);
const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

// ─── 1. Button 互動狀態 ───
const buttonClickCount = ref(0);
const buttonVariant = ref<'primary' | 'accent' | 'ghost' | 'danger' | 'success'>('primary');
const buttonSize = ref<'sm' | 'md' | 'lg'>('md');
const buttonLoading = ref(false);
const buttonDisabled = ref(false);
const lastSubmittedValue = ref('');
const inputValue = ref('Vue 3 Reactive Input');

const handleButtonClick = () => {
  buttonClickCount.value++;
};

const handleFormSubmit = () => {
  lastSubmittedValue.value = inputValue.value;
};

// ─── 2. Tag 互動狀態 ───
interface TagItem {
  id: number;
  label: string;
  variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  active: boolean;
}

const tags = ref<TagItem[]>([
  { id: 1, label: 'vue-3.5', variant: 'brand', active: true },
  { id: 2, label: 'typescript', variant: 'info', active: false },
  { id: 3, label: 'web-components', variant: 'purple', active: true },
  { id: 4, label: 'production', variant: 'success', active: false },
  { id: 5, label: 'deprecated', variant: 'danger', active: false },
]);
const isPill = ref(true);
const selectedTagName = ref('vue-3.5');

const handleTagClick = (tag: TagItem) => {
  tag.active = !tag.active;
  selectedTagName.value = tag.label;
};

const handleTagRemove = (id: number) => {
  tags.value = tags.value.filter((t) => t.id !== id);
};

const resetTags = () => {
  tags.value = [
    { id: 1, label: 'vue-3.5', variant: 'brand', active: true },
    { id: 2, label: 'typescript', variant: 'info', active: false },
    { id: 3, label: 'web-components', variant: 'purple', active: true },
    { id: 4, label: 'production', variant: 'success', active: false },
    { id: 5, label: 'deprecated', variant: 'danger', active: false },
  ];
};

// ─── 3. Tooltip 互動狀態 ───
const tooltipContent = ref('即時動態提示文字內容');
const tooltipPlacement = ref<'top' | 'bottom' | 'left' | 'right'>('top');
const hasArrow = ref(true);

// ─── 4. IconButton 互動狀態 ───
const copySnippet = ref('npm install @anchor-ui/core');
const copyFeedbackText = ref('');
const iconPreset = ref<'copy' | 'download' | 'refresh' | 'external'>('copy');

const handleCopySuccess = (event: Event) => {
  const customEvent = event as CustomEvent<{ value: string }>;
  copyFeedbackText.value = `已成功複製：${customEvent.detail.value}`;
};

const handleDownload = (event: Event) => {
  const customEvent = event as CustomEvent<{ url?: string; filename?: string }>;
  copyFeedbackText.value = `下載事件觸發：${customEvent.detail.filename || 'default'}`;
};
</script>

<template>
  <div class="demo-container">
    <!-- 頂部標頭列 -->
    <header class="demo-header">
      <div class="header-titles">
        <h1>Anchor UI — Vue 3 整合測試驗證</h1>
        <p class="subtitle">
          驗證 Web Components 於 Vue 3 中之 <code>@click</code> 原生事件、響應式 props
          綁定與主題切換。
        </p>
      </div>

      <div class="header-actions">
        <aui-button id="theme-toggle-btn" variant="ghost" size="sm" @click="toggleTheme">
          <span slot="prefix">{{ isDark ? '☀️' : '🌙' }}</span>
          {{ isDark ? '切換淺色模式' : '切換深色模式' }}
        </aui-button>
      </div>
    </header>

    <main class="demo-grid">
      <!-- 測試卡片 1：Button 元件 -->
      <section class="card" id="card-button">
        <div class="card-header">
          <h2>1. Button 元件 (&lt;aui-button&gt;)</h2>
          <span class="badge">TASK-101</span>
        </div>

        <div class="control-panel">
          <label>
            變體 (variant)：
            <select v-model="buttonVariant" id="select-button-variant">
              <option value="primary">primary</option>
              <option value="accent">accent</option>
              <option value="ghost">ghost</option>
              <option value="danger">danger</option>
              <option value="success">success</option>
            </select>
          </label>

          <label>
            尺寸 (size)：
            <select v-model="buttonSize" id="select-button-size">
              <option value="sm">sm (32px)</option>
              <option value="md">md (40px)</option>
              <option value="lg">lg (48px)</option>
            </select>
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="buttonLoading" id="chk-button-loading" />
            載入中 (loading)
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="buttonDisabled" id="chk-button-disabled" />
            停用 (disabled)
          </label>
        </div>

        <div class="preview-stage">
          <aui-button
            id="target-button"
            :variant="buttonVariant"
            :size="buttonSize"
            :loading="buttonLoading"
            :disabled="buttonDisabled"
            @click="handleButtonClick"
          >
            <span slot="prefix">⚡</span>
            點擊觸發 Vue 狀態
            <span slot="suffix">→</span>
          </aui-button>
        </div>

        <div class="result-box">
          <p id="click-counter-text">
            累計點擊次數：<strong>{{ buttonClickCount }}</strong> 次
          </p>
        </div>

        <!-- 表單原生提交測試 -->
        <div class="sub-section">
          <h3>原生 Form 提交連動</h3>
          <form @submit.prevent="handleFormSubmit" class="demo-form">
            <input v-model="inputValue" id="form-input" class="text-input" />
            <aui-button type="submit" variant="accent" size="sm" id="form-submit-btn">
              提交表單
            </aui-button>
          </form>
          <p v-if="lastSubmittedValue" id="form-result-text" class="sub-result">
            已提交數值：<code>{{ lastSubmittedValue }}</code>
          </p>
        </div>
      </section>

      <!-- 測試卡片 2：Tag 元件 -->
      <section class="card" id="card-tag">
        <div class="card-header">
          <h2>2. Tag 元件 (&lt;aui-tag&gt;)</h2>
          <span class="badge">TASK-102</span>
        </div>

        <div class="control-panel">
          <label class="checkbox-label">
            <input type="checkbox" v-model="isPill" id="chk-tag-pill" />
            膠囊造型 (pill)
          </label>
          <aui-button variant="ghost" size="sm" @click="resetTags" id="btn-reset-tags">
            重設標籤清單
          </aui-button>
        </div>

        <div class="preview-stage tag-list">
          <aui-tag
            v-for="tag in tags"
            :key="tag.id"
            :id="`tag-${tag.id}`"
            :variant="tag.variant"
            :pill="isPill"
            interactive
            removable
            @click="handleTagClick(tag)"
            @aui-remove="handleTagRemove(tag.id)"
          >
            <span slot="prefix" v-if="tag.active">●</span>
            {{ tag.label }}
          </aui-tag>
        </div>

        <div class="result-box">
          <p id="tag-selection-text">
            最後選取項目：<strong>{{ selectedTagName }}</strong>
          </p>
          <p id="tag-count-text">
            目前標籤總數：<strong>{{ tags.length }}</strong> 個
          </p>
        </div>
      </section>

      <!-- 測試卡片 3：Tooltip 元件 -->
      <section class="card" id="card-tooltip">
        <div class="card-header">
          <h2>3. Tooltip 元件 (&lt;aui-tooltip&gt;)</h2>
          <span class="badge">TASK-103</span>
        </div>

        <div class="control-panel">
          <label>
            方位 (placement)：
            <select v-model="tooltipPlacement" id="select-tooltip-placement">
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="left">left</option>
              <option value="right">right</option>
            </select>
          </label>

          <label>
            提示文字 (content)：
            <input v-model="tooltipContent" id="input-tooltip-content" class="text-input" />
          </label>

          <label class="checkbox-label">
            <input type="checkbox" v-model="hasArrow" id="chk-tooltip-arrow" />
            顯示指標箭頭 (arrow)
          </label>
        </div>

        <div class="preview-stage center-stage">
          <aui-tooltip
            id="test-tooltip"
            :content="tooltipContent"
            :placement="tooltipPlacement"
            :arrow="hasArrow"
          >
            <aui-button variant="ghost" id="tooltip-target-btn">懸停或聚焦查看提示</aui-button>
          </aui-tooltip>
        </div>
      </section>

      <!-- 測試卡片 4：IconButton 元件 -->
      <section class="card" id="card-icon-button">
        <div class="card-header">
          <h2>4. Icon Button 元件 (&lt;aui-icon-button&gt;)</h2>
          <span class="badge">TASK-104</span>
        </div>

        <div class="control-panel">
          <label>
            預設圖示行為 (preset)：
            <select v-model="iconPreset" id="select-icon-preset">
              <option value="copy">copy (點擊複製)</option>
              <option value="download">download (點擊下載)</option>
              <option value="refresh">refresh</option>
              <option value="external">external</option>
            </select>
          </label>

          <label>
            複製文字內容：
            <input v-model="copySnippet" id="input-copy-snippet" class="text-input" />
          </label>
        </div>

        <div class="preview-stage icon-stage">
          <aui-icon-button
            id="target-icon-btn"
            :preset="iconPreset"
            :copy-value="copySnippet"
            download-filename="anchor-ui.json"
            @aui-copy="handleCopySuccess"
            @aui-download="handleDownload"
          ></aui-icon-button>

          <!-- 自訂 Slot 圖示按鈕 -->
          <aui-icon-button tooltip="自訂愛心收藏" id="custom-slot-icon-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              ></path>
            </svg>
          </aui-icon-button>
        </div>

        <div class="result-box">
          <p id="icon-feedback-text">
            事件即時反饋：<span class="feedback-highlight">{{
              copyFeedbackText || '尚未觸發事件'
            }}</span>
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  font-family: var(--font-ui, system-ui, sans-serif);
  color: var(--color-text-primary, #0f172a);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
}

.header-titles h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--color-brand-600, #0f4c81);
}

:global([data-theme='dark']) .header-titles h1 {
  color: var(--color-brand-500, #38bdf8);
}

.subtitle {
  font-size: 0.9375rem;
  color: var(--color-text-secondary, #475569);
}

.subtitle code {
  font-family: var(--font-mono, monospace);
  background: var(--color-surface, #f1f5f9);
  padding: 2px 6px;
  border-radius: 4px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 24px;
}

.card {
  background: var(--color-surface-plus, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-lg, 12px);
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
}

.badge {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  padding: 2px 8px;
  background: var(--color-brand-dim, rgba(15, 76, 129, 0.1));
  color: var(--color-brand-text, #0f4c81);
  border-radius: 9999px;
  font-weight: 600;
}

.control-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
  padding: 12px 16px;
  background: var(--color-surface, #f1f5f9);
  border-radius: var(--radius-md, 8px);
  margin-bottom: 20px;
  font-size: 0.875rem;
}

.control-panel label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.checkbox-label {
  cursor: pointer;
  user-select: none;
}

.control-panel select,
.text-input {
  padding: 6px 10px;
  border: 1px solid var(--color-border, #cbd5e1);
  border-radius: 6px;
  background: var(--color-base, #ffffff);
  color: inherit;
  font-size: 0.875rem;
}

.preview-stage {
  padding: 24px;
  background: var(--color-bg, #f8fafc);
  border: 1px dashed var(--color-border, #cbd5e1);
  border-radius: var(--radius-md, 8px);
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.center-stage {
  justify-content: center;
  min-height: 80px;
}

.tag-list {
  flex-wrap: wrap;
}

.icon-stage {
  gap: 20px;
}

.result-box {
  padding: 12px 16px;
  background: var(--color-surface, #f1f5f9);
  border-radius: var(--radius-sm, 6px);
  font-size: 0.875rem;
}

.sub-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border, #e2e8f0);
}

.sub-section h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.demo-form {
  display: flex;
  gap: 8px;
  align-items: center;
}

.demo-form .text-input {
  flex: 1;
}

.sub-result {
  margin-top: 8px;
  font-size: 0.8125rem;
  color: var(--color-success-text, #047857);
}

.feedback-highlight {
  font-weight: 600;
  color: var(--color-brand-600, #0f4c81);
}

:global([data-theme='dark']) .feedback-highlight {
  color: var(--color-brand-500, #38bdf8);
}
</style>
