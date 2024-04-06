"use client";

import { Link } from "@/navigation";
import { InvestorChoiceCard } from "./investor-choice-card";
import { BorrowerChoiceCard } from "./borrower-choice-card";
import Image from "next/image";
import { useLocale } from "next-intl";
import LocaleSwitcher from "@/components/locale-switcher";

export function Opening() {
  const locale = useLocale();

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

          <LocaleSwitcher />
        </div>

        <div className="absolute -right-[50%] -top-[500%] hidden size-[1200px] rounded-full bg-[radial-gradient(circle,_rgba(163,222,16,1)_0%,_rgba(224,255,146,0)_100%)] opacity-15 blur-3xl md:block lg:-right-[50%]"></div>
      </nav>

      <main className="container relative z-[2]">
        <div className="flex flex-col gap-1 pb-16 pt-[56.58px]">
          {locale === "en" ? (
            <>
              <h1 className="text-balance text-6xl leading-[72.61px] text-foreground">
                <span className="font-extrabold">Borrow</span> or{" "}
                <span className="font-extrabold">lend</span> money at{" "}
                <span className="font-extrabold">better rates</span> with{" "}
                <span className="font-extrabold">Facto</span>
              </h1>
              <p className="text-lg">
                The 100% onchain credit marketplace built with{" "}
                <span className="inline-block bg-gradient-to-r from-[#15D085] via-[#20E69D] to-[#AA66FE] bg-clip-text text-transparent">
                  Solana Token Extensions
                </span>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-extrabold leading-[72.61px] text-foreground">
                Peça emprestado ou empreste dinheiro com taxas melhores com a Facto
              </h1>
              <p className="text-lg">
                O mercado de crédito 100% on-chain construído com{" "}
                <span className="inline-block bg-gradient-to-r from-[#15D085] via-[#20E69D] to-[#AA66FE] bg-clip-text text-transparent">
                  Extensões de token Solana
                </span>
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-14">
          <InvestorChoiceCard />
          <BorrowerChoiceCard />
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
