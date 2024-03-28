"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";
import { useSession } from "@/hooks/use-session";
import { useAuth } from "@/hooks/use-auth";

export function NavbarUserButton() {
  const { data } = useSession();
  const { logout } = useAuth();
  const t = useTranslations("navbar");
  const userInfo = data?.userInfo;

  if (!userInfo) return null;

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="secondary" className="flex gap-2 rounded-full pl-3 pr-2">
          <span className="text-xs font-medium">{userInfo?.name}</span>
          {userInfo.profileImage && (
            <Image
              src={userInfo.profileImage}
              alt={userInfo.name ?? "Avatar"}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-10 flex justify-end border-0 p-0">
        <Button variant="secondary" onClick={() => logout()}>
          {t("logout")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
