<script setup lang="ts">
// TASK-502：以 tarball 安裝的 @anchor-ui/core/vue 必須讓 vue-tsc 檢查範本（skipLibCheck: false 也涵蓋宣告檔本身）。
// 標記 @vue-expect-error 的錯誤寫法必須報錯；型別宣告失效時，標記沒有對應的錯誤而讓型別檢查失敗。
// 本檔不會被應用程式引用，只供型別檢查。
import type { FileDropDetail } from '@anchor-ui/core/dropzone';

function onDrop(event: CustomEvent<FileDropDetail>): number {
  return event.detail.files.length;
}
function onWrongDetail(event: CustomEvent<{ value: number }>): number {
  return event.detail.value;
}
</script>

<template>
  <aui-button variant="primary" size="sm">OK</aui-button>
  <!-- @vue-expect-error variant 不是 ButtonVariant -->
  <aui-button variant="bogus">x</aui-button>
  <aui-dropzone @aui-file-drop="onDrop"></aui-dropzone>
  <!-- @vue-expect-error detail 型別不符 -->
  <aui-dropzone @aui-file-drop="onWrongDetail"></aui-dropzone>
</template>
