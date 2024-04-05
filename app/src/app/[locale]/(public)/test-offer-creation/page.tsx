"use client";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useCreateInvestor } from "@/hooks/use-create-investor";
import { useProgram } from "@/hooks/use-program";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { parseUnits } from "@/lib/parse-units";
import { createOffer } from "@/services/create-offer";
import { createBorrower } from "@/services/create-borrower";
import { Program, utils } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { mintTo, createMint } from "@solana/spl-token";

export default function TestOfferCreation() {
  const { data: programData } = useProgram();
  const { mutate: createInvestor } = useCreateInvestor();

  const keypair = programData?.keypair;
  const program = programData?.program;

  return (
    <div className="container">
      <h1 className="pb-1 text-3xl font-bold">Test Offer Creation</h1>
      <p>This page is a test for creating an offer</p>
      <Button
        className="block"
        onClick={async () => {
          const tx = await createBorrower({
            name: "Test",
            description: "Test",
            tokenSlug: "test",
            caller: keypair as Keypair,
            program: program as unknown as Program<Hackathon>,
          });
          console.log("originator", tx);

          const [investor] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("investor"), keypair?.publicKey.toBuffer() as Buffer],
            program?.programId as PublicKey,
          );

          const [investorTokenAccount] = PublicKey.findProgramAddressSync(
            [
              utils.bytes.utf8.encode("investor_stable_token_account"),
              investor.toBuffer() as Buffer,
            ],
            program?.programId as PublicKey,
          );

          await mintTo(
            program?.provider.connection as any,
            keypair as Keypair,
            new PublicKey(env.NEXT_PUBLIC_FAKE_MINT_ADDRESS),
            investorTokenAccount,
            keypair as Keypair,
            parseUnits(100).toNumber(),
          );
          console.log("mint done");

          const offer = await createOffer({
            description: "Test",
            deadlineDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            goalAmount: 100,
            startDate: new Date(Date.now() + 1000 * 60),
            minAmountInvest: 10,
            installmentsTotalAmount: 110,
            installmentsCount: 1,
            installmentsStartDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            program: program as unknown as Program<Hackathon>,
            caller: keypair as Keypair,
          });
          console.log("offer", offer);
        }}
      >
        cria tudo
      </Button>
      <Button
        className="block"
        onClick={async () => {
          const drop = await program?.provider.connection.requestAirdrop(
            keypair?.publicKey as PublicKey,
            9000000000,
          );
          await program?.provider.connection.confirmTransaction(drop as string, "finalized");
          console.log("airdrop done");

          const mint = await createMint(
            program?.provider.connection as any,
            keypair as Keypair,
            keypair?.publicKey as PublicKey,
            keypair?.publicKey as PublicKey,
            6,
            undefined,
            { commitment: "finalized" },
          );
          console.log("change your .env to ", mint.toString());
        }}
      >
        Create Mint
      </Button>
      <Button
        onClick={async () => {
          const tx = await createOffer({
            description: "Test",
            deadlineDate: new Date(Date.now() + 1000 * 60),
            goalAmount: 100,
            startDate: new Date(Date.now()),
            minAmountInvest: 10,
            installmentsTotalAmount: 110,
            installmentsCount: 12,
            installmentsStartDate: new Date(Date.now() + 1000 * 60 * 10),
            program: program as unknown as Program<Hackathon>,
            caller: keypair as Keypair,
          });
          console.log(tx);
        }}
      >
        Create Offer
      </Button>
    </div>
  );
}