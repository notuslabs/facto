import { useEffect, useState } from "react";
import { Hackathon, IDL } from "@/lib/idl";
import idl from "@/lib/idl/idl-json.json";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import { useSession } from "@/components/auth-provider";
import { useConnection } from "./use-connection";

export function useProgram() {
  const { solanaWallet } = useSession();
  const { connection } = useConnection();
  const [program, setProgram] = useState<Program<Hackathon> | null>(null);
  const [keypair, setKeypair] = useState<Keypair | null>(null);

  useEffect(() => {
    const setupProgram = async () => {
      if (!solanaWallet) return;

      let privateKey: string = "";
      try {
        privateKey = await solanaWallet.request<unknown, string>({
          method: "solanaPrivateKey",
        });
      } catch (err) {
        console.log({ err });
      }

      const keyPair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
      setKeypair(keyPair);

      const provider = new AnchorProvider(
        connection,
        {
          publicKey: keyPair.publicKey,
          signAllTransactions: async (...params) => {
            return solanaWallet.signAllTransactions(...params);
          },
          signTransaction: async (...params) => {
            return solanaWallet.signTransaction(...params);
          },
        },
        {},
      );

      setProgram(new Program<Hackathon>(IDL, new PublicKey(idl.metadata.address), provider));
    };

    setupProgram();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solanaWallet]);

  return {
    program,
    keypair,
  };
}
