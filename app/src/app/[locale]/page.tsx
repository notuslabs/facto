import { Hero } from "@/components/hero";
import { Offers } from "@/components/hero/offers";
import { PageProps } from "@/lib/types";
import { listOffers } from "@/services/list-offers";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function Home({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);

  const offers = await listOffers();

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Offers offers={offers} />
    </main>
  );
}
