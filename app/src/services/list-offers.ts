import { Offer } from "@/structs/Offer";
import { PublicKey } from "@solana/web3.js";
import { getProgram } from "./get-program";

export async function listOffers(): Promise<Offer[]> {
  const program = getProgram();

  const offers = await program.account.offer.all();
  const rawOffers = await Offer.fromRawCollection(offers);

  return rawOffers.map((offer) => offer.toJSON());
}

export async function listOffersByOriginator(
  originator: PublicKey,
  filterByStatus?: string[],
): Promise<Offer[]> {
  const program = getProgram();

  const offers = await program.account.offer.all([
    {
      memcmp: {
        offset: 8,
        bytes: originator.toBase58(),
      },
    },
  ]);
  const rawOffers = await Offer.fromRawCollection(offers);

  if (filterByStatus && filterByStatus.length > 0) {
    return rawOffers.filter((offer) => {
      offer = offer.toJSON();
      if (filterByStatus.includes(offer.status)) return offer;
    });
  }

  return rawOffers.map((offer) => offer.toJSON());
}
