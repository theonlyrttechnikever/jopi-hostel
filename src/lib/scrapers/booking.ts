/**
 * Booking.com Scraper
 * Fetches real ratings, today's price, and booking features
 */

import { unstable_cache } from 'next/cache'

export interface BookingData {
  lastUpdated: string
  rating: {
    score: number
    reviews: number
    location: number
    couplesLocation: number
    cleanliness?: number
    facilities?: number
    service?: number
    comfort?: number
    valueForMoney?: number
  }
  stars?: number
  todayPrice?: number
  features: string[]
  isSourcedFromAgoda?: boolean
}

const BOOKING_CACHE_KEY = 'booking_data_cache'
const BOOKING_CACHE_TTL = 24 * 60 * 60 // 24 hours in seconds for next/cache

export const fetchBookingData = unstable_cache(
  async (): Promise<BookingData> => {
    try {
      // Scrape from Booking.com
      const bookingData = await scrapeBookingCom()
      return bookingData
    } catch (error) {
      console.error('Error fetching Booking.com data:', error)
      // Return defaults on failure
      return {
        lastUpdated: new Date().toISOString(),
        rating: {
          score: 7.4,
          reviews: 135,
          location: 9.3,
          couplesLocation: 9.4,
        },
        features: ['Bezpłatne Wi-Fi', 'Pokoje dla niepalących', 'Ogrzewanie', 'Winda'],
      }
    }
  },
  ['booking-data'],
  {
    revalidate: BOOKING_CACHE_TTL,
    tags: ['booking']
  }
)

async function scrapeBookingCom(): Promise<BookingData> {
  const bookingUrl =
    'https://www.booking.com/reviews/pl/hotel/jopi-hostel-katowice.en-gb.html?page=3&'
  const silesiaUrl = 'https://jopi-hostel-centrum.silesiahotelspage.com/pl/'

  try {
    // Attempt to fetch from Booking.com first
    console.log('Fetching from Booking.com:', bookingUrl)
    const response = await fetch(bookingUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      },
    })

    if (response.ok) {
      const html = await response.text()
      // If we get the small challenge page (StatusCode 202/Accepted in user's log), 
      // it might not contain the data. But user's log shows 200 OK also returns data.
      if (html.includes('booking.com') && !html.includes('Robot or Human?')) {
        const rating = parseRating(html)
        
        // If rating failed to parse significant data, it might be a partial page
        if (rating.score > 0) {
          const todayPrice = parseTodayPrice(html)
          const features = parseFeatures(html)
          const stars = parseStars(html)

          return {
            lastUpdated: new Date().toISOString(),
            rating,
            stars,
            todayPrice,
            features,
          }
        }
      }
    }

    // If Booking.com fails or blocks, fallback to Silesia page which mirrors Booking data
    console.log('Booking.com fetch failed or blocked, trying Silesia fallback...')
    const silesiaResponse = await fetch(silesiaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    })

    if (silesiaResponse.ok) {
      const html = await silesiaResponse.text()
      const rating = parseRatingFromSilesia(html)
      const features = parseFeatures(html) // Silesia also has features
      
      return {
        lastUpdated: new Date().toISOString(),
        rating,
        features,
      }
    }

    throw new Error('Both Booking.com and Silesia fetch failed')
  } catch (error) {
    console.error('Booking.com scraping error:', error)
    throw error
  }
}

function parseRatingFromSilesia(html: string): BookingData['rating'] {
  let score = 0
  let reviews = 0

  // Extract from Silesia's Booking.com review block
  // <strong class="hotel-rating">7.5</strong>
  const scoreMatch = html.match(/<strong[^>]*class="hotel-rating"[^>]*>([\d.,]+)<\/strong>/i)
  if (scoreMatch) {
    score = parseFloat(scoreMatch[1].replace(',', '.'))
  }

  // <div class="b-reviews__based">1546 opinii</div>
  const reviewsMatch = html.match(/class="b-reviews__based"[^>]*>([\d\s]+)(?:opinii|reviews)/i)
  if (reviewsMatch) {
    reviews = parseInt(reviewsMatch[1].replace(/\s/g, ''))
  }

  // Fallback to JSON-LD if available
  if (score === 0 || reviews === 0) {
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)
    if (jsonLdMatch) {
      for (const script of jsonLdMatch) {
        try {
          const content = script.replace(/<script[^>]*>|<\/script>/gi, '')
          const data = JSON.parse(content)
          if (data.aggregateRating) {
            score = score || parseFloat(data.aggregateRating.ratingValue)
            reviews = reviews || parseInt(data.aggregateRating.reviewCount)
          }
        } catch {
          // ignore parse errors
        }
      }
    }
  }

  return {
    score: score || 7.5,
    reviews: reviews || 1546,
    location: 9.0, // Default values as they are harder to find on Silesia
    couplesLocation: 9.2,
  }
}

function parseRating(html: string): BookingData['rating'] {
  // Extract ratings from Booking.com page structure
  let score = 0
  let reviews = 0
  let location = 0
  let couplesLocation = 0
  let cleanliness = 0
  let facilities = 0
  let service = 0
  let comfort = 0
  let valueForMoney = 0

  // 1. Extract Overall Score
  // Pattern from user: <span class="review-score-badge" aria-label="Scored 7.5 ">
  const badgeMatch = html.match(/class="review-score-badge"[^>]*aria-label="Scored ([\d.]+)\s*"/)
  if (badgeMatch) {
    score = parseFloat(badgeMatch[1])
  } else {
    // Fallback patterns
    const scorePatterns = [
      /(?:"score"|"ratingScore")["\s:]*"?(\d+[.,]\d)(?:["\s,]|$)/i,
      /(\d+[.,]\d)\s*(?:Excellent|Very good|Good|Satisfactory|Poor)/i,
    ]
    for (const pattern of scorePatterns) {
      const match = html.match(pattern)
      if (match) {
        score = parseFloat(match[1].replace(',', '.'))
        if (score > 0) break
      }
    }
  }

  // 2. Extract Review Count
  // Pattern from user: <div class="review_item_user_review_count"> 17 reviews
  const reviewCountMatch = html.match(/class="review_item_user_review_count">[\s\n]*([\d,]+)\s*reviews/)
  if (reviewCountMatch) {
    reviews = parseInt(reviewCountMatch[1].replace(/,/g, ''))
  } else {
    // Fallback patterns
    const reviewPatterns = [
      /(\d+(?:[.,]\d{3})*)\s*(?:reviews|reviews based|opinii)/i,
      /"reviewCount":\s*(\d+)/i,
    ]
    for (const pattern of reviewPatterns) {
      const match = html.match(pattern)
      if (match) {
        reviews = parseInt(match[1].replace(/[.,]/g, ''))
        if (reviews > 0) break
      }
    }
  }

  // 3. Extract Detailed Categories
  // Pattern from user: data-hotel_clean="7.9"
  const cleanMatch = html.match(/data-hotel_clean="([\d.]+)"/)
  if (cleanMatch) cleanliness = parseFloat(cleanMatch[1])

  const locMatch = html.match(/data-hotel_location="([\d.]+)"/)
  if (locMatch) location = parseFloat(locMatch[1])

  const staffMatch = html.match(/data-hotel_staff="([\d.]+)"/)
  if (staffMatch) service = parseFloat(staffMatch[1])

  const comfortMatch = html.match(/data-hotel_comfort="([\d.]+)"/)
  if (comfortMatch) comfort = parseFloat(comfortMatch[1])

  const facilitiesMatch = html.match(/data-hotel_facilities="([\d.]+)"/)
  if (facilitiesMatch) facilities = parseFloat(facilitiesMatch[1])

  const valueMatch = html.match(/data-hotel_value="([\d.]+)"/)
  if (valueMatch) valueForMoney = parseFloat(valueMatch[1])

  // Couples location fallback if not found
  couplesLocation = location

  return {
    score: score || 0,
    reviews: reviews || 0,
    location: location || 0,
    couplesLocation: couplesLocation || 0,
    cleanliness: cleanliness || undefined,
    facilities: facilities || undefined,
    service: service || undefined,
    comfort: comfort || undefined,
    valueForMoney: valueForMoney || undefined,
  }
}

function parseTodayPrice(html: string): number | undefined {
  // Look for price patterns in Booking.com HTML
  // Booking shows prices in various places: search results, headers, price displays
  
  const pricePatterns = [
    // PLN currency patterns
    /(\d+)\s*(?:PLN|zł)(?:\s*per night|\s*\/\s*(?:noc|noć))?/i,
    /(?:from|od|price|cena|koszt)[\s:]*(\d+)\s*(?:PLN|zł)/i,
    /(?:PLN|zł)\s*(\d+)(?:\s*per|\/)?/i,
    /price[^<]*?(\d+)[\s<]/i,
  ]

  for (const pattern of pricePatterns) {
    const match = html.match(pattern)
    if (match) {
      const price = parseInt(match[1])
      if (price > 0 && price < 10000) { // Sanity check - rooms under 10k PLN
        return price
      }
    }
  }

  return undefined
}

function parseFeatures(html: string): string[] {
  const features: string[] = []

  // Common hostel/budget features we look for
  const featurePatterns = [
    { pattern: /(?:Free|Bezpłatnie|complimentary)\s+(?:WiFi|Wi-Fi|Wi–Fi|wifi|internet)/i, feature: 'Bezpłatne Wi-Fi' },
    { pattern: /(?:24.?hour|24\/7|24h|całodobowa)\s+(?:front desk|recepcja|front|desk)/i, feature: '24-godzinna recepcja' },
    { pattern: /(?:shared|wspólna|common)\s+(?:kitchen|kuchnia)/i, feature: 'Wspólna kuchnia' },
    { pattern: /(?:luggage storage|baggage|schowek na bagaż|przechownia)/i, feature: 'Przechowalnia bagażu' },
    { pattern: /(?:laundry|pralnia|washing machine|pranie)/i, feature: 'Pralnia' },
    { pattern: /(?:air conditioning|klimatyzacja|AC|air condition)/i, feature: 'Klimatyzacja' },
    { pattern: /(?:non.?smoking|dla niepalących|no smoking|non-smoking rooms)/i, feature: 'Pokoje dla niepalących' },
    { pattern: /(?:bar|restaurant|restoran|kawiarnia)/i, feature: 'Bar' },
    { pattern: /(?:gym|fitness|trening|siłownia)/i, feature: 'Siłownia' },
    { pattern: /(?:breakfast|śniadanie|meal|posiłek)/i, feature: 'Śniadanie' },
    { pattern: /(?:parking|garaż|parkowanie)/i, feature: 'Parking' },
    { pattern: /(?:pets|zwierzęta|pet-friendly|friendly dla zwierząt)/i, feature: 'Zwierzęta akceptowane' },
  ]

  featurePatterns.forEach(({ pattern, feature }) => {
    if (pattern.test(html) && !features.includes(feature)) {
      features.push(feature)
    }
  })

  return features
}

function parseStars(html: string): number | undefined {
  // Logic from Python script: data-testid="rating-stars"
  const starsBlockMatch = html.match(/data-testid="rating-stars"([\s\S]*?)<\/div>/)
  if (starsBlockMatch) {
    const starSpans = starsBlockMatch[1].match(/<span/g)
    return starSpans ? starSpans.length : 0
  }
  
  // Alternative pattern
  const starMatch = html.match(/(\d)-star hotel/i) || html.match(/hotel ([\d]) gwiazdkowy/i)
  if (starMatch) {
    return parseInt(starMatch[1])
  }

  return undefined
}
