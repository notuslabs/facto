import { ReactNode } from "react";
import { Provider } from "jotai";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { TanStackQueryProvider } from "./tanstack-query-provider";

type ProvidersProps = {
  children?: ReactNode | undefined;
  locale?: string | undefined;
  messages?: AbstractIntlMessages | undefined;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <Provider>
      <TanStackQueryProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </TanStackQueryProvider>
    </Provider>
  );
}
