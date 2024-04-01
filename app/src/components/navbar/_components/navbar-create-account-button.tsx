import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";

export function NavbarCreateAccountButton() {
  const { userInfo } = useSession();
  const t = useTranslations("navbar");
  const locale = useLocale();

  if (userInfo) return null;

  return (
    <Button variant="defaultGradient">
      <a href={`/${locale}/create-account`}>{t("create-account")}</a>
    </Button>
  );
}
