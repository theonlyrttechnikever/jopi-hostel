"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Menu, X } from "lucide-react"
import { Container } from "./Container"
import { NAV } from "../lib/jopiData"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const items = useMemo(() => NAV, [])

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/85 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="#"
            className="text-sm font-semibold tracking-tight text-zinc-900"
            onClick={() => setOpen(false)}
          >
            Jopi Hostel Katowice Centrum
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {items.map((it) => (
              <a
                key={it.id}
                href={`#${it.id}`}
                className={`text-sm ${
                  it.id === "kontakt"
                    ? "rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {it.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-50 md:hidden"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-zinc-200/70 bg-white md:hidden">
          <Container>
            <div className="flex flex-col gap-1 py-3">
              {items.map((it) => (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    it.id === "kontakt"
                      ? "mt-2 bg-zinc-900 font-medium text-white"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {it.label}
                </a>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
