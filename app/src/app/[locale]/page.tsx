import { Hero } from "@/components/hero";
import { Offers } from "@/components/hero/offers";
import type { PageProps } from "@/lib/types";
import { unstable_setRequestLocale } from "next-intl/server";
import { listAllOffers } from "@/services/list-offer";

export default async function Home({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);

  const offers = await listAllOffers();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Offers offers={offers} />
    </main>
  );
}
