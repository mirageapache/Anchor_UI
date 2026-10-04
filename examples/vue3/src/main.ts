import { createApp } from 'vue';
import App from './App.vue';

// 引入 Anchor UI 核心樣式與 Web Component 註冊
import '@anchor-ui/core/tokens.css';
import '@anchor-ui/core/styles.css';
import '@anchor-ui/core';

createApp(App).mount('#app');
