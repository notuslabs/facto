"use client";

import { useAuth } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <div className="flex w-full flex-col items-center justify-center bg-background px-4 py-10 md:h-[304px]">
      <div className="flex flex-col gap-2 text-primary">
        <h1 className="text-center text-3xl font-extrabold md:text-5xl">{t("title")}</h1>
        <p className="text-center text-sm font-medium md:text-lg">{t("description")}</p>
      </div>
    </div>
  );
}
