import { RequireAuthProvider } from "@/providers/require-auth-provider";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <RequireAuthProvider>{children}</RequireAuthProvider>;
}
