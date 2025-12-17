import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      maxWidth: {
        // Slightly narrow the site container to increase side margins a bit
        '7xl': '90rem', // 1440px
      },
      colors: {
        'nvidia-green': '#76b900',
        'nvidia-dark': '#333333',
        'nvidia-black': '#000000',
        'nvidia-white': '#ffffff',
        'nvidia-gray': {
          50: '#f9f9f9',
          100: '#f3f3f3',
          200: '#e8e8e8',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#8a8a8a',
          600: '#636363',
          700: '#202020',
          800: '#1a1a1a',
          900: '#0a0a0a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'nvidia': ['NVIDIA Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    typography,
  ],
} 
