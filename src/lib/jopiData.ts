export type NavItem = { id: string; label: string }

export const NAV: NavItem[] = [
  { id: "oferta", label: "Oferta" },
  { id: "pokoje", label: "Pokoje" },
  { id: "udogodnienia", label: "Udogodnienia" },
  { id: "lokalizacja", label: "Lokalizacja" },
  { id: "zasady", label: "Zasady" },
  { id: "galeria", label: "Galeria" },
  { id: "booking", label: "Opinie" },
  { id: "kontakt", label: "Kontakt" },
]

export const LINKS = {
  booking:
    "https://www.booking.com/hotel/pl/jopi-hostel-katowice.pl.html?force_referer=https%3A%2F%2Fwww.google.com%2F",
  facebook: "https://www.facebook.com/jopi.hostel/?locale=pl_PL",
  silesia: "https://jopi-hostel-centrum.silesiahotelspage.com/pl/",
  agoda: "https://www.agoda.com/pl-pl/jopi-hostel-katowice-centrum/hotel/all/katowice-pl.html",
  tripadvisor: "https://www.tripadvisor.com/Hotel_Review-g274768-d2062329-Reviews-Jopi_Hostel-Katowice_Silesia_Province_Southern_Poland.html",
} as const

export const PLACE = {
  name: "Jopi Hostel Katowice Centrum",
  address: "Plebiscytowa 23, 40-063 Katowice, Polska",
  checkIn: "15:00–00:00",
  checkOut: "do 11:00",
  nearby: [
    "Dworzec PKP Katowice — ok. 700 m pieszo",
    "Uniwersytet Śląski",
    "Spodek",
  ],
  distances: [
    "Silesia City Center — do 3 km",
    "FairExpo Convention Center — ok. 6,5 km",
    "Lotnisko Katowice-Pyrzowice — ok. 36 km",
  ],
} as const

export type Room = {
  name: string
  guests: string
  beds: string
  images: { src: string; alt: string }[]
  priceRange?: string
}

export const ROOMS: Room[] = [
  {
    "name": "Pokój Czteroosobowy ze wspólną łazienką",
    "guests": "do 4 osób",
    "beds": "2 łóżka piętrowe",
    "priceRange": "od 163 PLN/noc",
    "images": [
      { "src": "/images/loz_poj_koed_wielos/image.png", "alt": "Pokój czteroosobowy" },
      { "src": "/images/loz_poj_koed_wielos/image2.png", "alt": "Pokój czteroosobowy — ujęcie 2" },
      { "src": "/images/loz_poj_koed_wielos/image3.png", "alt": "Pokój czteroosobowy — ujęcie 3" },
      { "src": "/images/loz_poj_koed_wielos/image4.png", "alt": "Pokój czteroosobowy — ujęcie 4" },
      { "src": "/images/loz_poj_koed_wielos/image5.png", "alt": "Pokój czteroosobowy — ujęcie 5" },
      { "src": "/images/loz_poj_koed_wielos/image6.png", "alt": "Pokój czteroosobowy — ujęcie 6" },
      { "src": "/images/loz_poj_koed_wielos/image7.png", "alt": "Pokój czteroosobowy — ujęcie 7" },
      { "src": "/images/loz_poj_koed_wielos/image8.png", "alt": "Pokój czteroosobowy — ujęcie 8" },
      { "src": "/images/loz_poj_koed_wielos/pokoj4osob-3.png", "alt": "Pokój czteroosobowy — ujęcie 9" }
    ]
  },
  {
    "name": "Pokój Trzyosobowy ze wspólną łazienką",
    "guests": "do 3 osób",
    "beds": "1 łóżko podwójne i 1 łóżko piętrowe",
    "priceRange": "od 147 PLN/noc",
    "images": [
      { "src": "/images/3os_wspol_laz/image.png", "alt": "Pokój trzyosobowy" },
      { "src": "/images/3os_wspol_laz/image2.png", "alt": "Pokój trzyosobowy — ujęcie 2" },
      { "src": "/images/3os_wspol_laz/image3.png", "alt": "Pokój trzyosobowy — ujęcie 3" },
      { "src": "/images/3os_wspol_laz/image4.png", "alt": "Pokój trzyosobowy — ujęcie 4" },
      { "src": "/images/3os_wspol_laz/image5.png", "alt": "Pokój trzyosobowy — ujęcie 5" }
    ]
  },
  {
    "name": "Łóżko pojedyncze w koedukacyjnym pokoju wieloosobowym",
    "guests": "1 osoba",
    "beds": "1 łóżko pojedyncze",
    "priceRange": "od 50 PLN/noc",
    "images": [
      { "src": "/images/loz_poj_koed_wielos/image.png", "alt": "Pokój koedukacyjny" },
      { "src": "/images/loz_poj_koed_wielos/image2.png", "alt": "Pokój koedukacyjny — ujęcie 2" },
      { "src": "/images/loz_poj_koed_wielos/image3.png", "alt": "Pokój koedukacyjny — ujęcie 3" },
      { "src": "/images/loz_poj_koed_wielos/image4.png", "alt": "Pokój koedukacyjny — ujęcie 4" },
      { "src": "/images/loz_poj_koed_wielos/image5.png", "alt": "Pokój koedukacyjny — ujęcie 5" },
      { "src": "/images/loz_poj_koed_wielos/image6.png", "alt": "Pokój koedukacyjny — ujęcie 6" },
      { "src": "/images/loz_poj_koed_wielos/image7.png", "alt": "Pokój koedukacyjny — ujęcie 7" },
      { "src": "/images/loz_poj_koed_wielos/image8.png", "alt": "Pokój koedukacyjny — ujęcie 8" },
      { "src": "/images/loz_poj_koed_wielos/pokoj4osob-3.png", "alt": "Pokój koedukacyjny — ujęcie 9" }
    ]
  },
  {
    "name": "Łóżko pojedyncze w pokoju wieloosobowym dla 4 osób",
    "guests": "1 osoba",
    "beds": "1 łóżko piętrowe",
    "priceRange": "od 54 PLN/noc",
    "images": [
      { "src": "/images/loz_poj_koed_wielos/image.png", "alt": "Pokój czteroosobowy" },
      { "src": "/images/loz_poj_koed_wielos/image2.png", "alt": "Pokój czteroosobowy — ujęcie 2" },
      { "src": "/images/loz_poj_koed_wielos/image3.png", "alt": "Pokój czteroosobowy — ujęcie 3" },
      { "src": "/images/loz_poj_koed_wielos/image4.png", "alt": "Pokój czteroosobowy — ujęcie 4" },
      { "src": "/images/loz_poj_koed_wielos/image5.png", "alt": "Pokój czteroosobowy — ujęcie 5" },
      { "src": "/images/loz_poj_koed_wielos/image6.png", "alt": "Pokój czteroosobowy — ujęcie 6" },
      { "src": "/images/loz_poj_koed_wielos/image7.png", "alt": "Pokój czteroosobowy — ujęcie 7" },
      { "src": "/images/loz_poj_koed_wielos/image8.png", "alt": "Pokój czteroosobowy — ujęcie 8" },
      { "src": "/images/loz_poj_koed_wielos/pokoj4osob-3.png", "alt": "Pokój czteroosobowy — ujęcie 9" }
    ]
  },
  {
    "name": "Pokój jednoosobowy typu Standard ze wspólną łazienką",
    "guests": "1 osoba",
    "beds": "1 łóżko pojedyncze",
    "priceRange": "od 100 PLN/noc",
    "images": [
      { "src": "/images/1os_standard/image.png", "alt": "Pokój jednoosobowy" },
      { "src": "/images/1os_standard/pokojjednoosob.png", "alt": "Pokój jednoosobowy — ujęcie 2" },
      { "src": "/images/1os_standard/pokojjednoosob2.png", "alt": "Pokój jednoosobowy — ujęcie 3" }
    ]
  }
]

export const AMENITIES = [
  {
    title: "Najpopularniejsze",
    items: [
      "Bezpłatne Wi‑Fi w całym obiekcie",
      "Pokoje rodzinne",
      "Pokoje dla niepalących",
      "Bardzo dobre śniadanie",
    ],
  },
  {
    title: "Przestrzenie wspólne",
    items: ["Wspólna kuchnia", "Wspólna część rekreacyjna / sala TV"],
  },
  {
    title: "Usługi",
    items: [
      "Codzienne sprzątanie",
      "Przechowalnia bagażu",
      "Zamykane szafki",
      "Ekspresowe zameldowanie / wymeldowanie",
      "Możliwe wystawienie faktury",
      "Pralnia (dodatkowa opłata)",
    ],
  },
  {
    title: "Bezpieczeństwo",
    items: [
      "Monitoring wokół obiektu i w częściach wspólnych",
      "Czujnik dymu i system alarmowy",
      "Gaśnice",
      "Całodobowa ochrona",
    ],
  },
]

export const POLICIES = [
  { q: "Zameldowanie", a: `Od ${PLACE.checkIn}.` },
  { q: "Wymeldowanie", a: `Wymeldowanie ${PLACE.checkOut}.` },
  {
    q: "Płatności",
    a: "Akceptowana gotówka. Przy zameldowaniu wymagany ważny dokument tożsamości; obiekt może prosić o informacje dot. przyjazdu.",
  },
  {
    q: "Zwierzęta",
    a: "Zwierzęta nie są akceptowane.",
  },
  {
    q: "Parking",
    a: "Parking nie jest dostępny.",
  },
  {
    q: "Dzieci",
    a: "Dzieci w każdym wieku są mile widziane. Łóżeczka dziecięce i dodatkowe łóżka nie są dostępne.",
  },
]

export const GALLERY: { src: string; alt: string }[] = [
  // Gallery Folder
  { src: "/images/gallery/outside-sign.png", alt: "Wejście / oznakowanie hostelu" },
  { src: "/images/gallery/wejscieodsrodka.png", alt: "Wejście od środka" },
  { src: "/images/gallery/korytarzbeztoreb.png", alt: "Korytarz" },
  { src: "/images/gallery/korytarzztorbami.png", alt: "Korytarz — ujęcie 2" },
  { src: "/images/gallery/lobby.png", alt: "Lobby" },
  { src: "/images/gallery/kuchniaistolowka.png", alt: "Kuchnia i stołówka" },
  { src: "/images/gallery/pralnia.png", alt: "Pralnia" },
  { src: "/images/gallery/lazienkajakas.png", alt: "Łazienka" },
  { src: "/images/gallery/kubkiilovejopi.png", alt: "Detal — kubki I LOVE JOPI" },
  { src: "/images/gallery/welcometoJOPIHostel.png", alt: "Welcome to JOPI Hostel" },
  { src: "/images/gallery/lazienka-malypokojjednoosb.png", alt: "Łazienka (wspólna)" },
  { src: "/images/gallery/lozkapietrowe-wpokojuwieloosobowymdla4osob.png", alt: "Łóżka piętrowe" },
  { src: "/images/gallery/stol.png", alt: "Wspólna przestrzeń — stół" },

  // 1-os Standard Folder
  { src: "/images/1os_standard/image.png", alt: "Pokój jednoosobowy Standard" },
  { src: "/images/1os_standard/pokojjednoosob.png", alt: "Pokój jednoosobowy Standard — ujęcie 2" },
  { src: "/images/1os_standard/pokojjednoosob2.png", alt: "Pokój jednoosobowy Standard — ujęcie 3" },

  // 3-os Wspólna Łazienka Folder
  { src: "/images/3os_wspol_laz/image.png", alt: "Pokój trzyosobowy" },
  { src: "/images/3os_wspol_laz/image2.png", alt: "Pokój trzyosobowy — ujęcie 2" },
  { src: "/images/3os_wspol_laz/image3.png", alt: "Pokój trzyosobowy — ujęcie 3" },
  { src: "/images/3os_wspol_laz/image4.png", alt: "Pokój trzyosobowy — ujęcie 4" },
  { src: "/images/3os_wspol_laz/image5.png", alt: "Pokój trzyosobowy — ujęcie 5" },

  // Łóżko pojedyncze koedukacyjne / wieloosobowe Folder
  { src: "/images/loz_poj_koed_wielos/image.png", alt: "Pokój wieloosobowy" },
  { src: "/images/loz_poj_koed_wielos/image2.png", alt: "Pokój wieloosobowy — ujęcie 2" },
  { src: "/images/loz_poj_koed_wielos/image3.png", alt: "Pokój wieloosobowy — ujęcie 3" },
  { src: "/images/loz_poj_koed_wielos/image4.png", alt: "Pokój wieloosobowy — ujęcie 4" },
  { src: "/images/loz_poj_koed_wielos/image5.png", alt: "Pokój wieloosobowy — ujęcie 5" },
  { src: "/images/loz_poj_koed_wielos/image6.png", alt: "Pokój wieloosobowy — ujęcie 6" },
  { src: "/images/loz_poj_koed_wielos/image7.png", alt: "Pokój wieloosobowy — ujęcie 7" },
  { src: "/images/loz_poj_koed_wielos/image8.png", alt: "Pokój wieloosobowy — ujęcie 8" },
  { src: "/images/loz_poj_koed_wielos/pokoj4osob-3.png", alt: "Pokój wieloosobowy — ujęcie 9" },
]


export const PRICE_NOTE = {
  title: "Ceny (kwiecień–maj 2026)",
  range: "50–163 PLN / noc",
  sourceLabel: "Źródło cen",
  sourceUrl: LINKS.booking,
}
