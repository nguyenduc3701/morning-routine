import { NextRequest, NextResponse } from 'next/server';
import { fetchHanoiWeather, getHanoiWeatherSummary } from '@/lib/weather';

/**
 * API Route để lấy thông tin thời tiết Hà Nội phục vụ cho Client theo locale
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    const summary = await getHanoiWeatherSummary(locale);
    const details = await fetchHanoiWeather(locale);
    return NextResponse.json({ summary, details });
  } catch (error) {
    console.error('Error fetching weather in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
