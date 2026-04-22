import type { ReactNode } from "react"
import { Shield, UtensilsCrossed, Wifi, WashingMachine } from "lucide-react"
import { AMENITIES } from "../lib/jopiData"

const ICONS: Record<string, ReactNode> = {
  "Najpopularniejsze": <Wifi className="h-4 w-4 text-zinc-700" />,
  "Przestrzenie wspólne": <UtensilsCrossed className="h-4 w-4 text-zinc-700" />,
  Usługi: <WashingMachine className="h-4 w-4 text-zinc-700" />,
  Bezpieczeństwo: <Shield className="h-4 w-4 text-zinc-700" />,
}

export function Amenities() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {AMENITIES.map((group) => (
        <div
          key={group.title}
          className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100">
              {ICONS[group.title] ?? <Wifi className="h-4 w-4 text-zinc-700" />}
            </span>
            <p className="text-sm font-semibold text-zinc-900">{group.title}</p>
          </div>

          <ul className="mt-4 grid gap-2 text-sm text-zinc-700">
            {group.items.map((it) => (
              <li key={it} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-zinc-300" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
