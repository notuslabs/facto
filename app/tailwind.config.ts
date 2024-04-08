import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.875rem" }],
        xl: ["1.25rem", { lineHeight: "2rem" }],
        "2xl": ["1.5rem", { lineHeight: "2.375rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.625rem" }],
        "4xl": ["2.25rem", { lineHeight: "3.25rem" }],
        "5xl": ["3rem", { lineHeight: "4.5rem" }],
        "6xl": ["3.75rem", { lineHeight: "5.375rem" }],
        "7xl": ["4.5rem", { lineHeight: "6.75rem" }],
        "8xl": ["6rem", { lineHeight: "9rem" }],
        "9xl": ["6.75rem", { lineHeight: "12rem" }],
      },
      colors: {
        brand: {
          50: "hsl(var(--brand-primary-50))",
          100: "hsl(var(--brand-primary-100))",
          200: "hsl(var(--brand-primary-200))",
          300: "hsl(var(--brand-primary-300))",
          400: "hsl(var(--brand-primary-400))",
          500: "hsl(var(--brand-primary-500))",
          600: "hsl(var(--brand-primary-600))",
          700: "hsl(var(--brand-primary-700))",
          800: "hsl(var(--brand-primary-800))",
        },
        success: {
          foreground: "hsl(var(--success-foreground))",
          strong: {
            DEFAULT: "hsl(var(--success-strong))",
            foreground: "hsl(var(--success-strong-foreground))",
          },
          border: "hsl(var(--success-border))",
          muted: {
            DEFAULT: "hsl(var(--success-muted))",
            hover: "hsl(var(--success-muted-hover))",
            active: "hsl(var(--success-muted-active))",
            border: "hsl(var(--success-muted-border))",
          },
        },
        error: {
          foreground: "hsl(var(--error-foreground))",
          active: {
            foreground: "hsl(var(--error-active-foreground))",
          },
          strong: {
            DEFAULT: "hsl(var(--error-strong))",
            foreground: "hsl(var(--error-strong-foreground))",
            hover: "hsl(var(--error-strong-hover))",
            active: {
              DEFAULT: "hsl(var(--error-strong-active))",
              foreground: "hsl(var(--error-strong-active-foreground))",
            },
          },
          muted: {
            DEFAULT: "hsl(var(--error-muted))",
            hover: "hsl(var(--error-muted-hover))",
            active: "hsl(var(--error-muted-active))",
          },
          border: "hsl(var(--error-border))",
          hover: {
            border: "hsl(var(--error-hover-border))",
            active: "hsl(var(--error-active-border))",
            muted: "hsl(var(--error-muted-border))",
          },
        },
        warning: {
          foreground: "hsl(var(--warning-foreground))",
          strong: {
            DEFAULT: "hsl(var(--warning-strong))",
            foreground: "hsl(var(--warning-strong-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--warning-muted))",
            hover: "hsl(var(--warning-muted-hover))",
            active: "hsl(var(--warning-muted-active))",
            border: "hsl(var(--warning-muted-border))",
          },
          border: "hsl(var(--warning-border))",
        },
        info: {
          foreground: "hsl(var(--info-foreground))",
          strong: {
            DEFAULT: "hsl(var(--info-strong))",
            foreground: "hsl(var(--info-strong-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--info-muted))",
            hover: "hsl(var(--info-muted-hover))",
            active: "hsl(var(--info-muted-active))",
            border: "hsl(var(--info-muted-border))",
          },
          border: "hsl(var(--info-border))",
        },
        interactive: {
          DEFAULT: "hsl(var(--interactive))",
          foreground: "hsl(var(--interactive-foreground))",
          strong: {
            foreground: "hsl(var(--interactive-strong-foreground))",
          },
          hover: {
            DEFAULT: "hsl(var(--interactive-hover))",
            border: "hsl(var(--interactive-hover-border))",
          },
          active: {
            DEFAULT: "hsl(var(--interactive-active))",
            border: "hsl(var(--interactive-active-border))",
          },
          focus: {
            border: "hsl(var(--interactive-focus-border))",
          },
          muted: {
            DEFAULT: "hsl(var(--interactive-muted))",
            hover: "hsl(var(--interactive-muted-hover))",
            active: "hsl(var(--interactive-muted-active))",
          },
          border: "hsl(var(--interactive-border)",
        },
        magic: {
          DEFAULT: "hsl(var(--magic))",
          foreground: "hsl(var(--magic-foreground))",
          hover: "hsl(var(--magic-hover))",
          active: "hsl(var(--magic-active))",
          muted: {
            DEFAULT: "hsl(var(--magic-muted))",
            hover: "hsl(var(--magic-muted-hover))",
            active: "hsl(var(--magic-muted-active))",
            border: "hsl(var(--magic-muted-border))",
          },
          strong: {
            foreground: "hsl(var(--magic-strong-foreground))",
          },
          border: "hsl(var(--magic-border))",
        },
        icon: {
          DEFAULT: "hsl(var(--icon))",
          disabled: "hsl(var(--icon-disabled))",
          muted: "hsl(var(--icon-muted))",
          inverse: "hsl(var(--icon-inverse))",
          "on-color": "hsl(var(--icon-on-color))",
          primary: "hsl(var(--icon-primary))",
          success: "hsl(var(--icon-success))",
          error: "hsl(var(--icon-error)",
          warning: "hsl(var(--icon-warning))",
          info: "hsl(var(--icon-info))",
          interactive: "hsl(var(--icon-interactive))",
          magic: "hsl(var(--icon-magic))",
        },
        focus: {
          ring: {
            border: "hsl(var(--focus-ring-border))",
          },
        },
        elevated: "hsl(var(--elevated))",
        subtle: "hsl(var(--subtle))",
        disabled: {
          DEFAULT: "hsl(var(--disabled))",
          foreground: "hsl(var(--disabled-foreground))",
        },
        placeholder: {
          foreground: "hsl(var(--placeholder-foreground))",
        },
        strong: "hsl(var(--strong))",
        inverse: {
          DEFAULT: "hsl(var(--inverse))",
          foreground: "hsl(var(--inverse-foreground))",
        },
        "on-color": {
          foreground: "hsl(var(--on-color-foreground))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          "on-color": "hsl(var(--border-on-color))",
          hover: "hsl(var(--border-hover))",
          disabled: "hsl(var(--border-disabled))",
        },
        input: {
          DEFAULT: "hsl(var(--input))",
          border: "hsl(var(--input-border))",
          hover: {
            border: "hsl(var(--input-hover-border))",
          },
        },
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: {
            foreground: "hsl(var(--primary-hover-foreground))",
          },
          border: {
            DEFAULT: "hsl(var(--primary-border))",
          },
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsla(var(--secondary-hover))",
          active: "hsl(var(--secondary-active))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
