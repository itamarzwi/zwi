import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Home, Languages } from "lucide-react";
import { ThemeToggle } from "#/components/theme-toggle.tsx";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/vocab", label: "Vocabulary", icon: Languages },
  { to: "/practice", label: "Practice", icon: GraduationCap },
] as const;

export const Route = createRootRoute({ component: RootLayout });

function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col pb-20 sm:pb-0">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-2">
          <span className="mr-4 font-bold">Deutsch lernen</span>
          {/* Desktop / tablet: links in the header */}
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent"
                activeProps={{ className: "bg-accent text-accent-foreground font-medium" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Phone: bottom tab bar, easy to reach with a thumb */}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t bg-card pb-[env(safe-area-inset-bottom)] sm:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-col items-center gap-0.5 py-2 text-xs text-muted-foreground"
            activeProps={{ className: "text-primary font-medium" }}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        ))}
      </nav>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 pt-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}
