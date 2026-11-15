/**
 * 可暫停的計時器（Alert 自動關閉；Toast 自動消失也會使用）。
 *
 * 自動消失的內容須讓使用者能暫停或延長（WCAG 2.2.1 Timing Adjustable），
 * 因此提供 pause() / resume()，暫停時保留剩餘時間，恢復後從剩餘時間繼續。
 */
/** setTimeout 可接受的最大延遲（2³¹−1 毫秒，約 24.8 天）；超過會溢位而立即到期 */
const MAX_DELAY_MS = 2 ** 31 - 1;

export class PausableTimer {
  private timeoutId: number | null = null;
  private deadline = 0;
  private remainingMs = 0;

  constructor(private readonly onExpire: () => void) {}

  /** 是否正在倒數（暫停或已停止時為 false） */
  get running(): boolean {
    return this.timeoutId !== null;
  }

  /** 剩餘毫秒數（已停止或到期為 0） */
  get remaining(): number {
    return this.running ? Math.max(0, this.deadline - performance.now()) : this.remainingMs;
  }

  /**
   * 重新開始倒數；ms 不大於 0、不是數字或為 Infinity 時只停止（不會到期）。
   * 超過 setTimeout 上限（約 24.8 天）的時間以上限計算，避免溢位成立即到期
   */
  start(ms: number): void {
    this.stop();
    if (!(ms > 0) || ms === Infinity) return;
    this.remainingMs = Math.min(ms, MAX_DELAY_MS);
    this.resume();
  }

  /** 暫停並保留剩餘時間 */
  pause(): void {
    if (this.timeoutId === null) return;
    window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.remainingMs = Math.max(0, this.deadline - performance.now());
  }

  /** 從剩餘時間繼續；已停止、已到期或正在倒數時不動作 */
  resume(): void {
    if (this.timeoutId !== null || this.remainingMs <= 0) return;
    this.deadline = performance.now() + this.remainingMs;
    this.timeoutId = window.setTimeout(() => {
      this.timeoutId = null;
      this.remainingMs = 0;
      this.onExpire();
    }, this.remainingMs);
  }

  /** 停止且不再到期（之後的 resume() 不會恢復） */
  stop(): void {
    if (this.timeoutId !== null) window.clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.remainingMs = 0;
  }
}
