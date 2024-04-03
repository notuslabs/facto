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
