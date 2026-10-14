<script setup lang="ts">
import { ref } from 'vue';
// 按需載入：只引入用到的元件入口（不經過全量入口 @anchor-ui/core）
import '@anchor-ui/core/field';
import '@anchor-ui/core/input';

const text = ref('on demand');
</script>

<template>
  <aui-field id="on-demand-field" label="On demand" clearable>
    <aui-input id="on-demand-input" v-model="text"></aui-input>
  </aui-field>
  <p id="on-demand-text">{{ text }}</p>
</template>
