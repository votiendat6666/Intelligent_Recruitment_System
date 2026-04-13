/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
  extend: {
    keyframes: {
      gradientFlow: {
        '0%': { backgroundPosition: '0% center' },
        '100%': { backgroundPosition: '200% center' },
      }
    },
    animation: {
      'gradientFlow': 'gradientFlow 4s linear infinite',
    }
  }
},
  plugins: [],
}