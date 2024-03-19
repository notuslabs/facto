import { env } from "@/env";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
import { SolanaPrivKeyProviderConfig, SolanaPrivateKeyProvider } from "@web3auth/solana-provider";

export const config: SolanaPrivKeyProviderConfig = {
  chainConfig: {
    chainId: "0x3", // Please use 0x1 for Mainnet
    rpcTarget: env.NEXT_PUBLIC_RPC_URL,
    chainNamespace: CHAIN_NAMESPACES.SOLANA,
    displayName: "Solana Devnet",
    blockExplorerUrl: "https://explorer.solana.com",
    ticker: "SOL",
    tickerName: "Solana",
    logo: "https://images.toruswallet.io/sol.svg",
  },
};

export const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: config,
});

export const web3auth = new Web3Auth({
  clientId: env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: privateKeyProvider,
});
