/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['ui-serif', 'Georgia'],

      }
    },
  },
  daisyui: {
    themes: [
      {
        defaultTheme: {
          'primary': '#03989e',
          'secondary': '#373a42',
          'accent': '#1dcdbc',
          'neutral': '#025464',
          'info': '#F4F7FF',
          'success': '#3366FF',
          'error': '#f87272',
          'snow': '#ffffff'
        }
      }
    ]
  },
  plugins: [require("daisyui")],
}

