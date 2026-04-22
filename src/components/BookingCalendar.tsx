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
      // Set a hard timeout for the fetch itself
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      try {
        console.log("Calendar: Fetching data...")
        const response = await fetch("/api/booking-data", { signal: controller.signal })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          console.error(`Calendar: API error status: ${response.status}`)
          generateFallbackData()
          return
        }
        
        const data = await response.json()
        console.log("Calendar: Data received", { 
          success: data.success, 
          hasCalendar: !!data.calendar?.calendar,
          count: data.calendar?.calendar?.length 
        })

        if (data.success && data.calendar?.calendar && data.calendar.calendar.length > 0) {
          setCalendar(data.calendar.calendar)
        } else {
          console.warn("Calendar: No data in response, using local fallback")
          generateFallbackData()
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.error("Calendar: Fetch aborted due to timeout")
        } else {
          console.error("Failed to load calendar:", error)
        }
        generateFallbackData()
      } finally {
        setLoading(false)
        clearTimeout(timeoutId)
      }
    }

    function generateFallbackData() {
      const fallback: CalendarDay[] = []
      const today = new Date()
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
         d.setDate(d.getDate() + i)
         const year = d.getFullYear()
         const month = String(d.getMonth() + 1).padStart(2, '0')
         const day = String(d.getDate()).padStart(2, '0')
         const dateStr = `${year}-${month}-${day}`
         const dayOfWeek = d.getDay()
         fallback.push({
           date: dateStr,
           available: true,
           pricePerNight: (dayOfWeek === 5 || dayOfWeek === 6) ? 147 : 118,
           occupancy: 'available'
         })
      }
      setCalendar(fallback)
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
  today.setHours(0, 0, 0, 0) // Normalize to start of day

  const next14Days: (CalendarDay | null)[] = []

  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    // YYYY-MM-DD format using local time
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`
    
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
