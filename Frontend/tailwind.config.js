/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#C7C7FF', // Lighter blue tone
          DEFAULT: '#0004FF', // Primary blue
          dark: '#00012B', // Darker blue
        },
        secondary: {
          light: '#FFE0B2', // Light Peach
          DEFAULT: '#FF7043', // Coral Red
          dark: '#D32F2F', // Dark Red
        },
        accent: {
          light: '#B2DFDB', // Light teal
          DEFAULT: '#009688', // Teal
          dark: '#00796B', // Darker Teal
        },
      
        gradientStart: '#4CAF50', // Green
        gradientEnd: '#81C784', // Light Green
        gradientStartBlue: '#2196F3', // Blue
        gradientEndBlue: '#64B5F6', // Light Blue
        gradientStartPink: '#E91E63', // Pink
        gradientEndPink: '#F06292', // Light Pink
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        gradient: '0 0 10px rgba(76, 175, 80, 0.5)', // Green gradient shadow
        'custom-deep': '0 8px 15px rgba(0, 0, 0, 0.2)', // Deeper shadow
        'neon-pink': '0 0 10px rgba(233, 30, 99, 0.7)', // Neon pink
        'neon-blue': '0 0 10px rgba(33, 150, 243, 0.7)', // Neon blue
        'white-light': '0 4px 6px rgba(255, 255, 255, 0.5)', // Light white shadow
        'white-soft': '0 8px 12px rgba(255, 255, 255, 0.3)', // Softer white shadow
        'white-glow': '0 0 15px rgba(255, 255, 255, 0.8)', // Glowing white shadow
      },
      
      borderImage: {
        gradientGreen: 'linear-gradient(to right, #4CAF50, #81C784)',
        gradientBlue: 'linear-gradient(to right, #2196F3, #64B5F6)',
        gradientPink: 'linear-gradient(to right, #E91E63, #F06292)',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '5': '5px',
        '6': '6px',
        '7': '7px',
        '8': '8px',
        '9': '9px',
      },
    },
  },
  plugins: [],
};
