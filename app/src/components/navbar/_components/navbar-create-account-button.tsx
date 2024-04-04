import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useSession } from "@/hooks/use-session";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export function NavbarCreateAccountButton() {
  const { data, isPending } = useSession();
  const { login } = useAuth();
  const t = useTranslations("navbar");
  const locale = useLocale();

  if (!!data?.userInfo) return null;

  if (isPending) {
    return <Loader2 size={16} className="animate-spin" />;
  }

  return (
    <Button variant="defaultGradient" onClick={() => login()}>
      {t("create-account")}
    </Button>
  );
}
