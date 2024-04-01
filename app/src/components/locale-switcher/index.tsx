"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams, usePathname as useNextPathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "../../navigation";

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  function changeLocale(localeParam: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale: localeParam },
      );
    });
  }

  const otherLocale = locale === "en" ? "pt-BR" : "en";
  return (
    <Button
      className="flex gap-1 transition-opacity hover:opacity-50"
      variant="secondary"
      size="sm"
      onClick={() => changeLocale(otherLocale)}
    >
      <Globe size={16} />
      {locale.toUpperCase()}
    </Button>
  );
}
