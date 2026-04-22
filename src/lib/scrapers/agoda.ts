/**
 * Agoda Scraper
 * Fetches real ratings, stars, and price from Agoda's internal API
 */

// import type { BookingData } from './booking'

interface AgodaAmenity {
  isAvailable: boolean
  title: string
}

interface AgodaComment {
  reviewerInfo?: {
    displayMemberName?: string
  }
  formattedReviewDate?: string
  rating?: number
  reviewPositives?: string
  reviewComments?: string
  reviewNegatives?: string
  providerId?: number
}

export interface AgodaReview {
  author: string
  date: string
  score: number
  positive: string
  negative: string
  source: 'Agoda' | 'Booking.com'
}

export interface AgodaData {
  lastUpdated: string
  rating: {
    score: number
    reviews: number
  }
  stars: number
  price: {
    total: number
    tax: number
    currency: string
  }
  amenities: string[]
  reviews: AgodaReview[]
}

// const AGODA_CACHE_KEY = 'agoda_data_cache'
const AGODA_CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export async function fetchAgodaData(): Promise<AgodaData> {
  try {
    // Check cache first
    const cached = getCachedAgodaData()
    if (cached) {
      return cached
    }

    // Scrape from Agoda
    const agodaData = await scrapeAgoda()

    // Store in cache
    setCachedAgodaData(agodaData)

    return agodaData
  } catch (error) {
    console.error('Error fetching Agoda data:', error)
    // Return cached data or defaults
    return (
      getCachedAgodaData() || {
        lastUpdated: new Date().toISOString(),
        rating: {
          score: 8.0,
          reviews: 1543,
        },
        stars: 2,
        price: {
          total: 40.72,
          tax: 3.02,
          currency: 'USD',
        },
        amenities: ['Wi-Fi', 'Shared Kitchen', 'Shared Lounge'],
        reviews: [
          {
            author: 'Oliwia',
            date: '12 listopada 2024',
            score: 7.0,
            positive: 'Przemiłe wiadomości z osobą od PRu ;) jasna instrukcja za- i wymeldowania, obsługa bezosobowa, co bardzo sobie cenię.',
            negative: 'BRAK MIKROFALÓWKI!!! Cienkie ściany, dwoje chłopów rozmawiających w pokoju obok sprawiało wrażenie, jakby mieli otwarte drzwi.',
            source: 'Booking.com'
          },
          {
            author: 'Filip',
            date: '06 sierpnia 2025',
            score: 9.0,
            positive: 'Lokalizacja, cicho, spokojnie i blisko centrum oraz sklepu. Miły personel i pomocny.',
            negative: 'Mały pokój, ale byłem na 1 nocą i tylko spać, więc nie przeszkadzało to :)',
            source: 'Booking.com'
          }
        ],
      }
    )
  }
}

async function scrapeAgoda(): Promise<AgodaData> {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const checkInDate = tomorrow.toISOString().split('T')[0]
  
  const url = `https://www.agoda.com/api/cronos/property/BelowFoldParams/GetSecondaryData?countryId=182&finalPriceView=2&isShowMobileAppPrice=false&cid=1937390&adults=2&children=0&rooms=1&checkIn=${checkInDate}&currencyCode=PLN&hotel_id=269260&all=true`
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://www.agoda.com/pl-pl/jopi-hostel-katowice-centrum/hotel/all/katowice-pl.html',
    'X-Requested-With': 'XMLHttpRequest'
  }

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`Agoda API failed with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    const starRatingText = data.mapParams?.review?.starRating || 'star-2'
    const stars = parseInt(starRatingText.replace(/[^\d]/g, '')) || 2
    
    const agodaScore = data.reviews?.score ? parseFloat(data.reviews.score) : 8.3
    const agodaReviewsCount = data.reviews?.reviewsCount || 64
    
    const total = data.tealium?.totalPriceTaxInc || 0
    const tax = data.tealium?.tax || 0
    const currency = data.tealium?.currency || 'USD'

    const rawAmenities = data.roomTypes?.[0]?.rooms?.[0]?.amenities || []
    const amenities = rawAmenities
      .filter((a: AgodaAmenity) => a.isAvailable)
      .map((a: AgodaAmenity) => a.title)
      .slice(0, 8)

    let reviews: AgodaReview[] = []
    try {
      const reviewUrl = `https://www.agoda.com/api/cronos/property/review/ReviewComments`
      const reviewBody = {
        hotelId: 269260,
        providerId: 3038,
        demographicId: 0,
        pageNo: 1,
        pageSize: 10,
        sorting: 1,
        isReviewPage: false,
        isCrawlable: false,
        paginationSize: 5
      }
      
      const reviewResponse = await fetch(reviewUrl, {
        method: 'POST',
        headers: { 
          ...headers, 
          'Content-Type': 'application/json',
          'Origin': 'https://www.agoda.com',
        },
        body: JSON.stringify(reviewBody)
      })
      
      if (reviewResponse.ok) {
        const reviewData = await reviewResponse.json()
        if (reviewData.comments && Array.isArray(reviewData.comments)) {
          reviews = reviewData.comments.slice(0, 3).map((c: AgodaComment) => ({
            author: c.reviewerInfo?.displayMemberName || 'Anonim',
            date: c.formattedReviewDate || '',
            score: c.rating || 0,
            positive: c.reviewPositives || c.reviewComments || '',
            negative: c.reviewNegatives || '',
            source: c.providerId === 3038 ? 'Booking.com' : 'Agoda'
          }))
        }
      }
    } catch (e) {
      console.error('Error fetching Agoda reviews:', e)
    }

    if (reviews.length === 0) {
      reviews = [
        {
          author: 'Olosz',
          date: '15 czerwca 2025',
          score: 8.0,
          positive: 'Obsługa bardzo mila i sympatyczna. Pokój udostępniono nam z godzinnym wyprzedzeniem za co bardzo dziękujemy! Polecam!',
          negative: 'Nic',
          source: 'Booking.com'
        },
        {
          author: 'Oliwia',
          date: '12 listopada 2024',
          score: 7.0,
          positive: 'Przemiłe wiadomości z osobą od PRu ;) jasna instrukcja za- i wymeldowania, obsługa bezosobowa, co bardzo sobie cenię. Bardzo dobra lokalizacja, dużo miejsca w kuchni, dostępna kawa i herbata, na korytarzach światła automatyczne, w łazienkach dostępne mydło do rąk. Gdyby w przyszłym roku to też była najtańsza oferta to bym spokojnie wróciła. Było naprawdę okej!',
          negative: 'BRAK MIKROFALÓWKI!!! Nie sądziłam, że gdzieś może tego nie być 😅 Na wyjazdach kupuję obiadowe gotowce więc to dla mnie naprawdę ogromny minus. Cienkie ściany, dwoje chłopów rozmawiających w pokoju obok sprawiało wrażenie, jakby mieli otwarte drzwi, niesie się też korytarzami - to oczywiście piszę typowo informacyjnie.',
          source: 'Booking.com'
        },
        {
          author: 'Filip',
          date: '06 sierpnia 2025',
          score: 9.0,
          positive: '+ lokalizacja, cicho, spokojnie i blisko centrum oraz sklepu + miły personel i pomocny + poczucie bezpieczeństwa + czystość, było okej',
          negative: '- mały pokój, ale byłem na 1 nocą i tylko spać, więc nie przeszkadzało to :)',
          source: 'Booking.com'
        }
      ]
    }

    return {
      lastUpdated: new Date().toISOString(),
      rating: {
        score: agodaScore,
        reviews: agodaReviewsCount,
      },
      stars,
      price: {
        total,
        tax,
        currency,
      },
      amenities: amenities.length > 0 ? amenities : ['Free Wi-Fi', 'Shared Kitchen', 'Shared Lounge'],
      reviews: reviews,
    }
  } catch (error) {
    console.error('Agoda scraping error:', error)
    throw error
  }
}

// Simple in-memory cache for development
let cache: { data: AgodaData; timestamp: number } | null = null

function getCachedAgodaData(): AgodaData | null {
  if (cache && Date.now() - cache.timestamp < AGODA_CACHE_TTL) {
    return cache.data
  }
  return null
}

function setCachedAgodaData(data: AgodaData) {
  cache = { data, timestamp: Date.now() }
}
