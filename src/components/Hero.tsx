"use client"

import Image from "next/image"
import { MapPin, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { Container } from "./Container"
import { LINKS, PLACE, PRICE_NOTE } from "../lib/jopiData"
import type { BookingData } from "@/lib/scrapers/booking"

export function Hero() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null)

  useEffect(() => {
    async function loadRating() {
      try {
        const response = await fetch("/api/booking-data")
        const data = await response.json()
        if (data.success && data.booking) {
          setBookingData(data.booking)
        }
      } catch (error) {
        console.error("Failed to load booking data:", error)
      }
    }

    loadRating()
  }, [])

  // Use live rating if available, otherwise fall back to default
  const rating = bookingData?.rating || { score: "7.4", reviews: "1542" }
  return (
    <div className="bg-linear-to-b from-zinc-50 to-white py-14 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-wide text-zinc-500">Katowice • Centrum</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              {PLACE.name}
            </h1>
            {bookingData?.stars && (
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: bookingData.stars }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
              {rating.score && (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  Ocena {rating.score} ({rating.reviews} opinii)
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {PLACE.address}
              </span>
            </div>

            <p className="mt-5 max-w-prose text-base leading-7 text-zinc-700">
              Hostel położony w Katowicach, w pobliżu ważnych punktów miasta. Do dyspozycji Gości są
              wspólna kuchnia, przestrzeń wspólna oraz bezpłatne Wi‑Fi na terenie całego obiektu.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={LINKS.booking}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Zarezerwuj na Booking
              </a>
              <a
                href={LINKS.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Zobacz na Facebook
              </a>
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <p className="text-sm font-medium text-zinc-900">{PRICE_NOTE.title}</p>
                <p className="text-sm font-semibold text-zinc-900">{PRICE_NOTE.range}</p>
              </div>
              <a
                className="mt-2 inline-block text-xs text-zinc-500 hover:text-zinc-700"
                href={PRICE_NOTE.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                {PRICE_NOTE.sourceLabel}: {PRICE_NOTE.sourceUrl}
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <Image
                src="/images/gallery/welcometoJOPIHostel.png"
                alt="Welcome to JOPI Hostel"
                width={1400}
                height={900}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <Image
                  src="/images/gallery/lobby.png"
                  alt="Lobby"
                  width={800}
                  height={600}
                  className="h-40 w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                <Image
                  src="/images/gallery/kuchniaistolowka.png"
                  alt="Kuchnia i stołówka"
                  width={800}
                  height={600}
                  className="h-40 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
