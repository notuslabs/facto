"use client";

import { Connection, Keypair, PublicKey, Cluster } from "@solana/web3.js";
import Big from "big.js";
import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SolanaWallet } from "@web3auth/solana-provider";
import {
  Account,
  createMint,
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { utils } from "@coral-xyz/anchor";
import { useProgram } from "@/hooks/use-program";
import { env } from "@/env";
import { BN } from "bn.js";

type TokenAccountOverviewProps = {
  title: string;
  address: PublicKey;
  amount: BigInt;
};

function TokenAccountOverview({ title, address, amount }: TokenAccountOverviewProps) {
  const parsedBalance = Big(amount.toString()).div(1e9).toString();

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

const FAKE_MINT = new PublicKey("4vJ8pofMGdE6GWTdgZp12UKpkc1w6RmrSyt6oEwGjBEK");

export default function TestTokenAccountTransfer() {
  const { solanaWallet, userInfo } = useSession();
  const { program } = useProgram();
  const [loggedUserTokenAccount, setLoggedUserTokenAccount] = useState<Account | null>(null);
  const [fakeTokenAccount, setFakeTokenAccount] = useState<Account | null>(null);

  function createConnection() {
    const connection = new Connection(env.NEXT_PUBLIC_RPC_URL, "confirmed");

    return connection;
  }

  function getKeypairFromPrivateKey(privateKey: string) {
    return Keypair.fromSecretKey(Buffer.from(privateKey, "hex"));
  }

  async function getPrivateKey(solanaWallet: SolanaWallet) {
    const privateKey = await solanaWallet.request<unknown, string>({
      method: "solanaPrivateKey",
      params: [],
    });

    return privateKey;
  }

  async function createFakeMintToken(connection: Connection, wallet: Keypair) {
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 9);

    return mint;
  }

  async function depositTokens() {
    if (!solanaWallet || !loggedUserTokenAccount || !program) return;

    const connection = createConnection();
    const privateKey = await getPrivateKey(solanaWallet);
    const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

    const [investorPubKey] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("investor"), loggedUserWallet.publicKey.toBuffer()],
      program.programId,
    );

    const [investorTokenAccount] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
      program.programId,
    );

    const tx = await program.methods
      .depositTokens(new BN(20e9))
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccount,
        owner: loggedUserWallet.publicKey,
        payer: loggedUserWallet.publicKey,
        mint: FAKE_MINT,
      })
      .rpc();

    const investorInfo = await getAccount(connection, investorTokenAccount);

    setLoggedUserTokenAccount(investorInfo);
  }

  async function createInvestorAccount() {
    if (!solanaWallet || !program) return;

    const connection = createConnection();
    const privateKey = await getPrivateKey(solanaWallet);
    const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

    const [investorPubKey] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("investor"), loggedUserWallet.publicKey.toBuffer()],
      program.programId,
    );

    const [investorTokenAccount] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
      program.programId,
    );

    await program.methods
      .createInvestor(userInfo?.name ?? userInfo?.email ?? loggedUserWallet.publicKey.toString())
      .accounts({
        investor: investorPubKey,
        investorTokenAccount: investorTokenAccount,
        payer: loggedUserWallet.publicKey,
        owner: loggedUserWallet.publicKey,
        mint: FAKE_MINT,
      })
      .signers([loggedUserWallet])
      .rpc();

    const investorInfo = await getAccount(connection, investorTokenAccount);

    setLoggedUserTokenAccount(investorInfo);
  }

  // Initialize Token Account
  useEffect(() => {
    (async () => {
      if (!solanaWallet || !program) return;

      const connection = createConnection();
      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

      const [investorPubKey] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor"), loggedUserWallet.publicKey.toBuffer()],
        program.programId,
      );

      const [investorTokenAccount] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("investor_token_account"), investorPubKey.toBuffer()],
        program.programId,
      );

      setLoggedUserTokenAccount(await getAccount(connection, investorTokenAccount));
    })();
  }, [solanaWallet, program]);

  return (
    <div className="container">
      <h1 className="pb-1 text-3xl font-bold">Test Token Account Transfer</h1>
      <p>This page is a test for transferring tokens from one token account to another.</p>

      {(loggedUserTokenAccount || fakeTokenAccount) && (
        <div className="flex flex-col items-start justify-start gap-4 pt-4">
          {loggedUserTokenAccount && (
            <TokenAccountOverview
              title="Current User Token Account"
              address={loggedUserTokenAccount.address}
              amount={loggedUserTokenAccount.amount}
            />
          )}

          {fakeTokenAccount && (
            <TokenAccountOverview
              title="Fake User Token Account"
              address={fakeTokenAccount.address}
              amount={fakeTokenAccount.amount}
            />
          )}
        </div>
      )}

      <div className="flex flex-col items-start justify-start gap-6 py-4">
        <div className="flex items-center justify-start gap-2">
          <Button onClick={createInvestorAccount} disabled={!!loggedUserTokenAccount}>
            I Want to be an investor
          </Button>

          <Button onClick={depositTokens} disabled={!loggedUserTokenAccount}>
            GIVE ME TOKENS
          </Button>
        </div>

        <Button
          onClick={async () => {
            if (!solanaWallet) return;
            const connection = createConnection();

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
