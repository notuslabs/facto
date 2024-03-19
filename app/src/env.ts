import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_RPC_URL: z.string().url(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  runtimeEnv: {
    NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
  // },
});
