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
          DEFAULT: '#E8862A',
          hover: '#D4771F',
          light: '#F5C196',
        },
        heading: {
          DEFAULT: '#0D4A52',
          light: '#1A5F6A',
        },
        cream: {
          DEFAULT: '#F5EDE0',
          dark: '#EBE3D6',
          light: '#FAF7F2',
        },
        teal: {
          DEFAULT: '#1A5F6A',
          dark: '#0D4A52',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        dancing: ['"Dancing Script"', 'cursive'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
