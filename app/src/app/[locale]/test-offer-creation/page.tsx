"use client";
import { Button } from "@/components/ui/button";
import { useProgram } from "@/hooks/use-program";
import { createOffer } from "@/services/create-offer";
import { createOriginator } from "@/services/create-originator";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import BN from "bn.js";

export default function TestOfferCreation() {
  const { keypair, program } = useProgram();

  return (
    <div className="container">
      <h1 className="pb-1 text-3xl font-bold">Test Offer Creation</h1>
      <p>This page is a test for creating an offer</p>
      <Button
        className="block"
        onClick={async () => {
          const tx = await createOriginator({
            name: "Test",
            description: "Test",
            tokenSlug: "test",
            caller: keypair as Keypair,
            program: program as unknown as Program,
          });

          console.log(tx);
        }}
      >
        Create Originator
      </Button>
      <Button
        onClick={async () => {
          const tx = await createOffer({
            description: "Test",
            deadlineDate: new Date(),
            goalAmount: new BN(100),
            startDate: new Date(),
            minAmountInvest: new BN(10),
            interestRatePercent: 1,
            installmentsTotal: 3,
            installmentsStartDate: new Date(),
            program: program as unknown as Program,
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
