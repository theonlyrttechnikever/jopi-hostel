"use client"

import { useMemo } from "react"
import { Clock, LogOut, CreditCard, PawPrint, Car, Baby } from "lucide-react"
import { POLICIES } from "../lib/jopiData"

const ICON_MAP: Record<string, any> = {
  Zameldowanie: Clock,
  Wymeldowanie: LogOut,
  Płatności: CreditCard,
  Zwierzęta: PawPrint,
  Parking: Car,
  Dzieci: Baby,
}

export function Policies() {
  const items = useMemo(() => POLICIES, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => {
        const Icon = ICON_MAP[it.q] || Clock
        return (
          <div
            key={it.q}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-sm font-semibold text-zinc-900">{it.q}</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-600">{it.a}</p>
          </div>
        )
      })}
    </div>
  )
}
