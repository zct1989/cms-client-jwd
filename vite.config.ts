import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import styleImport from 'vite-plugin-style-import'

const production = process.env.NODE_ENV === 'production'
// https://vitejs.dev/config/

export default defineConfig({
  base: production ? '/wp-content/themes/bank-theme/' : '/',
  define: {
    __DEV__: JSON.stringify(!production)
  },
  plugins: [
    vue(),
    copy({
      targets: [{
        src: ['./theme/*'],
        dest: ['./dist']
      }],
      hook: 'writeBundle' // notice here
    }),
    styleImport({
      libs: [
        {
          libraryName: 'element-plus',
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            return `element-plus/lib/theme-chalk/${name}.css`;
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`;
          },
        }
      ]
    })],
  build: {
    manifest: true
  }
})
