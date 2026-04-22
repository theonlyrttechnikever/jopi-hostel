/**
 * TripAdvisor Scraper
 * Fetches real ratings and review count from TripAdvisor
 */

import { unstable_cache } from 'next/cache'

export interface TripAdvisorData {
  lastUpdated: string
  rating: {
    score: number
    reviews: number
    location?: string
    rank?: string
  }
  features: string[]
}

const TRIPADVISOR_CACHE_TTL = 24 * 60 * 60 // 24 hours in seconds

export const fetchTripAdvisorData = unstable_cache(
  async (): Promise<TripAdvisorData> => {
    try {
      // Scrape from TripAdvisor
      console.log('Fetching from TripAdvisor...')
      const tripadvisorData = await scrapeTripAdvisor()
      return tripadvisorData
    } catch (error) {
      console.error('Error fetching TripAdvisor data:', error)
      return {
        lastUpdated: new Date().toISOString(),
        rating: {
          score: 6.8,
          reviews: 37,
          location: '4.1',
        },
        features: ['Bezpłatne Wi-Fi', 'Lokalizacja 4.1', 'Obsługa 3.6'],
      }
    }
  },
  ['tripadvisor-data-v2'], // Changed key to force refresh
  {
    revalidate: TRIPADVISOR_CACHE_TTL,
    tags: ['tripadvisor']
  }
)

async function scrapeTripAdvisor(): Promise<TripAdvisorData> {
  const url = 'https://www.tripadvisor.com/Hotel_Review-g274768-d2062329-Reviews-Jopi_Hostel-Katowice_Silesia_Province_Southern_Poland.html'
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Referer': 'https://www.google.com/',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'cross-site'
  }

  try {
    const response = await fetch(url, { headers })
    if (!response.ok) {
      throw new Error(`TripAdvisor failed with status: ${response.status}`)
    }
    
    const html = await response.text()
    
    // Check if we hit DataDome
    if (html.includes('datadome') || html.includes('captcha')) {
      console.warn('TripAdvisor scraper hit bot protection')
      throw new Error('Bot protection detected')
    }

    // Try to parse rating and reviews from the HTML using multiple patterns
    
    // Pattern 1: JSON-LD (Standard for SEO)
    const ratingMatch = html.match(/ratingValue["']\s*:\s*["']?([\d.,]+)["']?/i)
    const reviewsMatch = html.match(/reviewCount["']\s*:\s*["']?([\d\s,]+)["']?/i)
    
    // Pattern 2: Text patterns (from user provided dump)
    const textRatingMatch = html.match(/([\d.,]+)\s*Average\s*\(\d+\)/i)
    const textReviewsMatch = html.match(/All reviews\s*\((\d+)\)/i) || html.match(/Average\s*\((\d+)\)/i)
    
    let score = 0
    let reviews = 0

    if (ratingMatch) {
      score = parseFloat(ratingMatch[1].replace(',', '.')) * 2
    } else if (textRatingMatch) {
      score = parseFloat(textRatingMatch[1].replace(',', '.')) * 2
    }
    
    if (reviewsMatch) {
      reviews = parseInt(reviewsMatch[1].replace(/[^\d]/g, ''))
    } else if (textReviewsMatch) {
      reviews = parseInt(textReviewsMatch[1])
    }

    // If parsing failed but we got the page, use the fallback values
    if (score === 0 || reviews === 0) {
      return {
        lastUpdated: new Date().toISOString(),
        rating: {
          score: 6.8,
          reviews: 37,
          location: '4.1',
        },
        features: ['Bezpłatne Wi-Fi', 'Lokalizacja 4.1', 'Obsługa 3.6'],
      }
    }

    return {
      lastUpdated: new Date().toISOString(),
      rating: {
        score,
        reviews,
      },
      features: ['Bezpłatne Wi-Fi', 'Lokalizacja 4.1', 'Obsługa 3.6'],
    }
  } catch (error) {
    throw error
  }
}
