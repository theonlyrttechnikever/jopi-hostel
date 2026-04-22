import { ExternalLink, MapPin } from "lucide-react"
import { PLACE } from "../lib/jopiData"

export function LocationBlock() {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(PLACE.address)}&output=embed`
  const mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(PLACE.address)}`

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
            <MapPin className="h-5 w-5 text-zinc-700" />
          </span>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Adres</p>
            <p className="mt-1 text-sm leading-7 text-zinc-700">{PLACE.address}</p>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 hover:text-zinc-700"
            >
              Otwórz w mapach <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-zinc-900">W pobliżu</p>
          <ul className="mt-2 grid gap-2 text-sm text-zinc-700">
            {PLACE.nearby.map((it) => (
              <li key={it} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-zinc-300" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-zinc-900">Orientacyjne odległości</p>
          <ul className="mt-2 grid gap-2 text-sm text-zinc-700">
            {PLACE.distances.map((it) => (
              <li key={it} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-zinc-300" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <iframe
          title="Mapa"
          src={mapUrl}
          className="h-[420px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
