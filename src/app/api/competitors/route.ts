import { scrapeBookingSearch } from '@/lib/scrapers/bookingSearch'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const destination = searchParams.get('ss') || 'Katowice'
  
  // Default to tomorrow and day after if not provided
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)
  
  const checkin = searchParams.get('checkin') || tomorrow.toISOString().split('T')[0]
  const checkout = searchParams.get('checkout') || dayAfter.toISOString().split('T')[0]

  try {
    const competitors = await scrapeBookingSearch(destination, checkin, checkout)
    
    return NextResponse.json({
      success: true,
      competitors,
      destination,
      checkin,
      checkout,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Competitor API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch competitor data'
    }, { status: 500 })
  }
}
