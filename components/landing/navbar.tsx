import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { Button } from "../ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
        >
          <img
            src="/logo.png"
            alt=""
            className="size-10 shrink-0 object-contain"
          />
          Lumen
        </Link>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:brightness-100"
              asChild
            >
              <Link href="/sign-in">Log in</Link>
            </Button>
            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/90"
              asChild
            >
              <Link href="/sign-up">Get started</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-white/90"
              asChild
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </Show>
        </div>
      </nav>
    </header>
  );
}
