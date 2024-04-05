import { ReactNode } from "react";
import { Provider } from "jotai";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { TanStackQueryProvider } from "./tanstack-query-provider";
import { Web3AuthProvider } from "./web3-auth-provider";

type ProvidersProps = {
  children?: ReactNode | undefined;
  locale?: string | undefined;
  messages?: AbstractIntlMessages | undefined;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <Provider>
      <TanStackQueryProvider>
        <Web3AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Web3AuthProvider>
      </TanStackQueryProvider>
    </Provider>
  );
}
