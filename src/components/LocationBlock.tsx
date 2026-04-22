import { ExternalLink, MapPin, Coffee, Utensils, Star, Mountain, Train, Plane, Navigation } from "lucide-react"
import { PLACE } from "../lib/jopiData"

export function LocationBlock() {
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(PLACE.address)}&output=embed`
  const mapsLink = `https://www.google.com/maps?q=${encodeURIComponent(PLACE.address)}`

  const SurroundingSection = ({ title, icon: Icon, items }: { title: string, icon: any, items: readonly { name: string, distance: string }[] }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pb-1 border-b border-zinc-100">
        <Icon className="h-4 w-4 text-zinc-400" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{title}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between gap-4 group">
            <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{item.name}</span>
            <span className="text-[11px] font-medium text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded-full">{item.distance}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 shadow-lg shadow-zinc-200">
                <MapPin className="h-6 w-6 text-white" />
              </span>
              <div>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Adres</p>
                <p className="mt-1 text-lg font-black text-zinc-900">{PLACE.address}</p>
                <div className="mt-2 flex items-center gap-4">
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Otwórz w mapach <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {PLACE.phone && (
                    <a
                      href={`tel:${PLACE.phone.replace(/\s/g, '')}`}
                      className="text-sm font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
                    >
                      {PLACE.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                W pobliżu
              </p>
              <ul className="grid gap-3 text-sm text-zinc-700">
                {PLACE.nearby.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <Navigation className="mt-1 h-3 w-3 flex-none text-zinc-300" />
                    <span className="font-medium text-zinc-600">{it}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                Odległości
              </p>
              <ul className="grid gap-3 text-sm text-zinc-700">
                {PLACE.distances.map((it) => (
                  <li key={it} className="flex items-start gap-3">
                    <Navigation className="mt-1 h-3 w-3 flex-none text-zinc-300 rotate-45" />
                    <span className="font-medium text-zinc-600">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm h-[400px] lg:h-auto">
          <iframe
            title="Mapa"
            src={mapUrl}
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-zinc-50/50 p-8 shadow-inner">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-zinc-900 flex items-center gap-3">
            <span className="h-8 w-1.5 bg-zinc-900 rounded-full"></span>
            Otoczenie obiektu
          </h3>
          <p className="mt-2 text-sm text-zinc-500 font-medium">Poznaj okolicę Jopi Hostel — wszystko, czego potrzebujesz, jest w zasięgu ręki.</p>
        </div>

        {PLACE.surroundings.guestsEnjoyed && (
          <div className="mb-10 flex flex-wrap gap-4 items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Goście lubią tę okolicę ze względu na:</span>
            {PLACE.surroundings.guestsEnjoyed.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-800 shadow-sm">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                {item}
              </span>
            ))}
            <span className="text-sm font-medium text-zinc-500 italic ml-2">Gościom bardzo podoba się okolica obiektu!</span>
          </div>
        )}

        <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <SurroundingSection 
            title="Co znajduje się w pobliżu" 
            icon={MapPin} 
            items={PLACE.surroundings.whatsNearby} 
          />
          <SurroundingSection 
            title="Restauracje i kawiarnie" 
            icon={Utensils} 
            items={PLACE.surroundings.restaurants} 
          />
          <SurroundingSection 
            title="Najlepsze atrakcje" 
            icon={Star} 
            items={PLACE.surroundings.topAttractions} 
          />
          <SurroundingSection 
            title="Transport publiczny" 
            icon={Train} 
            items={PLACE.surroundings.transport} 
          />
          <SurroundingSection 
            title="Najbliższe lotniska" 
            icon={Plane} 
            items={PLACE.surroundings.airports} 
          />
          <SurroundingSection 
            title="Przyroda" 
            icon={Mountain} 
            items={PLACE.surroundings.naturalBeauty} 
          />
        </div>
      </div>
    </div>
  )
}
