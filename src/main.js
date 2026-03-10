import { createSSRApp } from "vue";
import { Buffer } from 'buffer';
import process from 'process';

// 1. Initial Polyfills
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.process = process;
  if (typeof window.global === 'undefined') {
    window.global = window;
  }
}

// 2. Static Imports
import '/src/pages-json-js';
import App from "./App";
import * as filters from "./utils/filters.js";
import uviewPlus from "uview-plus";
import store from "./store";
import i18n from './lang';
import config from '@/config/config';

// 3. CreateApp Export
export function createApp() {
  const app = createSSRApp(App);

  app.use(i18n);
  app.use(store);
  app.use(uviewPlus);

  // Filters setup
  app.config.globalProperties.$filters = filters;
  Object.keys(filters).forEach((key) => {
    app.config.globalProperties[key] = filters[key];
  });

  // Global properties
  app.config.globalProperties.$mainColor = config.mainColor;
  app.config.globalProperties.$lightColor = config.lightColor;
  app.config.globalProperties.$aiderLightColor = config.aiderLightColor;

  return {
    app,
  };
}
