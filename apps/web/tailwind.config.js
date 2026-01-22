import animate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        card: 'var(--card)',
        border: 'var(--border)',
        primary: 'var(--primary)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        link: 'var(--link)',
        easy: 'var(--easy)',
        medium: 'var(--medium)',
        hard: 'var(--hard)',
        success: 'var(--success)',
        hover: 'var(--hover)',
      },
    },
  },
  plugins: [animate],
}

