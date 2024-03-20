import { Hero } from "@/components/hero";
import { Offers } from "@/components/hero/offers";
import { PageProps } from "@/lib/types";
import { unstable_setRequestLocale } from "next-intl/server";

export default function Home({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Offers />
    </main>
  );
}
