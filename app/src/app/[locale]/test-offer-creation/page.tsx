"use client";

import { useProgram } from "@/hooks/use-program";
import { PublicKey, type Keypair } from "@solana/web3.js";
import { utils, BN } from "@coral-xyz/anchor";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

export default function TestOfferCreation() {
  const { program, keypair } = useProgram();

  return (
    <div className="container">
      <h1 className="pb-1 text-3xl font-bold">Test Offer Creation</h1>
      <p>This page is a test for creating an offer</p>
      <Button
        className="block"
        onClick={async () => {
          const [originatorPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("originator"), keypair?.publicKey.toBuffer() as Buffer],
            program?.programId as PublicKey,
          );

          const tx = await program?.methods
            .createOriginator("Teste", "description", "teste")
            .accounts({
              originator: originatorPubKey,
              payer: keypair?.publicKey,
              owner: keypair?.publicKey,
            })
            .signers([keypair as Keypair])
            .rpc({ commitment: "processed" });

          console.log(tx);
        }}
      >
        Create Originator
      </Button>
      <Button
        onClick={async () => {
          const [originatorPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("originator"), keypair?.publicKey.toBuffer() as Buffer],
            program?.programId as PublicKey,
          );
          const offerId = nanoid(16);

          const [offerPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("offer"), utils.bytes.utf8.encode(offerId)],
            program?.programId as PublicKey,
          );

          const [tokenPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("offer_token"), offerPubKey.toBuffer()],
            program?.programId as PublicKey,
          );

          const [vaultPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("offer_vault"), offerPubKey.toBuffer()],
            program?.programId as PublicKey,
          );

          const tx = await program?.methods
            .createOffer(
              offerId,
              "description",
              100,
              new BN(new Date().getTime() + 1000 * 60 * 60 * 24 * 30),
              1.5,
              3,
            )
            .accounts({
              payer: keypair?.publicKey,
              caller: keypair?.publicKey,
              offer: offerPubKey,
              originator: originatorPubKey,
              stableToken: new PublicKey("9KgMXRaWHuZvSZhw2s7KgTQJntJGCnsHA1NfUTBzpJdU"),
              token: tokenPubKey,
              vault: vaultPubKey,
            })
            .signers([keypair as Keypair])
            .rpc();
          console.log(tx);
        }}
      >
        Create Offer
      </Button>
    </div>
  );
}
