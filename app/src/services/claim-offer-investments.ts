import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Signer, PublicKey, SystemProgram } from "@solana/web3.js";

export type ClaimOfferInvestmentsProps = {
  offerId: string;

  caller: Signer;
  program: Program<Hackathon>;
};

export async function claimOfferInvestments({
  caller,
  offerId,
  program,
}: ClaimOfferInvestmentsProps) {
  const [borrower] = PublicKey.findProgramAddressSync(
    [Buffer.from("borrower"), caller.publicKey.toBuffer()],
    program.programId,
  );

  const [borrowerTokenAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("borrower_token_account"), borrower.toBuffer()],
    program.programId,
  );

  const [offer] = PublicKey.findProgramAddressSync(
    [Buffer.from("offer"), Buffer.from(offerId)],
    program.programId,
  );

  const [vaultStableTokenAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from("offer_vault"), offer.toBuffer()],
    program.programId,
  );

  const signature = await program.methods
    .withdrawInvestments(offerId)
    .accountsStrict({
      payer: caller.publicKey,
      caller: caller.publicKey,
      borrower,
      borrowerTokenAccount,
      offer,
      stableToken: FAKE_MINT,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      vaultStableTokenAccount,
    })
    .rpc({ commitment: "finalized" });

  return {
    signature,
  };
}
