import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <div className="flex h-[304px] w-full flex-col items-center justify-center dark:bg-zinc-800">
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-5xl font-extrabold">{t("title")}</h1>
        <p className="text-center text-lg font-medium">{t("description")}</p>
      </div>
    </div>
  );
}
