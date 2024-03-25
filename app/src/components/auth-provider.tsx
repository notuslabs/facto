"use client";

import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { IProvider } from "@web3auth/base";
import { web3auth } from "@/lib/web3AuthService";
import { OpenloginUserInfo } from "@toruslabs/openlogin-utils";
import { SolanaWallet } from "@web3auth/solana-provider";
import { PublicKey } from "@solana/web3.js";

interface AuthContextValue {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getPublicKey: () => Promise<PublicKey | undefined>;
  solanaWallet: SolanaWallet | null;
  provider: IProvider | null;
  userInfo: Partial<OpenloginUserInfo> | undefined;
  address: PublicKey | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<OpenloginUserInfo>>();
  const [solanaWallet, setSolanaWallet] = useState<SolanaWallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState<PublicKey | null>(null);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
        // I don't know if this is the best way to this, but
        // I guess we don't need to instantiate the solana wallet
        // every time we want to execute an action, so I'm saving it
        // in a state variable.
        if (web3auth.provider) {
          const solanaWallet = new SolanaWallet(web3auth.provider);

          setSolanaWallet(solanaWallet);
          setAddress((await getPublicKey(solanaWallet)) ?? null);
        }

        if (web3auth.connected) {
          const userInfo_ = await getUserInfo();
          setUserInfo(userInfo_);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setUserInfo(await getUserInfo());
      setIsLoading(false);
    } catch (error) {
      setProvider(null);
      setUserInfo(undefined);
      setIsLoading(false);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();

    return user;
  };

  const getPublicKey = async (solanaWallet?: SolanaWallet | null) => {
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
        address,
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
