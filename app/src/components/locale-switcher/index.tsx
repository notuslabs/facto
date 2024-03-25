"use client";

import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useRouter, usePathname } from "../../navigation";

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  function changeLocale(locale: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        { pathname, params },
        { locale: locale },
      );
    });
  }

  const locale = useLocale();
  const otherLocale = locale === "en" ? "pt-br" : "en";
  return (
    <Button
      className="flex gap-1 font-semibold"
      variant={"ghost"}
      onClick={() => changeLocale(otherLocale)}
    >
      <Globe size={20} />
      {locale.toUpperCase()}
    </Button>
  );
}
