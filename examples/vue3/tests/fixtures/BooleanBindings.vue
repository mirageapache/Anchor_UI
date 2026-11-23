<script setup lang="ts">
import { ref } from 'vue';
import '@anchor-ui/core/button';
import '@anchor-ui/core/segmented';

defineProps<{ flag: boolean }>();

const options = ref([
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
]);
</script>

<template>
  <!-- 多字的布林屬性：以 kebab-case 綁定時，Vue 找不到同名 property，改寫成 attribute -->
  <aui-button id="kebab" :full-width="flag">kebab</aui-button>
  <!-- .prop 不會轉成 camelCase，設定的是名為 full-width 的 property，元件讀不到 -->
  <aui-button id="kebab-prop" :full-width.prop="flag">kebab-prop</aui-button>
  <!-- 建議寫法：camelCase、.camel 修飾符，或以 null 代替 false -->
  <aui-button id="camel" :fullWidth="flag">camel</aui-button>
  <aui-button id="camel-modifier" :full-width.camel="flag">camel-modifier</aui-button>
  <aui-button id="nullable" :full-width="flag || null">nullable</aui-button>
  <!-- 單字的屬性（disabled）與陣列屬性（options）有同名 property，直接設定 -->
  <aui-button id="single" :disabled="flag">single</aui-button>
  <aui-segmented id="options" :options="options"></aui-segmented>
</template>
