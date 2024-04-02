import BN from "bn.js";
import { nanoid } from "nanoid";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Program, utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl/facto-idl-types";

export type CreateOfferParams = {
  description: string;
  deadlineDate: Date;
  goalAmount: number;
  startDate: Date;
  minAmountInvest: number;
  installmentsTotalAmount: number;
  installmentsCount: number;
  installmentsStartDate: Date;

  caller: Keypair;
  program: Program<Hackathon>;
};

export async function createOffer({
  deadlineDate,
  description,
  goalAmount,
  installmentsTotalAmount,
  installmentsStartDate,
  installmentsCount,
  minAmountInvest,
  startDate,
  caller,
  program,
}: CreateOfferParams) {
  const id = nanoid(16);

  const [offer] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("offer"), utils.bytes.utf8.encode(id)],
    program.programId,
  );

  await program.methods
    .createOffer(
      id,
      description,
      new BN(deadlineDate.getTime()),
      new BN(goalAmount),
      new BN(startDate.getTime()),
      new BN(minAmountInvest),
      installmentsCount,
      new BN(installmentsTotalAmount),
      new BN(installmentsStartDate.getTime()),
    )
    .accounts({
      payer: caller.publicKey,
      caller: caller.publicKey,
      offer,
      stableToken: FAKE_MINT,
    })
    .signers([caller])
    .rpc({ commitment: "finalized" });

  return {
    tx: offer.toString(),
    id: id,
    offerAddress: offer.toString(),
  };
}
