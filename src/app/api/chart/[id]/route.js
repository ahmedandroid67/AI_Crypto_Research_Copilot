// GET /api/chart/[id]?days=30
// Returns price chart data for the given token

import { NextResponse } from 'next/server';
import { getTokenChart } from '@/lib/api/coingecko';

export async function GET(request, { params }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30', 10);

  if (!id) {
    return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
  }

  try {
    const chartData = await getTokenChart(decodeURIComponent(id), days);
    return NextResponse.json({ chartData });
  } catch (err) {
    console.error('[/api/chart]', err.message);
    return NextResponse.json({ error: 'Failed to fetch chart data', chartData: [] }, { status: 500 });
  }
}
