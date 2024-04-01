import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useLocale, useTranslations } from "next-intl";

export function NavbarCreateAccountButton() {
  const { data } = useSession();
  const t = useTranslations("navbar");
  const locale = useLocale();

  if (data?.userInfo) return null;

  return (
    <Button variant={"ghost"}>
      <a href={`/${locale}/create-account`}>{t("create-account")}</a>
    </Button>
  );
}
