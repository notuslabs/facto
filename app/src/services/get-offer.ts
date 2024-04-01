import { Offer } from "@/structs/Offer";
import { getProgram } from "./get-program";
import { PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";

export async function getOffer(id: string) {
  const program = getProgram();

  const [offerAddress] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("offer"), utils.bytes.utf8.encode(id)],
    program.programId,
  );

  try {
    const offer = await program.account.offer.fetch(offerAddress);
    const rawOffer = await Offer.fromRawItem({ account: offer });

    const originatorOffers = await program.account.offer.all([
      {
        memcmp: {
          offset: 8,
          bytes: offer.originator.toBase58(),
        },
      },
    ]);

    const rawOriginatorOffers = await Offer.fromRawCollection(originatorOffers);

    return {
      ...rawOffer.toJSON(),
      originatorOffers: rawOriginatorOffers.map((offer) => offer.toJSON()),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
