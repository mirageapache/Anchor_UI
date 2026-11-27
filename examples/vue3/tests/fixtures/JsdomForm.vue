<script setup lang="ts">
import { ref } from 'vue';
import '@anchor-ui/core';
import type { SegmentedOption } from '@anchor-ui/core';

const query = ref('init');
const mode = ref('a');
const options: SegmentedOption[] = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

defineExpose({ query, mode });
</script>

<template>
  <form>
    <aui-field label="查詢">
      <aui-input name="q" v-model="query" required></aui-input>
    </aui-field>
    <!-- Vue 把 value 設成 property（目前值）；reset 還原的預設值是 defaultValue（多字屬性以 camelCase 寫） -->
    <aui-input name="note" defaultValue="預設"></aui-input>
    <aui-segmented name="mode" :options="options" v-model="mode"></aui-segmented>
    <aui-button type="submit">送出</aui-button>
    <aui-button type="reset">重設</aui-button>
  </form>
</template>
