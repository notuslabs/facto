import { useProgram } from "@/hooks/use-program";
import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Keypair } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";

export function ContractInteractTestButton() {
  const { program, keypair } = useProgram();

  async function interact() {
    if (!program || !keypair) {
      return;
    }

    const originatorKeypair = Keypair.generate();

    const [originatorTokenAccountPubKey] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("originator_token_account"), originatorKeypair.publicKey.toBuffer()],
      program.programId,
    );

    await program.methods
      .createOriginator("Teste", "description", "SLUG")
      .accounts({
        originator: originatorKeypair.publicKey,
        originatorTokenAccount: originatorTokenAccountPubKey,
        payer: keypair.publicKey,
        caller: keypair.publicKey,
      })
      .signers([keypair, originatorKeypair])
      .rpc();

    const originatorInfo = await program.account.originator.fetch(originatorKeypair.publicKey);

    console.log({
      originatorInfo,
    });
  }
  return (
    <div className="container">
      <Button onClick={interact}>Create new Originator</Button>
    </div>
  );
}
