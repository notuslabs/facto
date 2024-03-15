"use client";

import { PublicKey } from "@solana/web3.js";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { IProvider } from "@web3auth/base";
import { web3auth } from "@/lib/web3AuthService";
import { OpenloginUserInfo } from "@toruslabs/openlogin-utils";
import { SolanaWallet } from "@web3auth/solana-provider";

interface AuthContextValue {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getPublicKey: () => Promise<PublicKey | undefined>;
  solanaWallet: SolanaWallet | null;
  provider: IProvider | null;
  userInfo: Partial<OpenloginUserInfo> | undefined;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<OpenloginUserInfo>>();
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
        // I don't know if this is the best way to this, but
        // I guess we don't need to instantiate the solana wallet
        // every time we want to execute an action, so I'm saving it
        // in a state variable.
        if (web3auth.provider) {
          setSolanaWallet(new SolanaWallet(web3auth.provider));
        }

        if (web3auth.connected) {
          setUserInfo(await getUserInfo());
        }
      } catch (error) {
        console.error(error);
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const login = async () => {
    setIsLoading(true);
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    setUserInfo(await getUserInfo());
    setIsLoading(false);
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();

    return user;
  };

  const getPublicKey = async () => {
    if (!solanaWallet) {
      return;
    }

    const pubKey = await solanaWallet.requestAccounts();

    return new PublicKey(pubKey[0]);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setUserInfo(undefined);
  };

  // TODO: use solana
  // const signMessage = async () => {
  //   if (!provider) {
  //     return;
  //   }

  //   const web3 = new Web3(provider as any);

  //   // Get user's Ethereum public address
  //   const fromAddress = (await web3.eth.getAccounts())[0];

  //   const originalMessage = "YOUR_MESSAGE";

  //   // Sign the message
  //   const signedMessage = await web3.eth.personal.sign(
  //     originalMessage,
  //     fromAddress,
  //     "test password!", // configure your own password here.
  //   );
  // };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        isLoading,
        provider,
        solanaWallet,
        login,
        logout,
        getPublicKey,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useSession must be used within a AuthProvider");
  }

  return value;
}
