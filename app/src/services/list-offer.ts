import { Program } from "@coral-xyz/anchor";
import { Connection } from "@solana/web3.js";
import idl from "../../../target/idl/hackathon.json";
import { IDL } from "@/lib/idl";
import { env } from "@/env";
import type { Offer } from "@/lib/idl/offer";

export async function listAllOffers(): Promise<Offer[]> {
  const program = new Program<typeof IDL>(IDL, idl.metadata.address, {
    connection: new Connection(env.NEXT_PUBLIC_RPC_URL),
  });

  const offers = await program.account.offer.all();

  const originators = await program.account.originator.fetchMultiple(
    offers.map((offer) => offer.account.originator),
  );

  const offersWithOriginator = offers.map((offer, index) => ({
    ...offer.account,
    originator: originators[index],
  })) as Offer[];

  return offersWithOriginator.sort((a, b) => a.discriminator - b.discriminator);
}
