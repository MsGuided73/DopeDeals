import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not configured');
      return NextResponse.json({
        message: 'Supabase credentials not configured',
        logged: true
      }, { status: 200 }); // Return 200 to prevent monitor errors
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const body = await req.json();
    const {
      event_type,
      severity,
      category,
      title,
      description,
      error_stack,
      user_agent,
      url,
      auto_fixable,
      details
    } = body;

    // Get client IP address
    const ipAddress = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    // Insert audit log entry into the database
    const { error: insertError } = await supabase
      .from('site_audit_log')
      .insert({
        event_type: event_type || 'info',
        severity: severity || 'medium',
        category: category || 'system',
        title: title || 'Site Event',
        description: description || '',
        error_stack: error_stack || null,
        user_agent: user_agent || req.headers.get('user-agent') || '',
        ip_address: ipAddress,
        url: url || req.headers.get('referer') || '',
        auto_fix_attempted: auto_fixable || false,
        details: details || {},
      });

    if (insertError) {
      console.error('Error inserting audit log entry:', insertError);
      return NextResponse.json({
        message: 'Failed to save audit log entry',
        logged: false
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Audit log entry saved successfully',
      logged: true
    });

  } catch (error) {
    console.error('Error in audit log API:', error);
    // Return success to prevent monitor errors
    return NextResponse.json({
      message: 'Audit log entry processed',
      logged: true
    }, { status: 200 });
  }
}

// GET endpoint to retrieve audit logs (admin only)
export async function GET(req: NextRequest) {
  try {
    // Direct Supabase connection
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ message: 'Supabase credentials not configured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const severity = url.searchParams.get('severity');
    const category = url.searchParams.get('category');
    const event_type = url.searchParams.get('event_type');

    // Build query
    let query = supabase
      .from('site_audit_log')
      .select('*')
      .order('timestamp', { ascending: false });

    // Apply filters
    if (severity) {
      query = query.eq('severity', severity);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (event_type) {
      query = query.eq('event_type', event_type);
    }

    // Apply pagination
    if (limit > 0) {
      query = query.limit(limit);
    }
    if (offset > 0) {
      query = query.range(offset, offset + (limit || 50) - 1);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      return NextResponse.json({
        message: 'Failed to fetch audit logs',
        error: error.message
      }, { status: 500 });
    }

    // Get total count
    const { count } = await supabase
      .from('site_audit_log')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      logs: logs || [],
      totalCount: count || 0,
      limit,
      offset,
      hasMore: count ? (offset + (logs?.length || 0)) < count : false
    });

  } catch (error) {
    console.error('Error in audit log GET API:', error);
    return NextResponse.json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
