import { Offer } from "@/structs/Offer";
import { getProgram } from "./get-program";

export async function listOffers(): Promise<Offer[]> {
  const program = getProgram();

  const offers = await program.account.offer.all();
  const rawOffers = await Offer.fromRawCollection(offers);

  return rawOffers.map((offer) => offer.toJSON());
}
