"use client";

import Image from "next/image";
import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslations } from "next-intl";

export function NavbarUserButton() {
  const { userInfo, logout } = useSession();
  const t = useTranslations("navbar");

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
        <Button variant="secondary" onClick={logout}>
          {t("logout")}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
