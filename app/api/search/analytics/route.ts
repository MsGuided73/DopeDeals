import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, resultCount, selectedResult, userAgent } = body;

    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Get client IP (for basic analytics, respecting privacy)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Hash IP for privacy
    const hashedIp = await hashString(ip);

    // Record search analytics
    const { error } = await supabase
      .from('search_analytics')
      .insert({
        query: query.toLowerCase().trim(),
        result_count: resultCount || 0,
        selected_result: selectedResult || null,
        user_agent: userAgent || null,
        hashed_ip: hashedIp,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Error recording search analytics:', error);
      return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Search analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const days = parseInt(searchParams.get('days') || '7');

    // Get popular searches from the last N days
    const { data: popularSearches, error } = await supabase
      .from('search_analytics')
      .select('query, count(*)')
      .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .group('query')
      .order('count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching search analytics:', error);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    return NextResponse.json({
      popularSearches: popularSearches || [],
      period: `${days} days`,
      limit
    });

  } catch (error) {
    console.error('Search analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Simple hash function for privacy
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}
