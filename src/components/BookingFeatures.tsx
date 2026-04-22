"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import type { BookingData } from "@/lib/scrapers/booking"
import type { AgodaData } from "@/lib/scrapers/agoda"

interface BookingFeaturesProps {
  className?: string
}

export function BookingFeatures({ className = "" }: BookingFeaturesProps) {
  const [data, setData] = useState<{ booking: BookingData; agoda: AgodaData } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBookingData() {
      try {
        const response = await fetch("/api/booking-data")
        const result = await response.json()
        if (result.success) {
          setData({ booking: result.booking, agoda: result.agoda })
        }
      } catch (error) {
        console.error("Failed to load booking data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookingData()
  }, [])

  if (loading) {
    return (
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-100" />
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-100" />
        <div className="h-48 animate-pulse rounded-2xl bg-zinc-100" />
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { booking, agoda } = data

  if (!booking || !agoda) {
    return null
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid gap-6 md:grid-cols-2">
        {/* Live ratings from Booking.com */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="https://cdn6.agoda.net/images/default/b-com-logo.png" 
                alt="Booking.com" 
                width={100}
                height={20}
                className="h-4 w-auto object-contain"
              />
              <div className="flex items-center gap-0.5 ml-1">
                {booking?.stars &&
                  Array.from({ length: booking.stars }).map((_, i) => (
                    <span key={i} className="text-[10px] text-yellow-500">
                      ★
                    </span>
                  ))}
              </div>
              {booking.isSourcedFromAgoda && (
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter ml-1">
                  (via Agoda)
                </span>
              )}
            </div>
            <a
              href="https://www.booking.com/hotel/pl/jopi-hostel-katowice.pl.html"
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Zobacz profil
            </a>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-600">Ocena gości</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-zinc-900">{booking.rating?.score || 'N/A'}</p>
                <span className="text-xs font-bold text-zinc-400">/ 10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Lokalizacja</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">{booking.rating?.location || 'N/A'}</p>
              </div>
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Liczba opinii</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">{booking.rating?.reviews?.toLocaleString() || '0'}</p>
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              {[
                { label: "Czystość", value: booking.rating?.cleanliness },
                { label: "Obsługa", value: booking.rating?.service },
                { label: "Komfort", value: booking.rating?.comfort },
                { label: "Stosunek ceny", value: booking.rating?.valueForMoney },
                { label: "Udogodnienia", value: booking.rating?.facilities },
              ].map((item, i) => item.value && (
                <div key={i} className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-zinc-50/50 border border-zinc-100/50">
                  <span className="text-[10px] text-zinc-500 font-medium">{item.label}</span>
                  <span className="text-[11px] font-black text-zinc-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live ratings from Agoda */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image 
                src="https://cdn6.agoda.net/images/default/agoda-logo-review.png" 
                alt="Agoda" 
                width={100}
                height={20}
                className="h-4 w-auto object-contain"
              />
              <div className="flex items-center gap-0.5 ml-1">
                {agoda.stars &&
                  Array.from({ length: agoda.stars }).map((_, i) => (
                    <span key={i} className="text-[10px] text-yellow-500">
                      ★
                    </span>
                  ))}
              </div>
            </div>
            <a
              href="https://www.agoda.com/jopi-hostel/hotel/katowice-pl.html"
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Zobacz profil
            </a>
          </div>

          <div className="mt-6 grid gap-4">
            <div className="flex items-center justify-between rounded-xl bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-600">Ocena gości</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-black text-zinc-900">{agoda.rating.score}</p>
                <span className="text-xs font-bold text-zinc-400">/ 10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Waluta</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">{agoda.price.currency}</p>
              </div>
              <div className="rounded-xl border border-zinc-100 p-3">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Liczba opinii</p>
                <p className="mt-1 text-sm font-bold text-zinc-900">{agoda.rating.reviews.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Today's price from Booking */}
        {booking.todayPrice && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Cena Booking.com</p>
            <div className="mt-3 flex items-baseline gap-1">
              <p className="text-4xl font-black text-blue-900">{booking.todayPrice}</p>
              <p className="text-sm font-bold text-blue-700">PLN / noc</p>
            </div>
          </div>
        )}

        {/* Today's price from Agoda */}
        {agoda.price.total > 0 && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 shadow-sm">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Cena Agoda</p>
            <div className="mt-3 flex items-baseline gap-1">
              <p className="text-4xl font-black text-indigo-900">{agoda.price.total}</p>
              <p className="text-sm font-bold text-indigo-700">{agoda.price.currency} / noc</p>
            </div>
            <p className="mt-2 text-[10px] text-indigo-500">W tym podatek: {agoda.price.tax} {agoda.price.currency}</p>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <span className="h-8 w-1 bg-blue-600 rounded-full"></span>
            Najnowsze Opinie (via Booking.com)
          </h3>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            3 najnowsze opinie
          </span>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {agoda.reviews && agoda.reviews.map((review, idx) => (
            <div key={idx} className="flex flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
                    {review.author[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">{review.author}</p>
                    <p className="text-[9px] text-zinc-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700">
                  {review.score}
                </div>
              </div>

              <div className="space-y-2 flex-grow">
                {review.positive && (
                  <div className="flex gap-2">
                    <span className="text-green-500 font-bold text-sm">+</span>
                    <p className="text-[11px] leading-relaxed text-zinc-600 italic">&quot;{review.positive}&quot;</p>
                  </div>
                )}
                {review.negative && (
                  <div className="flex gap-2">
                    <span className="text-red-500 font-bold text-sm">−</span>
                    <p className="text-[11px] leading-relaxed text-zinc-400 italic">&quot;{review.negative}&quot;</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-50">
                <div className="flex items-center gap-1.5">
                  <Image 
                    src={review.source === 'Booking.com' ? "https://cdn6.agoda.net/images/default/b-com-logo.png" : "https://cdn6.agoda.net/images/default/agoda-logo-review.png"} 
                    alt={review.source}
                    width={60}
                    height={12}
                    className="h-2 w-auto object-contain grayscale opacity-50"
                  />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                    {review.source}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-zinc-400 bg-zinc-50/50 py-4 rounded-xl border border-zinc-100/50">
        * Dane pobierane w czasie rzeczywistym z serwisów Booking.com oraz Agoda. 
        <br />
        <span className="font-bold">Agoda.com</span> jest oficjalnym dostawcą danych dla powyższych zestawień.
      </p>
    </div>
  )
}
