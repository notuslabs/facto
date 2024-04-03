import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

type DateFormatter = typeof format;

export const useDateFormatter = () => {
  const locale = useLocale();

  const formatDate: DateFormatter = (...args) =>
    format(args[0], args[1], {
      locale: locale === "pt-BR" ? ptBR : enUS,
      ...(args[2] ?? {}),
    });

  return formatDate;
};
