import { fetchBookingData } from '@/lib/scrapers/booking'
import { fetchSilesiasCalendar } from '@/lib/scrapers/silesia'
import { fetchAgodaData } from '@/lib/scrapers/agoda'
import { fetchHostelworldData } from '@/lib/scrapers/hostelworld'
import { NextResponse } from 'next/server'

// Combined booking data endpoint
// GET /api/booking-data

export async function GET() {
  try {
    // Fetch all in parallel
    const [bookingData, calendarData, agodaData, hostelworldData] = await Promise.all([
      fetchBookingData(),
      fetchSilesiasCalendar(),
      fetchAgodaData(),
      fetchHostelworldData(),
    ])

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
