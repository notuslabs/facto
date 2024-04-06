"use client";

import { useInitModal } from "@/hooks/use-init-modal";
import { useQueryEvents } from "@/hooks/use-query-events";
import { PropsWithChildren, useEffect } from "react";

export function Web3AuthProvider({ children }: PropsWithChildren) {
  const initModalQuery = useInitModal();

  return <>{children}</>;
}
