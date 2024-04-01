import { Hero } from "@/components/hero";
import { Offers } from "@/components/hero/offers";
import { PageProps } from "@/lib/types";
import { listOffers } from "@/services/list-offers";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { unstable_setRequestLocale } from "next-intl/server";

export default async function Home({ params }: PageProps<{ locale: string }>) {
  const queryClient = new QueryClient();
  unstable_setRequestLocale(params.locale);

  await queryClient.prefetchQuery({
    queryKey: ["offers"],
    queryFn: listOffers,
  });

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Offers />
      </HydrationBoundary>
    </main>
  );
}
