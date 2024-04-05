import { Hackathon, IDL } from "@/lib/idl/facto-idl-types";
import idl from "@/lib/idl/idl-facto.json";
import { Keypair } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { useConnection } from "./use-connection";
import { useQuery } from "@tanstack/react-query";
import { useSolanaWallet } from "./use-solana-wallet";

export function useProgram() {
  const { connection } = useConnection();
  const { data: solanaWallet } = useSolanaWallet();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["program", !!solanaWallet],
    queryFn: async () => {
      if (!solanaWallet) return;
      let keypair = null;
      let program = null;

      let privateKey = "";

      try {
        privateKey = await solanaWallet.request<unknown, string>({
          method: "solanaPrivateKey",
        });
      } catch {}

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
