import { PublicKey } from "@solana/web3.js";
import { getProgram } from "./get-program";
import { Investment } from "@/structs/Investment";

export type GetInvestorInvestmentsProps = {
  investorPubKey: PublicKey;
};

export async function getInvestorInvestments({ investorPubKey }: GetInvestorInvestmentsProps) {
  const program = getProgram();

  const investments = await program.account.investment.all([
    { memcmp: { offset: 8 + 32, bytes: investorPubKey.toBase58() } },
  ]);

  return Investment.fromRawCollection(investments);
}
