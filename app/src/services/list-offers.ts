import { Offer } from "@/structs/Offer";
import { getProgram } from "./get-program";

export async function listOffers() {
  const program = getProgram();

  const offers = await program.account.offer.all();

  return Offer.fromRawCollection(offers);
}
