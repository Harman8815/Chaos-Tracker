/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        'sidebar-bg': 'var(--color-sidebar-bg)',
        'card-bg': 'var(--color-card-bg)',
        'input-bg': 'var(--color-input-bg)',
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-disabled': 'var(--color-text-disabled)',
        'accent-primary': 'var(--color-accent-primary)',
        'accent-primary-dark': 'var(--color-accent-primary-dark)',
      },
      fontFamily: {
        sans: ['var(--font-family-sans)', 'sans-serif'],
      },
    },
  },
}
