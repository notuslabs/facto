"use client";

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { createMint } from "@solana/spl-token";
import { config } from "@/lib/web3AuthService";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useWithdrawal } from "@/hooks/use-withdrawal";
import { useTokenAccounts } from "@/hooks/use-token-accounts";
import { useCreateInvestorAccount } from "@/hooks/use-create-investor-account";
import { useDeposit } from "@/hooks/use-deposit";
import { getKeypairFromPrivateKey, getPrivateKey } from "@/lib/wallet-utils";
import { useSession } from "@/hooks/use-session";
import { DEFAULT_DECIMALS } from "@/lib/constants";
import { RequireAuthProvider } from "@/providers/require-auth-provider";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";

type TokenAccountOverviewProps = {
  title: string;
  address: PublicKey;
  amount: BigInt;
};

function TokenAccountOverview({ title, address, amount }: TokenAccountOverviewProps) {
  const parsedBalance = new BN(amount.toString()).div(new BN(1e9)).toString();

  return (
    <div className="rounded-lg border border-border p-4">
      <h2 className="pb-1 text-xl font-semibold">{title}</h2>
      <div className="flex flex-col items-start justify-start gap-2">
        <div className="flex items-center justify-start gap-2">
          <strong>Balance:</strong>
          <span>{parsedBalance} TOKENS</span>
        </div>
        <div className="flex items-center justify-start gap-2">
          <strong>Address:</strong>
          <span>{address.toString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function TestTokenAccountTransfer() {
  return (
    <RequireAuthProvider>
      <TestTokenAccountTransferTemplate />
    </RequireAuthProvider>
  );
}

function TestTokenAccountTransferTemplate() {
  const { data: solanaWallet } = useSolanaWallet();
  const withdrawRef = useRef<HTMLInputElement>(null);
  const { data } = useSession();
  const { mutate: deposit, isPending: isDepositing } = useDeposit();
  const { mutate: createInvestorAccount, isPending: isCreatingInvestorAccount } =
    useCreateInvestorAccount();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawal();
  const { data: tokenAccounts, isPending: isLoadingAccounts } = useTokenAccounts();

  async function createFakeMintToken(connection: Connection, wallet: Keypair) {
    const mint = await createMint(connection, wallet, wallet.publicKey, null, DEFAULT_DECIMALS);

    return mint;
  }

  async function withdrawAmount() {
    if (!tokenAccounts?.userTokenAccount) return;

    if (withdrawRef.current?.valueAsNumber)
      withdraw({
        amount: withdrawRef.current.valueAsNumber,
        toTokenAccount: tokenAccounts?.userTokenAccount.address,
      });
  }

  return (
    <div className="container">
      <h1 className="pb-1 text-3xl font-bold">Test Token Account Transfer</h1>
      <p>This page is a test for transferring tokens from one token account to another.</p>

      {(!!tokenAccounts?.investorTokenAccount || !!tokenAccounts?.userTokenAccount) && (
        <div className="flex flex-col items-start justify-start gap-4 pt-4">
          {!!tokenAccounts?.investorTokenAccount && (
            <>
              <div className="flex flex-col items-start justify-start gap-4">
                <TokenAccountOverview
                  title="Current User Token Account"
                  address={tokenAccounts?.investorTokenAccount.address}
                  amount={tokenAccounts?.investorTokenAccount.amount}
                />

                <div className="flex w-full gap-2">
                  <Input ref={withdrawRef} type="number" placeholder="Amount to Withdraw" />

                  <Button onClick={withdrawAmount} disabled={isWithdrawing}>
                    {isWithdrawing && <Loader2 size={16} className="animate-spin" />}
                    Withdraw
                  </Button>
                </div>
              </div>
            </>
          )}

          {!!tokenAccounts?.userTokenAccount && (
            <TokenAccountOverview
              title="Current User Token Account"
              address={tokenAccounts?.userTokenAccount.address}
              amount={tokenAccounts?.userTokenAccount.amount}
            />
          )}
        </div>
      )}

      <div className="flex flex-col items-start justify-start gap-6 py-4">
        <div className="flex items-center justify-start gap-2">
          <Button
            onClick={() => createInvestorAccount()}
            disabled={
              !!tokenAccounts?.investorTokenAccount ||
              isLoadingAccounts ||
              isCreatingInvestorAccount
            }
          >
            {(isCreatingInvestorAccount || isLoadingAccounts) && (
              <Loader2 size={16} className="animate-spin" />
            )}

            {isLoadingAccounts
              ? "Loading..."
              : isCreatingInvestorAccount
                ? "Creating Investor Account"
                : "I Want to be an investor"}
          </Button>

          <Button
            onClick={() => deposit({ amount: 100, variant: "investor" })}
            disabled={!tokenAccounts?.investorTokenAccount || isDepositing}
          >
            {(isDepositing || isLoadingAccounts) && <Loader2 size={16} className="animate-spin" />}
            GIVE ME TOKENS
          </Button>
        </div>

        <Button
          onClick={async () => {
            if (!solanaWallet) return;
            const connection = new Connection(config.chainConfig.rpcTarget, "confirmed");

            const privateKey = await getPrivateKey(solanaWallet);
            const wallet = getKeypairFromPrivateKey(privateKey);

            const mint = await createFakeMintToken(connection, wallet);

            console.log("Mint: ", mint.toString());
          }}
        >
          Create Fake Mint Token
        </Button>
      </div>
    </div>
  );
}
