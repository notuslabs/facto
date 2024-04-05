import BN from "bn.js";
import { nanoid } from "nanoid";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { Program, utils } from "@coral-xyz/anchor";
import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { parseUnits } from "@/lib/parse-units";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";

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
  const [vaultPublicKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("offer_vault"), offer.toBuffer()],
    program.programId,
  );
  const [borrowerPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("borrower"), caller.publicKey.toBuffer()],
    program.programId,
  );
  const [offerTokenPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("offer_token"), offer.toBuffer()],
    program.programId,
  );

  await program.methods
    .createOffer(
      id,
      description,
      new BN(Math.round(deadlineDate.getTime() / 1000)),
      parseUnits(goalAmount),
      new BN(Math.round(startDate.getTime() / 1000)),
      parseUnits(minAmountInvest),
      installmentsCount,
      parseUnits(installmentsTotalAmount),
      new BN(Math.round(installmentsStartDate.getTime() / 1000)),
    )
    .accountsStrict({
      payer: caller.publicKey,
      caller: caller.publicKey,
      offer,
      vault: vaultPublicKey,
      borrower: borrowerPubKey,
      stableToken: FAKE_MINT,
      systemProgram: SystemProgram.programId,
      token: offerTokenPubKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .signers([caller])
    .rpc({ commitment: "finalized" });

  return {
    tx: offer.toString(),
    id: id,
    offerAddress: offer.toString(),
  };
}
