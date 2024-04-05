import { FAKE_MINT } from "@/lib/constants";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Signer, PublicKey, SystemProgram } from "@solana/web3.js";
export type ClaimInstallmentProps = {
  offerId: string;

  caller: Signer;
  program: Program<Hackathon>;
};

export async function claimInstallment({ program, caller, offerId }: ClaimInstallmentProps) {
  const [offerPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("offer"), Buffer.from(offerId)],
    program.programId,
  );
  const [investorPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("investor"), caller.publicKey.toBuffer()],
    program.programId,
  );
  const [investmentPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("investment"), offerPubKey.toBuffer(), investorPubKey.toBuffer()],
    program.programId,
  );
  const [investorOfferTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("investor_offer_token_account"),
      offerPubKey.toBuffer(),
      investorPubKey.toBuffer(),
    ],
    program.programId,
  );
  const [investorStableTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("investor_stable_token_account"), investorPubKey.toBuffer()],
    program.programId,
  );
  const [offerTokenPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("offer_token"), offerPubKey.toBuffer()],
    program.programId,
  );
  const [vaultPaymentTokenAccountPubKey] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault_payment_token_account"), offerPubKey.toBuffer()],
    program.programId,
  );

  const claimTx = await program.methods
    .withdrawInstallment(offerId)
    .accountsStrict({
      caller: caller.publicKey,
      payer: caller.publicKey,
      investment: investmentPubKey,
      investor: investorPubKey,
      offer: offerPubKey,
      investorOfferTokenAccount: investorOfferTokenAccountPubKey,
      investorStableTokenAccount: investorStableTokenAccountPubKey,
      offerToken: offerTokenPubKey,
      stableToken: FAKE_MINT,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      vaultPaymentTokenAccount: vaultPaymentTokenAccountPubKey,
    })
    .signers([caller])
    .rpc({ commitment: "finalized" });

  return claimTx;
}
