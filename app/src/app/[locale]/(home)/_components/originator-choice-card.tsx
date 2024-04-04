"use client";

import { CryptoCurrency04 } from "@/components/illustrations/crypto-currency-04";
import { ChoiceCard } from "./choice-card";
import { useAuth } from "@/hooks/use-auth";
import { OriginatorTexture } from "@/components/illustrations/originator-texture";

export function OriginatorChoiceCard() {
  const { login, isPending } = useAuth();

  return (
    <button disabled={isPending} onClick={() => login({ asOriginator: true })}>
      <ChoiceCard
        title="Sou Originador"
        titleClassName="bg-gradient-to-r from-[#717270] to-[#D6D8D5] inline-block text-transparent bg-clip-text"
        description="E quero pegar dinheiro emprestado"
        icon={<CryptoCurrency04 />}
        className="border-subtle bg-subtle"
      >
        <OriginatorTexture className="absolute right-0 top-0" />
      </ChoiceCard>
    </button>
  );
}
