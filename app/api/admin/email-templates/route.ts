import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all email templates from database
    const { data: templates, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      templates: templates || []
    });

  } catch (error) {
    console.error('Admin email templates API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json();

    const templatePayload = {
      name: templateData.name,
      subject: templateData.subject,
      content: templateData.content,
      type: templateData.type,
      variables: templateData.variables || [],
      is_active: templateData.isActive !== undefined ? templateData.isActive : true,
      updated_at: new Date().toISOString()
    };

    let result;
    if (templateData.id) {
      // Update existing template
      const { data, error } = await supabase
        .from('email_templates')
        .update(templatePayload)
        .eq('id', templateData.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new template
      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          ...templatePayload,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      template: result
    });

  } catch (error) {
    console.error('Admin email templates save error:', error);
    return NextResponse.json(
      { error: 'Failed to save email template' },
      { status: 500 }
    );
  }
}
