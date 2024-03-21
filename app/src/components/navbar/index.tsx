import Link from "next/link";
import { NavbarSignInButton } from "./navbar-sign-in-button";
import { NavbarUserButton } from "./navbar-user-button";
import LocaleSwitcher from "../locale-switcher";

export function Navbar() {
  return (
    <nav className="h-[153px] w-full pt-8 dark:bg-background">
      <div className="container flex h-10 items-center justify-between gap-4">
        <Link href="/" className="flex items-center justify-start gap-2">
          <div className="h-10 w-10 bg-white" />
          Logo
        </Link>

        <div className="flex items-center justify-end gap-8">
          <LocaleSwitcher />

          <NavbarUserButton />
          <NavbarSignInButton />
        </div>
      </div>
    </nav>
  );
}
