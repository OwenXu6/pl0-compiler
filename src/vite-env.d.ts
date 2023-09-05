/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module 'vue3-print-nb';
declare module 'vue-schart';
declare module 'vue-cropperjs';
declare module 'echarts';