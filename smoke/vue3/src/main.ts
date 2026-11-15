import { createApp } from 'vue';
import App from './App.vue';

// 只載入用到的元件入口（按需載入）；未引用的元件不得出現在打包結果中
import '@anchor-ui/core/styles.css';
import '@anchor-ui/core/button';
import '@anchor-ui/core/input';
import '@anchor-ui/core/field';
import '@anchor-ui/core/card';
import '@anchor-ui/core/toast';

createApp(App).mount('#app');
