export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D6A4F',
        secondary: '#52B788',
        accent: '#F4A261',
        background: '#FAFAF8',
        text: '#1A1A2E',
        muted: '#6B7280',
      },
      boxShadow: {
        soft: '0 24px 64px rgba(45, 106, 79, 0.08)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(82, 183, 136, 0.18), rgba(250, 250, 248, 1))',
      },
    },
  },
  plugins: [],
}
