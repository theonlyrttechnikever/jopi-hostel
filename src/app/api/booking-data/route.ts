import { fetchBookingData } from '@/lib/scrapers/booking'
import { fetchSilesiasCalendar } from '@/lib/scrapers/silesia'
import { fetchAgodaData } from '@/lib/scrapers/agoda'
import { fetchHostelworldData } from '@/lib/scrapers/hostelworld'
import { fetchTripAdvisorData } from '@/lib/scrapers/tripadvisor'
import { NextResponse } from 'next/server'

// Combined booking data endpoint
// GET /api/booking-data

export async function GET() {
  try {
    console.log('API: Fetching booking data...')
    
    // Helper to wrap scraper calls with individual error handling and timeout
    const safeFetch = async <T>(promise: Promise<T>, fallback: T, name: string): Promise<T> => {
      let timeoutId: NodeJS.Timeout;
      try {
        const timeoutPromise = new Promise<T>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error(`${name} timeout`)), 7000);
        });
        
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId!);
        return result;
      } catch (e) {
        if (timeoutId!) clearTimeout(timeoutId);
        console.error(`API: Error or timeout in ${name}:`, e);
        return fallback;
      }
    }

    // Fetch all with individual fallbacks and timeouts
    // This ensures that even if one hangs or fails, the others (and the overall request) succeed
    const [bookingData, calendarData, agodaData, hostelworldData, tripadvisorData] = await Promise.all([
      safeFetch(fetchBookingData(), {
        lastUpdated: new Date().toISOString(),
        rating: { score: 7.4, reviews: 135, location: 9.3, couplesLocation: 9.4 },
        features: ['Bezpłatne Wi-Fi', 'Pokoje dla niepalących', 'Ogrzewanie', 'Winda'],
      } as any, 'Booking'),
      safeFetch(fetchSilesiasCalendar(), { lastUpdated: new Date().toISOString(), calendar: [] }, 'Calendar'),
      safeFetch(fetchAgodaData(), {
        lastUpdated: new Date().toISOString(),
        rating: { score: 7.4, reviews: 0 },
        stars: 0,
        price: { total: 0, tax: 0, currency: 'PLN' },
        amenities: [],
        reviews: [],
      } as any, 'Agoda'),
      safeFetch(fetchHostelworldData(), {
        lastUpdated: new Date().toISOString(),
        rating: { score: 8.6, reviews: 693, location: 9.8, couplesLocation: 9.8 },
        features: ['Bezpieczeństwo 24/7', 'Centrum miasta'],
      } as any, 'Hostelworld'),
      safeFetch(fetchTripAdvisorData(), {
          lastUpdated: new Date().toISOString(),
          rating: { score: 6.8, reviews: 37, location: '4.1' },
          features: ['Bezpłatne Wi-Fi', 'Lokalizacja 4.1'],
        } as any, 'TripAdvisor'),
    ])

    console.log('API: Data fetched (some might be fallbacks)', {
      hasBooking: !!bookingData,
      hasCalendar: !!calendarData?.calendar?.length,
      calendarDays: calendarData?.calendar?.length,
      hasAgoda: !!agodaData,
      hasHostelworld: !!hostelworldData,
      hasTripAdvisor: !!tripadvisorData
    })

    // Logic to decide which data to show in the "Booking.com" UI section
    // If we have real Booking.com data that looks valid (not default/fallback), use it.
    // Otherwise, use Hostelworld as a high-quality backup.
    const isRealBooking = bookingData && bookingData.rating && bookingData.rating.score > 0 && !bookingData.isSourcedFromAgoda
    const finalBookingData = isRealBooking ? bookingData : (hostelworldData || bookingData)

    return NextResponse.json(
      {
        success: true,
        booking: finalBookingData,
        calendar: calendarData,
        agoda: agodaData,
        tripadvisor: tripadvisorData,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching booking data:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch booking data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
