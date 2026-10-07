import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

// 引入 Anchor UI 核心樣式與 Web Component 註冊
import '@anchor-ui/core/tokens.css';
import '@anchor-ui/core/styles.css';
import '@anchor-ui/core';

bootstrapApplication(AppComponent).catch((err) => console.error(err));
