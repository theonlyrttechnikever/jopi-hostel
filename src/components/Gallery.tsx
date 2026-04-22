"use client"

import Image from "next/image"
import { useCallback, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { GALLERY } from "../lib/jopiData"

export function Gallery() {
  const images = useMemo(() => GALLERY, [])
  const [showAll, setShowAll] = useState(false)
  const [index, setIndex] = useState<number | null>(null)

  const displayedImages = useMemo(() => (showAll ? images : images.slice(0, 4)), [images, showAll])

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(() => {
    setIndex((i) => {
      if (i === null) return i
      return (i - 1 + images.length) % images.length
    })
  }, [images.length])
  const next = useCallback(() => {
    setIndex((i) => {
      if (i === null) return i
      return (i + 1) % images.length
    })
  }, [images.length])

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {displayedImages.map((img) => {
          const actualIndex = images.indexOf(img)
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(actualIndex)}
              aria-label={`Otwórz ${img.alt} w pełnym widoku`}
              title={img.alt}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={900}
                height={650}
                className="h-48 w-full object-cover transition group-hover:scale-[1.02]"
              />
            </button>
          )
        })}
      </div>
      {images.length > 4 && !showAll && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Pokaż wszystkie zdjęcia ({images.length})
          </button>
        </div>
      )}
      {index !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Podgląd galerii"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="relative w-full max-w-5xl">
            <div className="overflow-hidden rounded-2xl bg-black">
              <Image
                src={images[index].src}
                alt={images[index].alt}
                width={2000}
                height={1400}
                className="max-h-[82vh] w-full object-contain"
                priority
              />
            </div>

            <button
              type="button"
              className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={close}
              aria-label="Zamknij"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={prev}
              aria-label="Poprzednie"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={next}
              aria-label="Następne"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="mt-3 text-center text-sm text-white/85">
              {images[index].alt} ({index + 1}/{images.length})
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
