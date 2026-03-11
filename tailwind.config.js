/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: {
          from: 'var(--color-page-from)',
          to: 'var(--color-page-to)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
        'text-main': 'var(--color-text-main)',
        'text-muted': 'var(--color-text-muted)',
        'border-main': 'var(--color-border-main)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        }
      }
    },
  },
  plugins: [],
}
