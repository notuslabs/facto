import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "pt-BR"] as const;

export const pathnames = {
  "/": "/",
  "/investments": {
    en: "/investments",
    "pt-BR": "/investments",
  },
  "/receivables": {
    en: "/receivables",
    "pt-BR": "/receivables",
  },
  "/transactions": {
    en: "/transactions",
    "pt-BR": "/transactions",
  },
  "/transactions/deposit": {
    en: "/transactions/deposit",
    "pt-BR": "/transactions/deposit",
  },
  "/transactions/withdrawal": {
    en: "/transactions/withdrawal",
    "pt-BR": "/transactions/withdrawal",
  },
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
