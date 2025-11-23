/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        borderShine: {
          '0%': { 'border-image-source': 'linear-gradient(135deg, transparent, var(--color-accent-primary), transparent)' },
          '50%': { 'border-image-source': 'linear-gradient(135deg, transparent, var(--color-accent-primary), var(--color-accent-primary), transparent)' },
          '100%': { 'border-image-source': 'linear-gradient(135deg, transparent, var(--color-accent-primary), transparent)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'border-shine': 'borderShine 2s infinite linear',
      }
    }
  },
  plugins: [],
}
