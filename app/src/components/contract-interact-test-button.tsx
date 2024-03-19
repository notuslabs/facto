import { useProgram } from "@/hooks/use-program";
import { Button } from "./ui/button";
import { Keypair } from "@solana/web3.js";

export function ContractInteractTestButton() {
  const { program, keypair } = useProgram();

  async function interact() {
    if (!program || !keypair) {
      return;
    }

    const originatorKeypair = Keypair.generate();

    await program.methods
      .createOriginator("Teste", "description")
      .accounts({
        originator: originatorKeypair.publicKey,
        payer: keypair.publicKey,
        owner: keypair.publicKey,
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
