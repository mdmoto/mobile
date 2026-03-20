import { createSSRApp } from "vue";
window.onerror = function(message, source, lineno, colno, error) {
  console.log("TOP_LEVEL_ERROR_DETECTED:", { message, source, lineno, colno, error });
  return false;
};
window.onunhandledrejection = function(event) {
  console.log("UNHANDLED_REJECTION:", event.reason);
};

// Diagnostic Heartbeat
if (typeof window !== "undefined") {
  
if (typeof window !== "undefined") {
  console.log("MaoMall_Startup_Heartbeat_2026_03_20_V5_DEFINITIVE");
  // Proactive check of methods
  const testUni = typeof uni !== "undefined" ? uni : window.uni;
  if (testUni) {
    console.log("uni.navigateTo type:", typeof testUni.navigateTo);
    console.log("uni.request type:", typeof testUni.request);
    console.log("uni.redirectTo type:", typeof testUni.redirectTo);
  } else {
    console.log("uni is COMPLETELY MISSING");
  }
}

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("uni exists:", typeof uni !== "undefined");
  if (typeof uni !== "undefined") {
    console.log("uni methods:", Object.keys(uni).filter(k => typeof uni[k] === "function").slice(0, 10));
  }
}

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
  app.config.globalProperties.$config = config;
  app.config.globalProperties.$mainColor = config.mainColor;
  app.config.globalProperties.$lightColor = config.lightColor;
  app.config.globalProperties.$aiderLightColor = config.aiderLightColor;

  // Global Error Handler (Dev-only)
  app.config.errorHandler = (err, instance, info) => {
    console.error('[Global Error]:', err);
    if (process.env.NODE_ENV !== 'production') {
      try {
        uni.showModal({
          title: 'Debug: Runtime Error',
          content: `${err && err.message ? err.message : String(err)}\nAt: ${info}`,
          showCancel: false
        });
      } catch (_) {
        // ignore
      }
    }
  };

  return {
    app,
  };
}
