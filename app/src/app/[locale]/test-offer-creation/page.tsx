"use client";
import { Button } from "@/components/ui/button";
import { useProgram } from "@/hooks/use-program";
import { Hackathon } from "@/lib/idl/facto-idl-types";
import { createOffer } from "@/services/create-offer";
import { createOriginator } from "@/services/create-originator";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";

export default function TestOfferCreation() {
  const { data: programData } = useProgram();

  const keypair = programData?.keypair;
  const program = programData?.program;

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
            program: program as unknown as Program<Hackathon>,
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
          console.log(tx);
        }}
      >
        Create Offer
      </Button>
    </div>
  );
}
