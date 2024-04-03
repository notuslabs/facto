import BN from "bn.js";

export function formatNumber(value: number, locale = "pt-BR", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

export function formatPercent(value: number, locale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
  }).format(value);
}
