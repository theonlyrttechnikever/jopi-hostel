import { Amenities } from "../components/Amenities"
import { BookingCalendar } from "../components/BookingCalendar"
import { BookingFeatures } from "../components/BookingFeatures"
import { Contact } from "../components/Contact"
import { Gallery } from "../components/Gallery"
import { Hero } from "../components/Hero"
import { LocationBlock } from "../components/LocationBlock"
import { Policies } from "../components/Policies"
import { RoomCards } from "../components/RoomCards"
import { Section } from "../components/Section"
import { CompetitorPrices } from "../components/CompetitorPrices"
import { SiteFooter } from "../components/SiteFooter"
import { SiteHeader } from "../components/SiteHeader"
import { LINKS, PLACE } from "../lib/jopiData"

export default function Home() {
  return (
    <div className="min-h-full bg-white text-zinc-900">
      <a
        href="#oferta"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:shadow"
      >
        Przejdź do treści
      </a>

      <SiteHeader />
      <main>
        <Hero />

        <Section id="oferta" title="Oferta" eyebrow="Jopi Hostel">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm leading-7 text-zinc-700">
              {PLACE.name} znajduje się w Katowicach. Obiekt oferuje bezpłatne Wi‑Fi w całym obiekcie,
              wspólną kuchnię i wspólną część wypoczynkową. Pokoje posiadają pościel.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-xs font-semibold text-zinc-500">Zameldowanie</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">{PLACE.checkIn}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-xs font-semibold text-zinc-500">Wymeldowanie</p>
                <p className="mt-1 text-sm font-semibold text-zinc-900">{PLACE.checkOut}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={LINKS.booking}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Sprawdź dostępność
              </a>
              <a
                href={LINKS.silesia}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Silesia Hotels
              </a>
            </div>
          </div>
        </Section>

        <Section id="pokoje" title="Pokoje" eyebrow="Typy pokoi">
          <RoomCards />
        </Section>

        <Section id="udogodnienia" title="Udogodnienia" eyebrow="Na Twój pobyt">
          <Amenities />
        </Section>

        <Section id="lokalizacja" title="Lokalizacja" eyebrow="Dojazd i okolica">
          <LocationBlock />
        </Section>

        <Section id="zasady" title="Zasady" eyebrow="Ważne informacje">
          <Policies />
        </Section>

        <Section id="galeria" title="Galeria" eyebrow="Zdjęcia obiektu">
          <Gallery />
        </Section>

        <Section id="booking" title="Booking.com" eyebrow="Opinie i dostępność">
          <BookingFeatures />
        </Section>

        <Section id="rynek" title="Analiza Rynku" eyebrow="Inne obiekty w Katowicach">
          <CompetitorPrices />
        </Section>

        <Section id="kontakt" title="Kontakt" eyebrow="Napisz lub zarezerwuj">
          <Contact />
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
