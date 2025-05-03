import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { fileURLToPath } from 'node:url'
import unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      'aggregate-error': fileURLToPath(
        new URL('./stub/AggregateError.ts', import.meta.url),
      ),
    },
  },
  plugins: [unocss(), solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
})
