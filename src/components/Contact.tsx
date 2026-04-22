"use client"

import { useCallback, useState } from "react"
import { Copy, ExternalLink, Phone } from "lucide-react"
import { LINKS, PLACE } from "../lib/jopiData"

export function Contact() {
  const [copied, setCopied] = useState(false)

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(PLACE.address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }, [])

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">Kontakt i Adres</p>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Telefon</p>
            <a 
              href={`tel:${PLACE.phone.replace(/\s/g, '')}`}
              className="mt-1 flex items-center gap-2 text-lg font-black text-zinc-900 hover:text-blue-600 transition-colors"
            >
              <Phone className="h-5 w-5" />
              {PLACE.phone}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Adres</p>
            <p className="mt-1 text-sm leading-7 text-zinc-700">{PLACE.address}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            <Copy className="h-4 w-4" /> {copied ? "Skopiowano" : "Skopiuj adres"}
          </button>
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(PLACE.address)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Otwórz w mapach <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-zinc-900">Szybkie linki</p>
        <p className="mt-2 text-sm leading-7 text-zinc-700">
          Rezerwacje i aktualności są dostępne w zewnętrznych serwisach.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={LINKS.booking}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Booking
          </a>
          <a
            href={LINKS.facebook}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Facebook
          </a>
          <a
            href={LINKS.silesia}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Silesia
          </a>
        </div>
      </div>
    </div>
  )
}
