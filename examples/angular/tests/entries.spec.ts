import { describe, it, expect, beforeEach } from 'vitest';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
// 按需載入：只引入用到的元件入口（不經過全量入口 @anchor-ui/core）
import '@anchor-ui/core/field';
import { AuiInput } from '@anchor-ui/core/input';
import type { AuiField } from '@anchor-ui/core/field';

@Component({
  selector: 'app-on-demand',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <aui-field id="on-demand-field" label="On demand" clearable>
      <aui-input id="on-demand-input" [(ngModel)]="text" ngDefaultControl></aui-input>
    </aui-field>
  `,
})
class OnDemandComponent {
  text = 'on demand';
}

/**
 * 按需載入（package.json exports 的個別元件入口）。
 * 此檔不引入全量入口；Vitest 每個測試檔使用獨立環境，因此元件註冊表只反映本檔的匯入。
 */
describe('Angular 19 + per-component entries (@anchor-ui/core/<name>)', () => {
  let fixture: ComponentFixture<OnDemandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OnDemandComponent] }).compileComponents();
    fixture = TestBed.createComponent(OnDemandComponent);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('registers only the imported components and what they render themselves', () => {
    expect(customElements.get('aui-input')).toBe(AuiInput);
    expect(customElements.get('aui-field')).toBeDefined();
    // field 會渲染內建的複製／清除鈕，因此連同 icon-button 與其相依的 tooltip 一起註冊
    expect(customElements.get('aui-icon-button')).toBeDefined();
    expect(customElements.get('aui-tooltip')).toBeDefined();

    for (const tag of ['aui-button', 'aui-tag', 'aui-output', 'aui-segmented']) {
      expect(customElements.get(tag), `${tag} should not be registered`).toBeUndefined();
    }
  });

  it('works with [(ngModel)] + ngDefaultControl when loaded on demand', async () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector<AuiInput>('aui-input#on-demand-input')!;
    await input.updateComplete;
    expect(input.value).toBe('on demand');

    const control = input.shadowRoot!.querySelector<HTMLInputElement>('.control')!;
    control.value = 'typed';
    control.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(fixture.componentInstance.text).toBe('typed');

    const field = compiled.querySelector<AuiField>('aui-field#on-demand-field')!;
    await field.updateComplete;
    field.shadowRoot!.querySelector<HTMLElement>('[part~="clear-button"]')!.click();
    expect(fixture.componentInstance.text).toBe('');
  });
});
