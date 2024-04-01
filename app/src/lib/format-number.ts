import BN from "bn.js";

export function formatNumber(value: number, locale = "pt-BR", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

export function formatBigNumber(value: BN, locale = "pt-BR", currency = "USD") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value.toNumber()); // TODO: this is not right, it'll overflow
}
