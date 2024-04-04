"use client";

import FactoLogo from "@/components/svgs/facto-logo";
import { FactoLogoText } from "@/components/svgs/facto-logo-text";
import { Link } from "@/navigation";
import { InvestorChoiceCard } from "./investor-choice-card";
import { OriginatorChoiceCard } from "./originator-choice-card";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Opening() {
  const t = useTranslations("opening-page");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <nav className="relative z-[2] w-full py-4 dark:bg-background md:h-[153px] md:pt-16">
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center justify-start gap-2">
            <Image
              src="/facto-logo.png"
              height={40.95}
              width={158}
              alt="Logo"
              className="h-[32px] w-[123.47px] md:h-[40.95px] md:w-[158px]"
              quality={100}
            />
          </Link>
        </div>

        <div className="absolute -right-[50%] -top-[500%] hidden size-[1200px] rounded-full bg-[radial-gradient(circle,_rgba(163,222,16,1)_0%,_rgba(224,255,146,0)_100%)] opacity-15 blur-3xl md:block lg:-right-[50%]"></div>
      </nav>

      <main className="container relative z-[2]">
        <div className="py-[88px]">
          <h1 className="text-6xl font-extrabold text-foreground">{t("title")}</h1>
          <p className="text-xl text-facto-primary">{t("description")}</p>
        </div>

        <div className="grid grid-cols-2 gap-14">
          <InvestorChoiceCard />
          <OriginatorChoiceCard />
        </div>
      </main>

      <Image
        src="/opening-bg-illustration.png"
        height={1366}
        width={768}
        quality={100}
        alt="BG"
        aria-hidden="true"
        className="pointer-events-none absolute -right-[30%] top-0 hidden h-[768px] w-[1366px] opacity-25 blur-[2px] md:block"
      />

      <Image
        src="/opening-bg-illustration-2.png"
        height={870}
        width={542.15}
        quality={100}
        alt="BG"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[51px] bottom-[41px] hidden h-[542.15px] w-[870px] md:block"
      />
    </div>
  );
}
