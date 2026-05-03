import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { templateId, testEmail } = await request.json();

    if (!templateId || !testEmail) {
      return NextResponse.json(
        { error: 'Template ID and test email are required' },
        { status: 400 }
      );
    }

    // Get the email template
    const { data: template, error: templateError } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError || !template) {
      return NextResponse.json(
        { error: 'Email template not found' },
        { status: 404 }
      );
    }

    // Get email settings from environment or database
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@highway420store.com';
    const fromName = process.env.FROM_NAME || 'Highway 420';

    if (!smtpUser || !smtpPassword) {
      return NextResponse.json(
        { error: 'SMTP credentials not configured' },
        { status: 500 }
      );
    }

    // Create sample data for template variables
    const sampleData: { [key: string]: string } = {
      customer_name: 'John Doe',
      order_number: 'ORD-12345',
      order_date: new Date().toLocaleDateString(),
      order_total: '$127.50',
      items: '<li>Premium Bong - $89.99</li><li>Cleaning Kit - $37.51</li>',
      shipping_address: '123 Main St, Los Angeles, CA 90210',
      tracking_number: '1Z999AA1234567890',
      carrier: 'UPS',
      estimated_delivery: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
      cart_items: '<li>Premium Bong - $89.99</li><li>Cleaning Kit - $37.51</li>',
      cart_total: '$127.50',
      discount_code: 'SAVE10',
      expiration_time: '24',
      verification_link: 'https://highway420store.com/verify?token=abc123',
      store_features: 'Premium products, fast shipping, expert support',
      special_offer: 'Get 10% off your next order with code WELCOME10',
      featured_products: '<li>Premium Glass Bong - $89.99</li><li>THCA Flower 1g - $45.00</li>',
      unsubscribe_link: 'https://highway420store.com/unsubscribe?email=' + testEmail
    };

    // Replace template variables
    let subject = template.subject;
    let content = template.content;

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      content = content.replace(regex, value);
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Send test email
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: testEmail,
      subject: subject,
      html: content
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Test email template sent successfully'
    });

  } catch (error) {
    console.error('Test email template error:', error);
    return NextResponse.json(
      { error: 'Failed to send test email template' },
      { status: 500 }
    );
  }
}
