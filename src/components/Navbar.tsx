"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/gallery", label: "Gallery" },
  { href: "/photographers", label: "Photographers" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    setOpen(false);
    router.push(`/gallery?${params.toString()}`);
  }

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-display text-xl tracking-wide text-bone">
          Aussie <span className="text-gold">Rail Photos</span>
        </Link>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="flex items-center gap-2 rounded-sm border border-ink-border px-3 py-2 text-sm text-bone-muted transition-colors hover:border-gold/50 hover:text-gold"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
            Menu
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-md border border-ink-border bg-ink-panel py-2 shadow-lg">
              <form onSubmit={handleSearch} className="px-3 pb-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search photos..."
                  className="input-field text-sm"
                />
              </form>

              <div className="mb-2 border-t border-ink-border" />

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-2 text-sm transition-colors hover:bg-ink-raised hover:text-gold ${
                    pathname?.startsWith(link.href) ? "text-gold" : "text-bone-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {status === "authenticated" && session.user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`block px-4 py-2 text-sm transition-colors hover:bg-ink-raised hover:text-gold ${
                    pathname?.startsWith("/admin") ? "text-gold" : "text-bone-muted"
                  }`}
                >
                  Admin
                </Link>
              )}

              <div className="my-2 border-t border-ink-border" />

              {status === "authenticated" ? (
                <>
                  <span className="block px-4 py-2 text-sm text-bone-muted">
                    {session.user?.name}
                  </span>
                  <Link
                    href="/upload"
                    className="block px-4 py-2 text-sm text-gold transition-colors hover:bg-ink-raised"
                  >
                    Upload
                  </Link>
                  <Link
                    href="/account"
                    className={`block px-4 py-2 text-sm transition-colors hover:bg-ink-raised hover:text-gold ${
                      pathname?.startsWith("/account") ? "text-gold" : "text-bone-muted"
                    }`}
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="block w-full px-4 py-2 text-left text-sm text-bone-muted transition-colors hover:bg-ink-raised hover:text-gold"
                  >
                    Log out
                  </button>
                </>
              ) : status === "loading" ? (
                <div className="h-16" />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-bone-muted transition-colors hover:bg-ink-raised hover:text-gold"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 text-sm text-gold transition-colors hover:bg-ink-raised"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
