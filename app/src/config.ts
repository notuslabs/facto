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
  "/become/investor": {
    en: "/become/investor",
    "pt-BR": "/become/investor",
  },
  "/become/originator": {
    en: "/become/originator",
    "pt-BR": "/become/originator",
  },
  "/offers/create": {
    en: "/offers/create",
    "pt-BR": "/offers/create",
  },
  "/offers/[id]": {
    en: "/offers/[id]",
    "pt-BR": "/offers/[id]",
  },
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
