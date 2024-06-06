/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3f51b5',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
      },
      rotate: {
        135: '135deg',
      },
    },
    screens: {
      sm: '600px', // 37.5rem
      md: '960px', // 60rem
      lg: '1280px', // 80rem
      xl: '1920px', // 120rem
    },
  },
  safelist: [
    // font size
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl',
    //
    'bg-red-100',
    'bg-red-300',
    'bg-red-500',
    'bg-gray-100',
    'bg-green-100',
    'bg-green-300',
    'bg-green-500',
    'bg-primary',
    'text-white',
  ],
  important: true,
  plugins: [],
};
