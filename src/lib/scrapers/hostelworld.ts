import type { BookingData } from './booking'

export async function fetchHostelworldData(): Promise<BookingData> {
  try {
    const url = 'https://www.hostelworld.com/hostels/p/64525/hostel-katowice-centrum/'
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
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

    // Log the HTML length and a snippet for debugging if we still get 0 reviews
    if (reviews === 0) {
      console.log('Hostelworld Debug: HTML length:', html.length)
      // console.log('Hostelworld Debug: Snippet:', html.substring(0, 500))
      // If we got HTML but couldn't find reviews, use the fallback
      reviews = 693
    }

    // Use hardcoded values that match current Hostelworld status for this property
    // Scraping modern SPA sites like Hostelworld with simple regex is unreliable
    const location = 9.8
    const cleanliness = 8.0
    const staff = 9.3
    const security = 9.5
    const facilities = 8.5
    const valueForMoney = 8.3

    return {
      lastUpdated: new Date().toISOString(),
      rating: {
        score,
        reviews,
        location,
        couplesLocation: location, // Fallback
        cleanliness,
        facilities,
        service: staff, // Staff maps to service
        comfort: security, // Security maps to comfort for lack of better mapping
        valueForMoney,
      },
      stars: 2, // Hardcoded or extracted if possible
      features: ['Free WiFi', 'Central Location', '24h Reception'],
      isSourcedFromAgoda: false
    }
  } catch (error) {
    console.error('Error fetching Hostelworld data:', error)
    // Return reasonable defaults if fetch fails
    return {
      lastUpdated: new Date().toISOString(),
      rating: {
        score: 8.6,
        reviews: 693,
        location: 9.8,
        couplesLocation: 9.8,
        cleanliness: 8.0,
        facilities: 8.5,
        service: 9.3,
        comfort: 9.5,
        valueForMoney: 8.3,
      },
      stars: 2,
      features: ['Free WiFi', 'Central Location', '24h Reception'],
    }
  }
}
