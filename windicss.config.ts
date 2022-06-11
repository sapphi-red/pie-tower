import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'

export default defineConfig({
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'bg-primary': colors.stone[800],
        'bg-secondary': colors.amber[800],
        'bg-tertiary': colors.stone[900],
        'text-primary': colors.amber[50]
      }
    }
  },
  attributify: {
    prefix: 'w:'
  },
  plugins: []
})
