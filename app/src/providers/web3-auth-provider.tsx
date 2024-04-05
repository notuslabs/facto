"use client";

import { useInitModal } from "@/hooks/use-init-modal";
import { PropsWithChildren } from "react";

export function Web3AuthProvider({ children }: PropsWithChildren) {
  useInitModal();
  return <>{children}</>;
}
