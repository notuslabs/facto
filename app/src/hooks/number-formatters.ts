import BN from "bn.js";
import { useLocale } from "next-intl";

type UseFormatNumberProps = {
  value: number;
  locale?: string;
  currency?: string;
};

export function useFormatNumber() {
  const l = useLocale();

  return ({ value, locale, currency = "USD" }: UseFormatNumberProps) =>
    new Intl.NumberFormat(locale ?? l, {
      style: "currency",
      currency: currency,
    }).format(value);
}

type UseFormatPercentProps = {
  value: number;
  locale?: string;
};

export function useFormatPercent() {
  const l = useLocale();

  return ({ value, locale }: UseFormatPercentProps) =>
    new Intl.NumberFormat(locale ?? l, {
      style: "percent",
      minimumFractionDigits: 2,
    }).format(value);
}

type UseFormatBigNumberProps = {
  value: BN;
  locale?: string;
  currency?: string;
};

export function useFormatBigNumber() {
  const l = useLocale();

  return ({ value, locale, currency = "USD" }: UseFormatBigNumberProps) =>
    new Intl.NumberFormat(locale ?? l, {
      style: "currency",
      currency: currency,
    }).format(value.toNumber()); // TODO: this is not right, it'll overflow
}
