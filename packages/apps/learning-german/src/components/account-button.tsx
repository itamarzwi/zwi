import { Link } from "@tanstack/react-router";
import { LogOut, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu.tsx";
import { useAccount } from "#/storage/account.tsx";

/** Same look as the theme toggle: a bordered circle with an icon (or the profile picture) inside. */
const circleClassName =
  "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-popover text-muted-foreground shadow-sm outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground";

/** Signed out: a link to /sign-in. Signed in: opens the account menu. */
export function AccountButton() {
  const account = useAccount();
  if (!account.enabled) return null;

  if (!account.user) {
    return (
      <Link to="/sign-in" aria-label="Sign in" title="Sign in" className={circleClassName}>
        <UserRound className="size-4" aria-hidden />
      </Link>
    );
  }

  const { photoURL } = account.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label="Account" title="Account" className={circleClassName}>
        {photoURL ? (
          <img src={photoURL} alt="" referrerPolicy="no-referrer" className="size-full object-cover" />
        ) : (
          <UserRound className="size-4" aria-hidden />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => account.signOut()}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
