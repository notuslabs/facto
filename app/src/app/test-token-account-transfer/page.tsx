"use client";

import {
  clusterApiUrl,
  TransactionSignature,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Cluster,
} from "@solana/web3.js";
import Big from "big.js";
import { useSession } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { SolanaWallet } from "@web3auth/solana-provider";
import {
  Account,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";

type TokenAccountOverviewProps = {
  title: string;
  address: PublicKey;
  amount: BigInt;
};

function TokenAccountOverview({ title, address, amount }: TokenAccountOverviewProps) {
  console.log("Stringified amount: ", amount.toString());
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

const FAKE_MINT = new PublicKey("HryooQB7FbyU97UGavoiA8DWMpk7j4JXETSvcfg6SeLP");

export default function TestTokenAccountTransfer() {
  const { solanaWallet } = useSession();
  const [loggedUserTokenAccount, setLoggedUserTokenAccount] = useState<Account | null>(null);
  const [fakeTokenAccount, setFakeTokenAccount] = useState<Account | null>(null);
  const [fakeAccountPublicKey, setFakeAccountPublicKey] = useState<PublicKey | null>(null);

  function createConnection(cluster: Cluster) {
    const connection = new Connection(clusterApiUrl(cluster), "confirmed");

    return connection;
  }

  async function airdropToWallet(connection: Connection, publicKey: PublicKey) {
    const fromAirdropSignature = (await connection.requestAirdrop(
      publicKey,
      LAMPORTS_PER_SOL,
    )) as TransactionSignature;

    await connection.confirmTransaction(fromAirdropSignature);
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

  async function fakeTokenTransfer() {
    if (!solanaWallet || !loggedUserTokenAccount || !fakeAccountPublicKey) return;

    const connection = createConnection("devnet");
    const privateKey = await getPrivateKey(solanaWallet);
    const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

    console.log("walletTokenAccount: ", loggedUserTokenAccount);

    let toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      loggedUserWallet,
      FAKE_MINT,
      fakeAccountPublicKey,
    );

    console.log("toTokenAccount: ", toTokenAccount);
    console.log("Minting Token to wallet");

    let signature = await mintTo(
      connection,
      loggedUserWallet,
      FAKE_MINT,
      loggedUserTokenAccount.address,
      loggedUserWallet.publicKey,
      1e9,
    );

    console.log("mint tx: ", signature);

    let tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      loggedUserWallet,
      FAKE_MINT,
      loggedUserWallet.publicKey,
    );

    console.log("wallet after mint: ", tokenAccount);
    console.log("Transfering Token from tokenAccount to toTokenAccount");

    signature = await transfer(
      connection,
      loggedUserWallet,
      loggedUserTokenAccount.address,
      toTokenAccount.address,
      loggedUserWallet.publicKey,
      50,
    );

    console.log("transfer tx: ", signature);

    tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      loggedUserWallet,
      FAKE_MINT,
      loggedUserWallet.publicKey,
    );
    toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      loggedUserWallet,
      FAKE_MINT,
      fakeAccountPublicKey,
    );
    console.log("tokenAccount after transfer: ", tokenAccount);
    console.log("toTokenAccount after transfer: ", toTokenAccount);

    setLoggedUserTokenAccount(tokenAccount);
    setFakeTokenAccount(toTokenAccount);
  }

  async function createFakeTokenAccount() {
    if (!solanaWallet) return;

    const connection = createConnection("devnet");
    const privateKey = await getPrivateKey(solanaWallet);
    const loggedUserWallet = getKeypairFromPrivateKey(privateKey);

    const toWallet = Keypair.generate();

    let toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      loggedUserWallet,
      FAKE_MINT,
      toWallet.publicKey,
    );

    setFakeAccountPublicKey(toWallet.publicKey);
    setFakeTokenAccount(toTokenAccount);
  }

  // Initialize Token Account
  useEffect(() => {
    (async () => {
      if (!solanaWallet) return;

      const connection = createConnection("devnet");
      const privateKey = await getPrivateKey(solanaWallet);
      const loggedUserWallet = getKeypairFromPrivateKey(privateKey);
      const pubKey = getKeypairFromPrivateKey(privateKey).publicKey;
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        loggedUserWallet,
        FAKE_MINT,
        pubKey,
      );

      console.log("tokenAccount: ", tokenAccount);
      console.log({
        retrieved: tokenAccount,
      });

      if (!tokenAccount) return;

      setLoggedUserTokenAccount(tokenAccount);
    })();
  }, [solanaWallet]);

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
        <Button onClick={fakeTokenTransfer}>Fake Token Transfer</Button>

        <Button
          onClick={async () => {
            if (!solanaWallet) return;

            const connection = createConnection("devnet");
            const privateKey = await getPrivateKey(solanaWallet);
            const wallet = getKeypairFromPrivateKey(privateKey);

            const mint = await createFakeMintToken(connection, wallet);
          }}
          disabled
        >
          Create Fake Mint Token
        </Button>

        <div className="flex flex-col items-start justify-start gap-2">
          {/* <Button>Create My Token Account</Button> */}
          <Button onClick={createFakeTokenAccount}>Create Fake Token Account To Transfer</Button>
        </div>
      </div>
    </div>
  );
}
