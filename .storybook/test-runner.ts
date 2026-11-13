import type { TestRunnerConfig } from '@storybook/test-runner';

/**
 * Storybook Test Runner 設定（TASK-213）：每個 story 都會被渲染並執行其 play function。
 *
 * 以減少動畫模式執行：Modal / Alert / Toast 的轉場時長皆取自 computed style，
 * 減少動畫下為 0，互動測試不必等待動畫且結果穩定。
 */
const config: TestRunnerConfig = {
  async preVisit(page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  },
};

export default config;
