import { expect } from '@open-wc/testing';
import { PausableTimer } from './pausable-timer.js';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('PausableTimer', () => {
  it('expires after the given time', async () => {
    let expired = 0;
    const timer = new PausableTimer(() => expired++);
    timer.start(60);
    expect(timer.running).to.be.true;
    await wait(20);
    expect(expired).to.equal(0);
    await wait(80);
    expect(expired).to.equal(1);
    expect(timer.running).to.be.false;
    expect(timer.remaining).to.equal(0);
  });

  it('keeps the remaining time while paused and continues on resume', async () => {
    let expired = 0;
    const timer = new PausableTimer(() => expired++);
    timer.start(100);
    await wait(40);
    timer.pause();
    const remaining = timer.remaining;
    expect(remaining).to.be.within(30, 75);
    expect(timer.running).to.be.false;

    await wait(150);
    expect(expired, 'does not expire while paused').to.equal(0);
    expect(timer.remaining).to.equal(remaining);

    timer.resume();
    await wait(remaining + 40);
    expect(expired).to.equal(1);
  });

  it('ignores pause / resume when not applicable', async () => {
    let expired = 0;
    const timer = new PausableTimer(() => expired++);
    timer.pause();
    timer.resume();
    expect(timer.running).to.be.false;

    timer.start(40);
    timer.resume();
    timer.resume();
    await wait(80);
    expect(expired, 'resuming a running timer does not schedule twice').to.equal(1);
  });

  it('never expires after stop(), even when resumed', async () => {
    let expired = 0;
    const timer = new PausableTimer(() => expired++);
    timer.start(40);
    timer.stop();
    timer.resume();
    await wait(80);
    expect(expired).to.equal(0);
    expect(timer.remaining).to.equal(0);
  });

  it('restarts from the full time when started again', async () => {
    let expired = 0;
    const timer = new PausableTimer(() => expired++);
    timer.start(60);
    await wait(40);
    timer.start(60);
    await wait(40);
    expect(expired, 'the first countdown was replaced').to.equal(0);
    await wait(50);
    expect(expired).to.equal(1);
  });

  it('treats zero, negative and NaN as "do not start"', async () => {
    let expired = 0;
    const timer = new PausableTimer(() => expired++);
    for (const ms of [0, -100, Number.NaN]) {
      timer.start(ms);
      expect(timer.running).to.be.false;
    }
    await wait(20);
    expect(expired).to.equal(0);
  });
});
