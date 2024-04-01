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
      colors: {
        facto: {
          primary: "var(--facto-primary-green)",
        },
        success: {
          foreground: "var(--success-foreground)",
          strong: {
            DEFAULT: "var(--success-strong)",
            foreground: "var(--success-strong-foreground)",
          },
          border: "var(--success-border)",
          muted: {
            DEFAULT: "var(--success-muted)",
            hover: "var(--success-muted-hover)",
            active: "var(--success-muted-active)",
            border: "var(--success-muted-border)",
          },
        },
        error: {
          foreground: "var(--error-foreground)",
          active: {
            foreground: "var(--error-active-foreground)",
          },
          strong: {
            DEFAULT: "var(--error-strong)",
            foreground: "var(--error-strong-foreground)",
            hover: "var(--error-strong-hover)",
            active: {
              DEFAULT: "var(--error-strong-active)",
              foreground: "var(--error-strong-active-foreground)",
            },
          },
          muted: {
            DEFAULT: "var(--error-muted)",
            hover: "var(--error-muted-hover)",
            active: "var(--error-muted-active)",
          },
          border: "var(--error-border)",
          hover: {
            border: "var(--error-hover-border)",
            active: "var(--error-active-border)",
            muted: "var(--error-muted-border)",
          },
        },
        warning: {
          foreground: "var(--warning-foreground)",
          strong: {
            DEFAULT: "var(--warning-strong)",
            foreground: "var(--warning-strong-foreground)",
          },
          muted: {
            DEFAULT: "var(--warning-muted)",
            hover: "var(--warning-muted-hover)",
            active: "var(--warning-muted-active)",
            border: "var(--warning-muted-border)",
          },
          border: "var(--warning-border)",
        },
        info: {
          foreground: "var(--info-foreground)",
          strong: {
            DEFAULT: "var(--info-strong)",
            foreground: "var(--info-strong-foreground)",
          },
          muted: {
            DEFAULT: "var(--info-muted)",
            hover: "var(--info-muted-hover)",
            active: "var(--info-muted-active)",
            border: "var(--info-muted-border)",
          },
          border: "var(--info-border)",
        },
        interactive: {
          DEFAULT: "var(--interactive)",
          foreground: "var(--interactive-foreground)",
          strong: {
            foreground: "var(--interactive-strong-foreground)",
          },
          hover: {
            DEFAULT: "var(--interactive-hover)",
            border: "var(--interactive-hover-border)",
          },
          active: {
            DEFAULT: "var(--interactive-active)",
            border: "var(--interactive-active-border)",
          },
          focus: {
            border: "var(--interactive-focus-border)",
          },
          muted: {
            DEFAULT: "var(--interactive-muted)",
            hover: "var(--interactive-muted-hover)",
            active: "var(--interactive-muted-active)",
          },
          border: "var(--interactive-border)",
        },
        magic: {
          DEFAULT: "var(--magic)",
          foreground: "var(--magic-foreground)",
          hover: "var(--magic-hover)",
          active: "var(--magic-active)",
          muted: {
            DEFAULT: "var(--magic-muted)",
            hover: "var(--magic-muted-hover)",
            active: "var(--magic-muted-active)",
            border: "var(--magic-muted-border)",
          },
          strong: {
            foreground: "var(--magic-strong-foreground)",
          },
          border: "var(--magic-border)",
        },
        icon: {
          DEFAULT: "var(--icon)",
          disabled: "var(--icon-disabled)",
          muted: "var(--icon-muted)",
          inverse: "var(--icon-inverse)",
          "on-color": "var(--icon-on-color)",
          primary: "var(--icon-primary)",
          success: "var(--icon-success)",
          error: "var(--icon-error)",
          warning: "var(--icon-warning)",
          info: "var(--icon-info)",
          interactive: "var(--icon-interactive)",
          magic: "var(--icon-magic)",
        },
        focus: {
          ring: {
            border: "var(--focus-ring-border)",
          },
        },
        elevated: "var(--elevated)",
        subtle: "var(--subtle)",
        disabled: {
          DEFAULT: "var(--disabled)",
          foreground: "var(--disabled-foreground)",
        },
        placeholder: {
          foreground: "var(--placeholder-foreground)",
        },
        strong: "var(--strong)",
        inverse: {
          DEFAULT: "var(--inverse)",
          foreground: "var(--inverse-foreground)",
        },
        "on-color": {
          foreground: "var(--on-color-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          "on-color": "var(--border-on-color)",
          hover: "var(--border-hover)",
          disabled: "var(--border-disabled)",
        },
        input: {
          DEFAULT: "var(--input)",
          border: "var(--input-border)",
          hover: {
            border: "var(--input-hover-border)",
          },
        },
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          hover: {
            foreground: "var(--primary-hover-foreground)",
          },
          border: {
            DEFAULT: "var(--primary-border)",
          },
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
          hover: "var(--secondary-hover)",
          active: "var(--secondary-active)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
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
