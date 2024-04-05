import { Hackathon, IDL } from "@/lib/idl/facto-idl-types";
import idl from "@/lib/idl/idl-facto.json";
import { Keypair } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection } from "./use-connection";
import { useSession } from "./use-session";
import { useQuery } from "@tanstack/react-query";

export function useProgram() {
  const { connection } = useConnection();
  const { data } = useSession();

  const solanaWallet = data?.solanaWallet;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["program", !!solanaWallet],
    queryFn: async () => {
      if (!solanaWallet) return;
      let keypair = null;
      let program = null;

      let privateKey: string = "";
      try {
        privateKey = await solanaWallet.request<unknown, string>({
          method: "solanaPrivateKey",
        });
      } catch (err) {
        console.log({ err });
      }

      if (!privateKey) return null;

      keypair = Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));

      const provider = new AnchorProvider(
        connection,
        {
          publicKey: keypair.publicKey,
          signAllTransactions: async (...params) => {
            return solanaWallet.signAllTransactions(...params);
          },
          signTransaction: async (...params) => {
            return solanaWallet.signTransaction(...params);
          },
        },
        {},
      );

      program = new Program<Hackathon>(IDL, idl.metadata.address, provider);

      return {
        program,
        keypair,
      };
    },
    enabled: !!solanaWallet,
  });
}
