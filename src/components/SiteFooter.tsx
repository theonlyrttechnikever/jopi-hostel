"use client"

import { useEffect, useState } from "react"
import { Container } from "./Container"
import { NAV, PLACE } from "../lib/jopiData"

export function SiteFooter() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="border-t border-zinc-200 bg-white py-10">
      <Container>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-zinc-900">{PLACE.name}</p>
            <p className="mt-2 text-sm leading-7 text-zinc-700">{PLACE.address}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">Sekcje</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {NAV.map((it) => (
                <a
                  key={it.id}
                  href={`#${it.id}`}
                  className="text-zinc-700 hover:text-zinc-900"
                >
                  {it.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-900">Informacje</p>
            <p className="mt-2 text-sm leading-7 text-zinc-700">
              © {year || 2026} {PLACE.name}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
