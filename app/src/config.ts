import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "pt-br"] as const;

export const pathnames = {
  "/": "/",
  "/investments": {
    en: "/investments",
    "pt-br": "/investments",
  },
  "/receivables": {
    en: "/receivables",
    "pt-br": "/receivables",
  },
  "/transactions": {
    en: "/transactions",
    "pt-br": "/transactions",
  },
  "/become/investor": {
    en: "/become/investor",
    "pt-br": "/become/investor",
  },
  "/become/originator": {
    en: "/become/originator",
    "pt-br": "/become/originator",
  },
  "/offers/create": {
    en: "/offers/create",
    "pt-br": "/offers/create",
  },
  "/offers/[id]": {
    en: "/offers/[id]",
    "pt-br": "/offers/[id]",
  },
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
