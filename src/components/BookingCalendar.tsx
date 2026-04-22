"use client"

import { useEffect, useState } from "react"
import type { CalendarDay } from "@/lib/scrapers/silesia"

interface BookingCalendarProps {
  className?: string
}

export function BookingCalendar({ className = "" }: BookingCalendarProps) {
  const [calendar, setCalendar] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function loadCalendar() {
      try {
        const response = await fetch("/api/booking-data")
        const data = await response.json()
        if (data.success && data.calendar?.calendar) {
          setCalendar(data.calendar.calendar)
        }
      } catch (error) {
        console.error("Failed to load calendar:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCalendar()
  }, [])

  if (!mounted || loading) {
    return <div className={`text-xs text-zinc-500 ${className}`}>Ładowanie...</div>
  }

  if (!calendar || calendar.length === 0) {
    return <div className={`text-xs text-zinc-700 ${className}`}>Brak danych</div>
  }

  // Get next 14 days starting from today
  const today = new Date()
  const next14Days: (CalendarDay | null)[] = []

  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    const dateStr = date.toISOString().split("T")[0]
    const dayData = calendar.find((d) => d.date === dateStr)
    next14Days.push(dayData || null)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-7 gap-2">
        {next14Days.map((dayData, idx) => {
          if (!dayData) return null

          const dayDate = new Date(dayData.date)
          const isToday = idx === 0
          const isAvailable = dayData.available
          const price = dayData.pricePerNight
          const dayName = new Intl.DateTimeFormat("pl-PL", { weekday: "short" }).format(dayDate)

          return (
            <div
              key={dayData.date}
              className={`flex flex-col items-center justify-center rounded-xl text-xs transition p-3 shadow-sm ${
                isToday
                  ? "bg-zinc-900 text-white font-bold ring-2 ring-zinc-900 ring-offset-2"
                  : isAvailable
                    ? "bg-white text-zinc-900 border border-zinc-200 hover:border-green-400 hover:shadow-md"
                    : "bg-zinc-50 text-zinc-400 border border-zinc-100 grayscale"
              }`}
              title={`${dayData.date}${price ? ` - ${price} PLN` : ""}`}
            >
              <span className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-zinc-600">
                {dayName}
              </span>
              <span className="text-lg font-black my-1">{dayDate.getDate()}</span>
              {price && isAvailable ? (
                <span className="text-[11px] font-bold text-green-600">{price} PLN</span>
              ) : (
                <span className="text-[10px] font-medium text-zinc-400">---</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
