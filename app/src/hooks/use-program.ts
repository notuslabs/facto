import idl from "@/lib/idl/idl-json.json";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "./use-session";
import { PublicKey, Keypair } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Hackathon, IDL } from "@/lib/idl";
import { useConnection } from "./use-connection";

export function useProgram2() {
  const { connection } = useConnection();
  const { data } = useSession();

  const solanaWallet = data?.solanaWallet;

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["program", solanaWallet?.provider.chainId.toString()],
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

      if (!privateKey) return;

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

      program = new Program<Hackathon>(IDL, new PublicKey(idl.metadata.address), provider);

      return {
        program,
        keypair,
      };
    },
  });
}
