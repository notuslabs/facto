"use client";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useCreateInvestor } from "@/hooks/use-create-investor";
import { useProgram } from "@/hooks/use-program";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { parseUnits } from "@/lib/parse-units";
import { createOffer } from "@/services/create-offer";
import { createBorrower } from "@/services/create-borrower";
import { RequireAuthProvider } from "@/providers/require-auth-provider";
import { Program, utils } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { mintTo, createMint, setAuthority } from "@solana/spl-token";
import { usePayOffer } from "@/hooks/use-pay-offer";
export default function TestOfferCreation() {
  return (
    <RequireAuthProvider>
      <TestOfferCreationTemplate />
    </RequireAuthProvider>
  );
}

function TestOfferCreationTemplate() {
  const { data: programData } = useProgram();
  const { mutateAsync: createInvestor } = useCreateInvestor();
  const { mutateAsync } = usePayOffer("hi");
  const keypair = programData?.keypair;
  const program = programData?.program;

  return (
    <div className="container">
      <h1 className="pb-1 text-3xl font-bold">Test Offer Creation</h1>
      <p>This page is a test for creating an offer</p>
      <Button
        className="block"
        onClick={async () => {
          if (!keypair) return null;

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
          const [tx] = await Promise.all([
            createBorrower({
              name: "Test",
              description: "Test",
              tokenSlug: "test",
              caller: keypair as Keypair,
              program: program as unknown as Program<Hackathon>,
            }).catch(console.error),
            createInvestor("teste").catch(console.error),
          ]);
          console.log("originator", tx);
          console.log("investor done");

          const [borrowerPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("borrower"), keypair?.publicKey.toBuffer() as Buffer],
            program?.programId as PublicKey,
          );

          const [borrowerTokenAccountPubKey] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("borrower_token_account"), borrowerPubKey.toBuffer()],
            program?.programId as PublicKey,
          );

          const [offer] = await Promise.all([
            createOffer({
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
            }).catch(console.error),
            mintTo(
              program?.provider.connection as any,
              keypair as Keypair,
              new PublicKey(env.NEXT_PUBLIC_FAKE_MINT_ADDRESS),
              investorTokenAccount,
              keypair as Keypair,
              parseUnits(1000).toNumber(),
            ).catch(console.error),
            mintTo(
              program?.provider.connection as any,
              keypair as Keypair,
              new PublicKey(env.NEXT_PUBLIC_FAKE_MINT_ADDRESS),
              borrowerTokenAccountPubKey,
              keypair as Keypair,
              parseUnits(1000).toNumber(),
            ).catch(console.error),
          ]);
          console.log("mint done");
          console.log("offer", offer);
          console.log("all done");
        }}
      >
        cria tudo
      </Button>
      <Button
        className="block"
        onClick={async () => {
          const drop = await program?.provider.connection
            .requestAirdrop(keypair?.publicKey as PublicKey, 9000000000)
            .catch(console.error);
          await program?.provider.connection.confirmTransaction(drop as string, "finalized");
          console.log("airdrop done");

          const mint = await createMint(
            program?.provider.connection as any,
            keypair as Keypair,
            new PublicKey("GqZw6aahVExoMggnnMap8esm6yWwm8dFebv4tZFTx9xz"),
            new PublicKey("GqZw6aahVExoMggnnMap8esm6yWwm8dFebv4tZFTx9xz"),
            6,
            undefined,
            { commitment: "finalized" },
          ).catch(console.error);
          console.log("change your .env to ", mint?.toString());
        }}
      >
        Create Mint
      </Button>
      <Button
        className="block"
        onClick={async () => {
          const tx = await createOffer({
            description: "Test",
            deadlineDate: new Date(Date.now() + 1000 * 200),
            goalAmount: 10,
            startDate: new Date(Date.now() + 1000 * 15),
            minAmountInvest: 1,
            installmentsTotalAmount: 100,
            installmentsCount: 10,
            installmentsStartDate: new Date(Date.now() + 1000 * 260),
            program: program as unknown as Program<Hackathon>,
            caller: keypair as Keypair,
          }).catch(console.error);

          console.log(tx);
        }}
      >
        Create Offer
      </Button>
      <Button
        onClick={async () => {
          /*await mutateAsync({
            offerId: "DW8ZS5hyQG6LN54c",
            amount: 123,
          });*/
        }}
      >
        Pay
      </Button>
    </div>
  );
}
