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
  "/installments": {
    en: "/installments",
    "pt-BR": "/installments",
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
  "/become/borrower": {
    en: "/become/borrower",
    "pt-BR": "/become/borrower",
  },
  "/my-offers": {
    en: "/my-offers",
    "pt-BR": "/my-offers",
  },
  "/offers": {
    en: "/offers",
    "pt-BR": "/offers",
  },
  "/admin/offers/create": {
    en: "/admin/offers/create",
    "pt-BR": "/admin/offers/create",
  },
  "/offers/[id]": {
    en: "/offers/[id]",
    "pt-BR": "/offers/[id]",
  },
  "/admin/offers": {
    en: "/admin/offers",
    "pt-BR": "/admin/offers",
  },
  "/admin/installments": {
    en: "/admin/installments",
    "pt-BR": "/admin/installments",
  },
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
