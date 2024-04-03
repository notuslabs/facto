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
      <main className="flex flex-col gap-8 p-4 md:container lg:gap-[4.5rem]">
        <div className="md:hidden">
          <LateralCard offerId={offer.id} />
        </div>

        <Header
          name={offer.name}
          description={offer.description}
          score={offer.creditScore}
          acquiredAmount={offer.acquiredAmount}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
          <OfferContent offerId={params.id} offerScoreRange={offer.creditScore} />

          <div className="hidden w-full md:mt-[4.5rem] md:block lg:-mt-40">
            <LateralCard offerId={offer.id} />
          </div>
        </div>
      </main>
    </HydrationBoundary>
  );
}
