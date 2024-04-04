import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Keypair } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { useProgram } from "@/hooks/use-program";

export function ContractInteractTestButton() {
  const { data: programData } = useProgram();

  const keypair = programData?.keypair;
  const program = programData?.program;

  async function interact() {
    if (!program || !keypair) {
      return;
    }

    const borrowerKeypair = Keypair.generate();

    const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("borrower_token_account"), borrowerKeypair.publicKey.toBuffer()],
      program.programId,
    );

    await program.methods
      .createBorrower("Teste", "description", "SLUG")
      .accounts({
        borrower: borrowerKeypair.publicKey,
        borrowerTokenAccount: borrowerTokenAccountPubKey,
        payer: keypair.publicKey,
        caller: keypair.publicKey,
      })
      .signers([keypair, borrowerKeypair])
      .rpc();

    await program.account.borrower.fetch(borrowerKeypair.publicKey);
  }
  return (
    <div className="container">
      <Button onClick={interact}>Create new Borrower</Button>
    </div>
  );
}
