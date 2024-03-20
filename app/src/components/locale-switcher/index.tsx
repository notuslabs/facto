import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const otherLocale = locale === "en" ? "pt-br" : "en";
  return (
    <Link className="flex gap-2" href={`/${otherLocale}`} locale={otherLocale}>
      <Globe size={24} />
      {locale === "en" ? "PT-BR" : "EN"}
    </Link>
  );
}
