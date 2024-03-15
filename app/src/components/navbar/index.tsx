import Link from "next/link";
import { NavbarSignInButton } from "./navbar-sign-in-button";

export function Navbar() {
  return (
    <nav className="w-full bg-zinc-800 pt-8">
      <div className="container flex h-10 items-center justify-between gap-4">
        <Link href="/" className="flex items-center justify-start gap-2">
          <div className="h-10 w-10 bg-white" />
          Logo
        </Link>

        <div className="flex items-center justify-end">
          <NavbarSignInButton />
        </div>
      </div>
    </nav>
  );
}
