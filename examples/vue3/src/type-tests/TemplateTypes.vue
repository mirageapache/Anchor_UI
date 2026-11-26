<script setup lang="ts">
// TASK-502：Vue 範本型別（@anchor-ui/core/vue）的正反例，由 vue-tsc 檢查（pnpm typecheck:examples）。
// 正確寫法必須通過；標記 @vue-expect-error 的錯誤寫法必須報錯——型別宣告失效時，
// 這些標記會變成「沒有對應錯誤的 @vue-expect-error」而讓型別檢查失敗。
// 本檔不會被應用程式引用，只供型別檢查。
import type {
  ButtonVariant,
  FileDropDetail,
  ModalHideDetail,
  SegmentedOption,
} from '@anchor-ui/core';

const variant: ButtonVariant = 'primary';
const options: SegmentedOption[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

function onDrop(event: CustomEvent<FileDropDetail>): number {
  return event.detail.files.length;
}
function onHide(event: CustomEvent<ModalHideDetail>): string {
  return event.detail.reason;
}
function onAnyEvent(event: Event): string {
  return event.type;
}
function onWrongDetail(event: CustomEvent<{ value: number }>): number {
  return event.detail.value;
}
</script>

<template>
  <!-- 屬性：使用元件的型別（ButtonVariant、SegmentedOption[]、CardHeadingLevel） -->
  <aui-button :variant="variant" size="sm" full-width>OK</aui-button>
  <!-- @vue-expect-error variant 不是 ButtonVariant -->
  <aui-button variant="bogus">x</aui-button>
  <!-- @vue-expect-error size 不是 ButtonSize -->
  <aui-button size="xl">x</aui-button>

  <aui-segmented :options="options" value="a"></aui-segmented>
  <!-- @vue-expect-error options 必須是 SegmentedOption[] -->
  <aui-segmented :options="['a', 'b']"></aui-segmented>

  <aui-card heading="Card" :heading-level="2"></aui-card>
  <!-- @vue-expect-error heading-level 只能是 1 ~ 6 -->
  <aui-card heading="Card" :heading-level="9"></aui-card>

  <!-- 布林屬性以 kebab-case 綁定 null 會移除 attribute（README 的建議寫法） -->
  <aui-button :full-width="false || null">x</aui-button>

  <!-- 靜態 attribute：數值、布林與 JSON 以字串撰寫 -->
  <aui-card heading="Card" heading-level="2" lines="3"></aui-card>
  <aui-input rows="4" multiline disabled=""></aui-input>
  <aui-tooltip content="tip" delay="300"></aui-tooltip>
  <aui-modal close-on-escape="false" close-on-backdrop="false"></aui-modal>
  <aui-segmented options='[{"value":"a","label":"A"}]'></aui-segmented>
  <!-- @vue-expect-error heading-level 的靜態值只能是 "1" ~ "6" -->
  <aui-card heading="Card" heading-level="9"></aui-card>
  <!-- @vue-expect-error lines 必須是數字字串 -->
  <aui-card heading="Card" lines="three"></aui-card>
  <!-- @vue-expect-error 一般布林 attribute 的 "false" 仍代表 true（只有 close-on-escape 等可寫 "false"） -->
  <aui-button full-width="false">x</aui-button>

  <!-- 事件：處理器的參數帶入 detail 型別；行內函式的參數自動推斷 -->
  <aui-dropzone
    @aui-file-drop="onDrop"
    @aui-file-reject="(event) => event.detail.rejections.map((item) => item.reason)"
  ></aui-dropzone>
  <!-- @vue-expect-error 處理器要求的 detail 型別與 aui-file-drop 不符 -->
  <aui-dropzone @aui-file-drop="onWrongDetail"></aui-dropzone>
  <aui-modal @aui-hide="onHide" @aui-after-hide="onAnyEvent"></aui-modal>
  <!-- @vue-expect-error aui-show 沒有 detail.reason -->
  <aui-modal @aui-show="(event) => event.detail.reason"></aui-modal>
</template>
