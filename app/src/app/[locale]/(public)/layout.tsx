import MobileExtraNavbar from "@/components/mobile-extra-navbar";
import { Navbar } from "@/components/navbar";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
      <MobileExtraNavbar />
    </>
  );
}
