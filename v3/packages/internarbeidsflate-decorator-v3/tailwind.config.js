/** @type {import('tailwindcss').Config} */
import dsTailwind from "@navikt/ds-tailwind"
export default {
  prefix: 'dr-',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#23262A',
        'link': 'orange-400'
      },
      fontFamily: {
        'arial': 'Arial, sans-serif'
      },
      transitionProperty: {
        'height': 'height'
      }
    },
  },
  presets: [dsTailwind],
  plugins: [],
}