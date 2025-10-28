import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem", /* 9px */
        md: ".375rem", /* 6px */
        sm: ".1875rem", /* 3px */
      },
      colors: {
        // Thèmes sportifs CoachPro-Saas
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        border: "var(--color-border)",
        card: "var(--color-card)",
        muted: "var(--color-muted)",
        
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-background)",
          hover: "var(--color-hover)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-background)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-foreground)",
        },
        
        // Couleurs système
        input: "var(--color-border)",
        destructive: {
          DEFAULT: "hsl(0 84% 60%)",
          foreground: "hsl(0 0% 98%)",
        },
        ring: "var(--color-primary)",
        
        // Sidebar
        sidebar: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-foreground)",
          border: "var(--color-border)",
          primary: "var(--color-primary)",
          "primary-foreground": "var(--color-background)",
          accent: "var(--color-secondary)",
          "accent-foreground": "var(--color-background)",
        },
        
        // Charts
        chart: {
          "1": "var(--color-primary)",
          "2": "var(--color-secondary)",
          "3": "var(--color-accent)",
          "4": "var(--color-muted)",
          "5": "var(--color-border)",
        },
        
        // Status
        status: {
          online: "var(--color-secondary)",
          away: "var(--color-accent)",
          busy: "hsl(0 84% 60%)",
          offline: "var(--color-muted)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Poppins", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
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
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slow": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-primary": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-slow": "fade-in-slow 2s ease-in-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-primary": "pulse-primary 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;