import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import unocss from 'unocss/vite'

export default defineConfig({
  plugins: [unocss(), solidPlugin()],
  build: {
    target: 'esnext',
  },
})
