import { PropsWithChildren } from "react";
import { AuthProvider } from "./auth-provider";
import { Provider } from "jotai";

export function Providers({ children }: PropsWithChildren) {
  return (
    <Provider>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
