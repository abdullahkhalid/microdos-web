/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Spacing Scale - 4px base unit system
      spacing: {
        '0': '0px',
        '1': '4px',    // 0.25rem
        '2': '8px',    // 0.5rem
        '3': '12px',   // 0.75rem
        '4': '16px',   // 1rem
        '5': '20px',   // 1.25rem
        '6': '24px',   // 1.5rem
        '8': '32px',   // 2rem
        '10': '40px',  // 2.5rem
        '12': '48px',  // 3rem
        '16': '64px',  // 4rem
        '20': '80px',  // 5rem
        '24': '96px',  // 6rem
        '32': '128px', // 8rem
        '40': '160px', // 10rem
        '48': '192px', // 12rem
        '56': '224px', // 14rem
        '64': '256px', // 16rem
      },
      
      // Typography Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],     // 14px
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],     // 18px
        'xl': ['1.25rem', { lineHeight: '1.375', letterSpacing: '-0.025em' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '1.375', letterSpacing: '-0.025em' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '1.25', letterSpacing: '-0.05em' }],   // 36px
        '5xl': ['2.8125rem', { lineHeight: '1.25', letterSpacing: '-0.05em' }], // 45px
        '6xl': ['3.5rem', { lineHeight: '1', letterSpacing: '-0.05em' }],      // 56px
        '7xl': ['4.375rem', { lineHeight: '1', letterSpacing: '-0.05em' }],    // 70px
        '8xl': ['5.46875rem', { lineHeight: '1', letterSpacing: '-0.05em' }],  // 87.5px
        '9xl': ['6.8359375rem', { lineHeight: '1', letterSpacing: '-0.05em' }], // 109.375px
        
        // Responsive Typography
        'responsive-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'responsive-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'responsive-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'responsive-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'responsive-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'responsive-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'responsive-3xl': 'clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem)',
        'responsive-4xl': 'clamp(2.25rem, 1.8rem + 2.25vw, 3rem)',
        'responsive-5xl': 'clamp(2.8125rem, 2.2rem + 3.0625vw, 3.75rem)',
        'responsive-6xl': 'clamp(3.5rem, 2.8rem + 3.5vw, 4.5rem)',
      },
      
      // Font Weights
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      
      // Line Heights
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      
      // Letter Spacing
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      // Font Families
      fontFamily: {
        'primary': ['Open Sauce Sans', 'Inter', 'system-ui', 'sans-serif'],
        'heading': ['Open Sauce Sans', 'Inter', 'system-ui', 'sans-serif'],
        'mono': ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', 'monospace'],
        'serif': ['Playfair Display', 'Georgia', 'serif'],
        'sans': ['Open Sauce Sans', 'Inter', 'system-ui', 'sans-serif'],
        'soft': ['Open Sauce Sans', 'Nunito', 'Poppins', 'system-ui', 'sans-serif'],
      },
      
      // Colors - Enhanced with design system
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Design System Colors
        turquoise: {
          DEFAULT: '#00B8A9',
          light: '#4DD0C1',
          dark: '#008B7A',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        charcoal: '#2E2E2E',
        'soft-white': '#F9FAFA',
        coral: '#FF6B6B',
        'slate-gray': '#6B7A8F',
        'light-gray': '#E0E5E9',
        
        // Calm-Tech Pastell-Farbschema
        calm: {
          rose: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
          },
          lilac: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7c3aed',
            800: '#6b21a8',
            900: '#581c87',
          },
          turquoise: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
          },
          yellow: {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
          },
          peach: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
          },
        },
        
        // Warm-neutral Wellness Colors
        warm: {
          cream: {
            50: '#fefdfb',
            100: '#fdf9f3',
            200: '#faf2e6',
            300: '#f5e6d3',
            400: '#edd4b8',
            500: '#e2c19c',
            600: '#d4a574',
            700: '#c4904f',
            800: '#b07c3a',
            900: '#9a6b2e',
          },
          sage: {
            50: '#f6f7f4',
            100: '#e8ebe5',
            200: '#d1d7c8',
            300: '#b4c0a6',
            400: '#9aa888',
            500: '#7f8f6b',
            600: '#6a7558',
            700: '#565e48',
            800: '#474c3c',
            900: '#3c4033',
          },
          stone: {
            50: '#fafaf9',
            100: '#f5f5f4',
            200: '#e7e5e4',
            300: '#d6d3d1',
            400: '#a8a29e',
            500: '#78716c',
            600: '#57534e',
            700: '#44403c',
            800: '#292524',
            900: '#1c1917',
          },
        },
      },
      
      // Border Radius
      borderRadius: {
        'none': '0px',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
        'design-sm': '8px',
        'design-md': '12px',
        'design-lg': '16px',
        'design-xl': '24px',
      },
      
      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'design-sm': '0 1px 3px rgba(46, 46, 46, 0.1)',
        'design-md': '0 4px 12px rgba(46, 46, 46, 0.1)',
        'design-lg': '0 8px 24px rgba(46, 46, 46, 0.1)',
      },
      
      // Animation
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          from: { transform: "translateY(0)", opacity: "1" },
          to: { transform: "translateY(-10px)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
      },
      
      // Custom utilities
      spacing: {
        'component-padding': '16px',
        'component-margin': '24px',
        'section-padding': '64px',
        'content-padding': '24px',
        'grid-gap': '24px',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for design system utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Typography utilities
        '.text-responsive-xs': {
          fontSize: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        },
        '.text-responsive-sm': {
          fontSize: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        },
        '.text-responsive-base': {
          fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        },
        '.text-responsive-lg': {
          fontSize: 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        },
        '.text-responsive-xl': {
          fontSize: 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        },
        '.text-responsive-2xl': {
          fontSize: 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        },
        '.text-responsive-3xl': {
          fontSize: 'clamp(1.875rem, 1.5rem + 1.875vw, 2.25rem)',
        },
        '.text-responsive-4xl': {
          fontSize: 'clamp(2.25rem, 1.8rem + 2.25vw, 3rem)',
        },
        '.text-responsive-5xl': {
          fontSize: 'clamp(2.8125rem, 2.2rem + 3.0625vw, 3.75rem)',
        },
        '.text-responsive-6xl': {
          fontSize: 'clamp(3.5rem, 2.8rem + 3.5vw, 4.5rem)',
        },
        
        // Component spacing
        '.container': {
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
        },
        '.section': {
          padding: '64px 0',
        },
        '.grid': {
          display: 'grid',
          gap: '24px',
        },
        '.flex': {
          display: 'flex',
          gap: '16px',
        },
        '.flex-col': {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
