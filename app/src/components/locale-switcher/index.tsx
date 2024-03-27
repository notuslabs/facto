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
  const path = useNextPathname();
  const params = useParams();
  const locale = useLocale();

  function changeLocale(localeParam: string) {
    console.log({
      path,
      pathname,
      params,
    });
    const withoutLocale = path.replace(`/${locale}`, "");
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
      className="flex gap-1 font-semibold"
      variant="ghost"
      onClick={() => changeLocale(otherLocale)}
    >
      <Globe size={20} />
      {locale.toUpperCase()}
    </Button>
  );
}
