import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PAYMASTER_PRIVATE_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_RPC_URL: z.string().url(),
    NEXT_PUBLIC_FAKE_MINT_ADDRESS: z.string().length(44),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    PAYMASTER_PRIVATE_KEY: process.env.PAYMASTER_PRIVATE_KEY,
    NEXT_PUBLIC_FAKE_MINT_ADDRESS: process.env.NEXT_PUBLIC_FAKE_MINT_ADDRESS,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
  // },
});
