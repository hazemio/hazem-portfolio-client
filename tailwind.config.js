/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: { 50:'#f0f4ff',100:'#e0eaff',200:'#c7d7fe',300:'#a5b8fc',400:'#818cf8',500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',950:'#1e1b4b' },
        accent: { cyan:'#06b6d4',violet:'#8b5cf6',rose:'#f43f5e',amber:'#f59e0b',emerald:'#10b981' },
      },
      animation: {
        'float':'float 6s ease-in-out infinite',
        'glow':'glow 2s ease-in-out infinite alternate',
        'shimmer':'shimmer 2s linear infinite',
        'spin-slow':'spin 8s linear infinite',
      },
      keyframes: {
        float:{'0%,100%':{transform:'translateY(0)'},'50%':{transform:'translateY(-20px)'}},
        glow:{from:{boxShadow:'0 0 20px rgba(99,102,241,0.3)'},to:{boxShadow:'0 0 40px rgba(99,102,241,0.7)'}},
        shimmer:{'0%':{backgroundPosition:'-200% 0'},'100%':{backgroundPosition:'200% 0'}},
      },
      boxShadow: {
        'glass':'0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.1)',
        'brand':'0 0 0 1px rgba(99,102,241,0.15), 0 8px 32px rgba(99,102,241,0.25)',
        'brand-lg':'0 0 0 1px rgba(99,102,241,0.2), 0 20px 60px rgba(99,102,241,0.35)',
      },
    },
  },
  plugins: [],
};
