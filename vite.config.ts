import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import WindiCSS from 'vite-plugin-windicss'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      'aggregate-error': fileURLToPath(
        new URL('./stub/AggregateError.ts', import.meta.url)
      )
    }
  },
  plugins: [
    solidPlugin(),
    WindiCSS({
      scan: {
        fileExtensions: ['html', 'js', 'ts', 'jsx', 'tsx']
      }
    })
  ],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false
  }
})
