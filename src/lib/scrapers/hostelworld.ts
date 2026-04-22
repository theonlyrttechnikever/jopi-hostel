import { unstable_cache } from 'next/cache'
import type { BookingData } from './booking'

export const fetchHostelworldData = unstable_cache(
  async (): Promise<BookingData> => {
    try {
      const url = 'https://www.hostelworld.com/hostels/p/64525/hostel-katowice-centrum/'
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })

      if (!response.ok) {
        throw new Error(`Hostelworld fetch failed: ${response.status}`)
      }

      const html = await response.text()
      
      // Extract rating score
      const scoreMatch = html.match(/class="score">([\d.]+)</) || html.match(/Reviews([\d.]+)/) || html.match(/rating-score[^>]*>([\d.]+)/)
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : 8.6

      // Extract review count
      const reviewsMatch = html.match(/\(([\d,]+)\)/) || html.match(/Reviews[\d.]+[^(]+\(([\d,]+)\)/) || html.match(/rating-count[^>]*>([\d,]+)/) || html.match(/"reviewCount":\s*(\d+)/) || html.match(/(\d+)\s*Reviews/i)
      let reviews = reviewsMatch ? parseInt(reviewsMatch[1].replace(',', '')) : 693

      if (reviews === 0) {
        reviews = 693
      }

      const location = 9.8
      
      return {
        lastUpdated: new Date().toISOString(),
        rating: {
          score,
          reviews,
          location,
          couplesLocation: location,
          cleanliness: 8.0,
          service: 9.3,
          facilities: 8.5,
          comfort: 8.2,
          valueForMoney: 8.3
        },
        features: ['Bezpieczeństwo 24/7', 'Pokoje wspólne i prywatne', 'Centrum miasta'],
      }
    } catch (error) {
      console.error('Error fetching Hostelworld data:', error)
      return {
        lastUpdated: new Date().toISOString(),
        rating: { score: 8.6, reviews: 693, location: 9.8, couplesLocation: 9.8 },
        features: ['Bezpieczeństwo 24/7', 'Centrum miasta'],
      }
    }
  },
  ['hostelworld-data'],
  {
    revalidate: 3600, // 1 hour
    tags: ['hostelworld']
  }
)
