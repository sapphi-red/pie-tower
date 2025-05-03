import { defineConfig, presetWind3, presetAttributify } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      bg: {
        primary: '#292524',
        secondary: '#92400e',
        tertiary: '#1c1917',
      },
      text: {
        primary: '#fffbeb',
      },
    },
  },
  presets: [
    presetWind3(),
    presetAttributify({ prefix: 'w:', prefixedOnly: true }),
  ],
})
