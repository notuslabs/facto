"use client";

import { CryptoCurrency04 } from "@/components/illustrations/crypto-currency-04";
import { ChoiceCard } from "./choice-card";
import { useAuth } from "@/hooks/use-auth";
import { BorrowerTexture } from "@/components/illustrations/borrower-texture";

export function BorrowerChoiceCard() {
  const { login, isPending } = useAuth();

  return (
    <button disabled={isPending} onClick={() => login({ asBorrower: true })}>
      <ChoiceCard
        title="Sou Originador"
        titleClassName="bg-gradient-to-r from-[#717270] to-[#D6D8D5] inline-block text-transparent bg-clip-text"
        description="E quero pegar dinheiro emprestado"
        icon={<CryptoCurrency04 />}
        className="border-subtle bg-subtle"
      >
        <BorrowerTexture className="absolute right-0 top-0" />
      </ChoiceCard>
    </button>
  );
}
