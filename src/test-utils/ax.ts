import { executeServerCommand } from '@web/test-runner-commands';

export interface AxNode {
  role: string;
  name: string;
  description: string;
}

/**
 * 取得元素經 Chromium 實際計算後的無障礙節點（role / name / description）。
 * 與直接讀取 aria-* 屬性字串不同，這能反映 IDREF 是否真的被瀏覽器解析。
 * 對應的伺服器端指令定義於 web-test-runner.config.mjs 的 axNodePlugin。
 */
export async function getAxNode(element: Element): Promise<AxNode> {
  const globalRef = window as unknown as { __auiAxTarget?: Element };
  globalRef.__auiAxTarget = element;
  // 等待一個 frame，讓無障礙樹同步最新的 DOM 變更
  await new Promise((resolve) => requestAnimationFrame(resolve));
  try {
    return (await executeServerCommand('ax-node', {
      expression: 'window.__auiAxTarget',
    })) as AxNode;
  } finally {
    delete globalRef.__auiAxTarget;
  }
}
