import BN from "bn.js";
import { nanoid } from "nanoid";
import { PublicKey, Keypair } from "@solana/web3.js";
import { FAKE_MINT } from "@/app/[locale]/test-token-account-transfer/page";
import { Program, utils } from "@coral-xyz/anchor";

export type CreateOfferParams = {
  description: string;
  deadlineDate: Date;
  goalAmount: BN;
  startDate?: Date;
  minAmountInvest: BN;
  interestRatePercent: number;
  installmentsTotal: number;
  installmentsStartDate?: Date;

  caller: Keypair;
  program: Program;
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

  const tx = await program.methods
    .createOffer(
      id,
      description,
      new BN(deadlineDate.getTime()),
      goalAmount,
      startDate ? new BN(startDate.getTime()) : null,
      minAmountInvest,
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
    .rpc({ commitment: "processed" });

  return tx;
}
