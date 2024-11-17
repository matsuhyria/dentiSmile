import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// vite.config.js
import eslintPlugin from 'vite-plugin-eslint';
import Components from 'unplugin-vue-components/vite'
import { BootstrapVueNextResolver } from 'bootstrap-vue-next'
import Icons from 'unplugin-icons/vite'
import IconsResolve from 'unplugin-icons/resolver'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    eslintPlugin(),
    Components({
      resolvers: [BootstrapVueNextResolver(), IconsResolve()],
      dts: true,
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true,
    }),
    
  ], server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Port to run the server
  },
})
