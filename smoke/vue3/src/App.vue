<script setup lang="ts">
import { ref } from 'vue';
// 子路徑入口的型別宣告必須能被解析（驗證 package.json 的 exports → types）
import type { AuiButton, ButtonVariant } from '@anchor-ui/core/button';
import type { CardHeadingLevel } from '@anchor-ui/core/card';
import type { AuiInput } from '@anchor-ui/core/input';
import { ToastService } from '@anchor-ui/core/toast';

const variant: ButtonVariant = 'primary';
const headingLevel: CardHeadingLevel = 2;
const text = ref('hello');
const input = ref<AuiInput | null>(null);
const button = ref<AuiButton | null>(null);

function notify(): void {
  // 透過元素的型別存取屬性：型別宣告需包含元件類別的公開 API
  const value: string = input.value?.value ?? text.value;
  const disabled: boolean = button.value?.disabled ?? false;
  ToastService.success(`value: ${value}, disabled: ${disabled}`);
}
</script>

<template>
  <main>
    <aui-field label="Name" clearable>
      <aui-input ref="input" v-model="text"></aui-input>
    </aui-field>
    <aui-button ref="button" :variant="variant" @click="notify">Notify</aui-button>
    <aui-card
      heading="Card"
      description="Installed from the tarball"
      href="#card"
      :heading-level="headingLevel"
    ></aui-card>
  </main>
</template>
