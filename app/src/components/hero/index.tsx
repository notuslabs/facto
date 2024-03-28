"use client";

import { useAuth } from "@/hooks/use-auth";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export function Hero() {
  const t = useTranslations("home.hero");
  const { login } = useAuth();

  return (
    <div className="flex h-[304px] w-full flex-col items-center justify-center dark:bg-background">
      <div className="flex flex-col gap-2 text-primary ">
        <h1 className="text-center text-5xl font-extrabold">{t("title")}</h1>
        <p className="text-center text-lg font-medium">{t("description")}</p>
        <Button onClick={() => login()}>Logar pai</Button>
      </div>
    </div>
  );
}
