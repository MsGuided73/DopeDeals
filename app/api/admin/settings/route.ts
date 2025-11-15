import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get all settings from database
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .order('category');

    if (error) throw error;

    // Organize settings by category
    const organizedSettings: any = {};

    settings?.forEach(setting => {
      if (!organizedSettings[setting.category]) {
        organizedSettings[setting.category] = {};
      }
      organizedSettings[setting.category][setting.key] = setting.value;
    });

    return NextResponse.json({
      business: organizedSettings.business || {},
      payment: organizedSettings.payment || {},
      shipping: organizedSettings.shipping || {},
      email: organizedSettings.email || {},
      marketing: organizedSettings.marketing || {},
      system: organizedSettings.system || {}
    });

  } catch (error) {
    console.error('Admin settings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const settingsData = await request.json();

    // Update settings in database
    const updates: Array<{
      category: string;
      key: string;
      value: string;
    }> = [];

    // Business settings
    if (settingsData.business) {
      Object.entries(settingsData.business).forEach(([key, value]) => {
        updates.push({
          category: 'business',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        });
      });
    }

    // Payment settings
    if (settingsData.payment) {
      Object.entries(settingsData.payment).forEach(([key, value]) => {
        updates.push({
          category: 'payment',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        });
      });
    }

    // Shipping settings
    if (settingsData.shipping) {
      Object.entries(settingsData.shipping).forEach(([key, value]) => {
        updates.push({
          category: 'shipping',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        });
      });
    }

    // Email settings
    if (settingsData.email) {
      Object.entries(settingsData.email).forEach(([key, value]) => {
        updates.push({
          category: 'email',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        });
      });
    }

    // Marketing settings
    if (settingsData.marketing) {
      Object.entries(settingsData.marketing).forEach(([key, value]) => {
        updates.push({
          category: 'marketing',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        });
      });
    }

    // System settings
    if (settingsData.system) {
      Object.entries(settingsData.system).forEach(([key, value]) => {
        updates.push({
          category: 'system',
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value)
        });
      });
    }

    // Upsert all settings
    for (const update of updates) {
      const { error } = await supabase
        .from('settings')
        .upsert({
          category: update.category,
          key: update.key,
          value: update.value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'category,key'
        });

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully'
    });

  } catch (error) {
    console.error('Admin settings save error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
