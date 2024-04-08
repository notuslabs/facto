import { Header } from "@/components/header";
import { LateralCard } from "./_components/lateral-card";
import { PageProps } from "@/lib/types";
import { OfferContent } from "./_components/offer-content";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getOffer } from "@/services/get-offer";
import { Offer } from "@/structs/Offer";
import { notFound } from "next/navigation";

export default async function OfferPage({
  params,
}: PageProps<{
  id: string;
  locale: string;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["offer", params.id],
    queryFn: () => getOffer(params.id),
  });

  const offer = queryClient.getQueryData<Offer>(["offer", params.id]);

  if (!offer) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="container flex flex-col gap-8 p-4 lg:flex-row-reverse lg:items-start lg:justify-start lg:gap-[4.5rem]">
        <div className="sticky lg:top-[4.5rem] lg:mt-[4.5rem]">
          <LateralCard offerId={offer.id} />
        </div>

        <div>
          <Header
            name={offer.name}
            description={offer.description}
            score={offer.creditScore}
            acquiredAmount={offer.acquiredAmount}
          />

          <OfferContent offerId={params.id} offerScoreRange={offer.creditScore} />
        </div>
      </main>
    </HydrationBoundary>
  );
}
