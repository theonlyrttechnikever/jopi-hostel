"use client"

import { useEffect, useState } from "react"
import type { CompetitorHotel } from "@/lib/scrapers/bookingSearch"

export function CompetitorPrices() {
  const [competitors, setCompetitors] = useState<CompetitorHotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCompetitors() {
      try {
        const response = await fetch("/api/competitors")
        const data = await response.json()
        if (data.success) {
          // Sort by price if available
          const sorted = data.competitors.sort((a: CompetitorHotel, b: CompetitorHotel) => {
            if (a.price === "N/A") return 1
            if (b.price === "N/A") return -1
            return (a.price as number) - (b.price as number)
          })
          setCompetitors(sorted.slice(0, 5)) // Top 5 cheapest
        }
      } catch (error) {
        console.error("Failed to load competitors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCompetitors()
  }, [])

  if (loading) {
    return (
      <div className="flex animate-pulse space-x-4">
        <div className="h-24 w-full rounded-xl bg-zinc-100"></div>
      </div>
    )
  }

  if (competitors.length === 0) {
    return null
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {competitors.map((hotel, idx) => (
        <div
          key={idx}
          className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:shadow-md"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-zinc-900 line-clamp-2">{hotel.name}</h4>
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-xs font-bold text-blue-600">{hotel.rating}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1">
              {hotel.stars !== "N/A" &&
                Array.from({ length: hotel.stars as number }).map((_, i) => (
                  <span key={i} className="text-[10px] text-yellow-500">
                    ★
                  </span>
                ))}
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">Cena za noc</p>
              <p className="text-lg font-black text-zinc-900">
                {hotel.price !== "N/A" ? `${hotel.price} PLN` : "Brak danych"}
              </p>
            </div>
            <a
              href={hotel.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
            >
              Szczegóły
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
