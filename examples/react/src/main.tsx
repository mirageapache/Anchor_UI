import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// 全量入口：註冊所有元件（按需載入見 tests/entries.spec.tsx）
import '@anchor-ui/core';
import '@anchor-ui/core/styles.css';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
