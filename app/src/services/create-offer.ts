import BN from "bn.js";
import { nanoid } from "nanoid";
import { PublicKey, Keypair } from "@solana/web3.js";
import { Program, utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl";

export type CreateOfferParams = {
  description: string;
  deadlineDate: Date;
  goalAmount: number;
  startDate?: Date;
  minAmountInvest: number;
  interestRatePercent: number;
  installmentsTotal: number;
  installmentsStartDate?: Date;

  caller: Keypair;
  program: Program<Hackathon>;
};

export async function createOffer({
  deadlineDate,
  description,
  goalAmount,
  interestRatePercent,
  installmentsStartDate,
  installmentsTotal,
  minAmountInvest,
  startDate,
  caller,
  program,
}: CreateOfferParams) {
  const id = nanoid(16);

  const [originator] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("originator"), caller.publicKey.toBuffer()],
    program.programId,
  );
  const [offer] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("offer"), utils.bytes.utf8.encode(id)],
    program.programId,
  );
  const [vault] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("offer_vault"), offer.toBuffer()],
    program.programId,
  );
  const [token] = PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("offer_token"), offer.toBuffer()],
    program.programId,
  );

  await program.methods
    .createOffer(
      id,
      description,
      new BN(deadlineDate.getTime()),
      new BN(goalAmount),
      startDate ? new BN(startDate.getTime()) : null,
      new BN(minAmountInvest),
      interestRatePercent,
      installmentsTotal,
      installmentsStartDate ? new BN(installmentsStartDate.getTime()) : null,
    )
    .accounts({
      originator,
      payer: caller.publicKey,
      caller: caller.publicKey,
      offer,
      vault,
      token,
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
