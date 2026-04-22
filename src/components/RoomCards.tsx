"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { BedDouble, ChevronLeft, ChevronRight, Users, X } from "lucide-react"
import { ROOMS, type Room } from "../lib/jopiData"

function RoomDialog({
  room,
  onClose,
}: {
  room: Room
  onClose: () => void
}) {
  const [index, setIndex] = useState<number | null>(null)

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => {
      if (i === null) return i
      return (i - 1 + room.images.length) % room.images.length
    })
  }

  const next = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => {
      if (i === null) return i
      return (i + 1) % room.images.length
    })
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label={`Szczegóły: ${room.name}`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-900">{room.name}</h3>
              <div className="mt-1 flex items-center gap-4 text-sm text-zinc-500">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" /> {room.guests}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {room.beds}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
              aria-label="Zamknij"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {room.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group relative aspect-4/3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 transition hover:border-zinc-300"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100">
                    <div className="rounded-full bg-white/90 p-2 shadow-sm">
                      <ChevronRight className="h-5 w-5 text-zinc-900" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIndex(null)
          }}
        >
          <div className="relative h-full w-full max-w-6xl flex flex-col items-center justify-center">
            <div className="relative w-full flex-1">
              <Image
                src={room.images[index].src}
                alt={room.images[index].alt}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                priority
              />
            </div>

            <button
              type="button"
              className="absolute right-0 top-0 z-10 p-4 text-white hover:text-zinc-300"
              onClick={() => setIndex(null)}
            >
              <X className="h-8 w-8" />
            </button>

            <button
              type="button"
              className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-white hover:text-zinc-300"
              onClick={prev}
            >
              <ChevronLeft className="h-10 w-10" />
            </button>

            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-white hover:text-zinc-300"
              onClick={next}
            >
              <ChevronRight className="h-10 w-10" />
            </button>

            <div className="p-6 text-center text-white">
              <p className="text-lg font-medium">{room.images[index].alt}</p>
              <p className="mt-1 text-sm text-zinc-400">
                Zdjęcie {index + 1} z {room.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function RoomCards() {
  const rooms = useMemo(() => ROOMS, [])
  const [open, setOpen] = useState<Room | null>(null)

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <button
            key={room.name}
            type="button"
            onClick={() => setOpen(room)}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative">
              <Image
                src={room.images[0]?.src ?? "/images/gallery/outside-sign.png"}
                alt={room.images[0]?.alt ?? room.name}
                width={1000}
                height={700}
                className="h-44 w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/0 to-black/0" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-sm font-semibold text-white">{room.name}</p>
              </div>
            </div>

            <div className="p-4">
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-4 w-4" /> {room.guests}
                </span>
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-4 w-4" /> {room.beds}
                </span>
              </div>
              {room.priceRange && (
                <p className="mt-2 text-xs font-semibold text-emerald-600">{room.priceRange}</p>
              )}
              <p className="mt-3 text-sm font-medium text-zinc-900 group-hover:text-zinc-950">
                Zobacz zdjęcia i szczegóły
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Kliknij, aby otworzyć podgląd galerii dla tego typu pokoju.
              </p>
            </div>
          </button>
        ))}
      </div>

      {open ? <RoomDialog room={open} onClose={() => setOpen(null)} /> : null}
    </>
  )
}
