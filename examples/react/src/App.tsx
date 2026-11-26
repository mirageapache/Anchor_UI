import { useState } from 'react';
import type {
  ButtonVariant,
  FooterColumn,
  MenuSelectDetail,
  SegmentedOption,
  TagRemoveDetail,
} from '@anchor-ui/core';

const MODES: SegmentedOption[] = [
  { value: 'encode', label: '編碼' },
  { value: 'decode', label: '解碼' },
];

const COLUMNS: FooterColumn[] = [
  {
    heading: '產品',
    links: [
      { label: '元件', href: '#components' },
      { label: '更新紀錄', href: '#changelog' },
    ],
  },
];

/**
 * React 19 整合範例：
 * - 屬性（含陣列 options / columns）直接以 JSX 屬性設定，React 19 會寫入元素的 property
 * - aui- 自訂事件以 `onaui-<事件名稱>` 監聽，事件處理器的參數帶入 detail 型別
 * - 表單元件以 value + onInput 受控（onInput 的 currentTarget 為元件本身）
 */
export function App() {
  const [text, setText] = useState('Hello, Anchor UI!');
  const [mode, setMode] = useState('encode');
  const [variant, setVariant] = useState<ButtonVariant>('primary');
  const [tags, setTags] = useState(['react', 'web-components', 'lit']);
  const [lastAction, setLastAction] = useState('');

  return (
    <main style={{ display: 'grid', gap: 16, maxWidth: 640, margin: '32px auto' }}>
      <h1>Anchor UI — React 19</h1>
      <code>npm install @anchor-ui/core</code>

      <aui-field label="Input" description="value + onInput 受控">
        <aui-input
          id="react-input"
          name="text"
          value={text}
          onInput={(event) => setText(event.currentTarget.value)}
        ></aui-input>
      </aui-field>
      <p id="react-text">{text}</p>

      <aui-segmented
        id="react-mode"
        name="mode"
        label="Mode"
        options={MODES}
        value={mode}
        onInput={(event) => setMode(event.currentTarget.value)}
      ></aui-segmented>
      <p id="react-mode-value">{mode}</p>

      <aui-button
        id="react-button"
        variant={variant}
        onClick={() => setVariant(variant === 'primary' ? 'accent' : 'primary')}
      >
        切換按鈕樣式（{variant}）
      </aui-button>

      <div style={{ display: 'flex', gap: 8 }}>
        {tags.map((tag) => (
          <aui-tag
            key={tag}
            removable
            onaui-remove={(event: CustomEvent<TagRemoveDetail>) =>
              setTags((current) => current.filter((item) => item !== event.detail.tag.textContent))
            }
          >
            {tag}
          </aui-tag>
        ))}
      </div>

      <aui-menu
        label="更多操作"
        onaui-select={(event: CustomEvent<MenuSelectDetail>) => setLastAction(event.detail.value)}
      >
        <aui-button slot="trigger" variant="ghost" size="sm">
          更多操作
        </aui-button>
        <button value="duplicate">複製</button>
        <button value="delete">刪除</button>
      </aui-menu>
      <p id="react-last-action">{lastAction || '—'}</p>

      <aui-footer copyrightHolder="Anchor UI" columns={COLUMNS}></aui-footer>
    </main>
  );
}
