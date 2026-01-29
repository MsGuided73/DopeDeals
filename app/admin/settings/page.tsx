"use client";

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '../../lib/supabase-browser';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Mail,
  Shield,
  Bell,
  Users,
  Globe,
  Save,
  TestTube,
  Send,
  Eye,
  Edit,
  Trash2,
  Plus,
  Copy,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface BusinessSettings {
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  businessHours: string;
  taxRate: number;
  currency: string;
  timezone: string;
}

interface PaymentSettings {
  paymentGateway: string;
  testMode: boolean;
  acceptedCards: string[];
  minimumOrder: number;
  maximumOrder: number;
  allowGuestCheckout: boolean;
}

interface ShippingSettings {
  shipstationConnected: boolean;
  defaultCarrier: string;
  defaultService: string;
  freeShippingThreshold: number;
  handlingFee: number;
  insuranceThreshold: number;
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableTLS: boolean;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'order_confirmation' | 'shipping_update' | 'abandoned_cart' | 'welcome' | 'marketing';
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MarketingAutomation {
  abandonedCartEnabled: boolean;
  abandonedCartDelay: number; // hours
  welcomeEmailEnabled: boolean;
  newsletterSignupEnabled: boolean;
  promotionalEmailsEnabled: boolean;
}

const EMAIL_TEMPLATES = [
  {
    type: 'order_confirmation',
    name: 'Order Confirmation',
    subject: 'Your Highway 420 Order Confirmation - #{order_number}',
    variables: ['customer_name', 'order_number', 'order_date', 'order_total', 'items', 'shipping_address']
  },
  {
    type: 'shipping_update',
    name: 'Shipping Update',
    subject: 'Your Order Has Shipped! - #{order_number}',
    variables: ['customer_name', 'order_number', 'tracking_number', 'carrier', 'estimated_delivery']
  },
  {
    type: 'abandoned_cart',
    name: 'Abandoned Cart Recovery',
    subject: 'Complete Your Highway 420 Order - Exclusive Offer Inside!',
    variables: ['customer_name', 'cart_items', 'cart_total', 'discount_code', 'expiration_time']
  },
  {
    type: 'welcome',
    name: 'Welcome Email',
    subject: 'Welcome to Highway 420 - Your Premium Smoke Shop!',
    variables: ['customer_name', 'verification_link', 'store_features']
  },
  {
    type: 'marketing',
    name: 'Promotional Newsletter',
    subject: '🚀 Exclusive Deals at Highway 420!',
    variables: ['customer_name', 'featured_products', 'special_offer', 'unsubscribe_link']
  }
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    companyName: 'Highway 420',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    businessHours: 'Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-8PM',
    taxRate: 8.25,
    currency: 'USD',
    timezone: 'America/Los_Angeles'
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    paymentGateway: 'kajapay',
    testMode: true,
    acceptedCards: ['visa', 'mastercard', 'amex'],
    minimumOrder: 10,
    maximumOrder: 1000,
    allowGuestCheckout: true
  });

  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipstationConnected: false,
    defaultCarrier: 'fedex',
    defaultService: 'ground',
    freeShippingThreshold: 75,
    handlingFee: 2.99,
    insuranceThreshold: 100
  });

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: 'Highway 420',
    enableTLS: true
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const [marketingSettings, setMarketingSettings] = useState<MarketingAutomation>({
    abandonedCartEnabled: true,
    abandonedCartDelay: 24,
    welcomeEmailEnabled: true,
    newsletterSignupEnabled: true,
    promotionalEmailsEnabled: false
  });

  useEffect(() => {
    loadSettings();
    loadEmailTemplates();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      // Load settings from database (placeholder - implement actual loading)
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        // Apply loaded settings
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadEmailTemplates() {
    try {
      const response = await fetch('/api/admin/email-templates');
      if (response.ok) {
        const data = await response.json();
        setEmailTemplates(data.templates || []);
      } else {
        // Initialize with default templates if none exist
        const defaultTemplates: EmailTemplate[] = EMAIL_TEMPLATES.map(template => ({
          id: template.type,
          name: template.name,
          subject: template.subject,
          content: getDefaultTemplateContent(template.type),
          type: template.type as EmailTemplate['type'],
          variables: template.variables,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        setEmailTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error('Error loading email templates:', error);
    }
  }

  function getDefaultTemplateContent(type: string): string {
    const templates: { [key: string]: string } = {
      order_confirmation: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d97706;">Order Confirmation</h1>
          <p>Hi {{customer_name}},</p>
          <p>Thank you for your order! Here are the details:</p>

          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Order #{{order_number}}</h3>
            <p><strong>Date:</strong> {{order_date}}</p>
            <p><strong>Total:</strong> {{order_total}}</p>
          </div>

          <h3>Items Ordered:</h3>
          {{items}}

          <p><strong>Shipping Address:</strong><br>
          {{shipping_address}}</p>

          <p>We'll send you shipping updates as your order progresses.</p>

          <p>Questions? Contact us at support@highway420.com</p>

          <p>Happy smoking!<br>
          The Highway 420 Team</p>
        </div>
      `,
      shipping_update: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #059669;">Your Order Has Shipped!</h1>
          <p>Hi {{customer_name}},</p>
          <p>Great news! Your order #{{order_number}} has been shipped.</p>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Tracking Information</h3>
            <p><strong>Carrier:</strong> {{carrier}}</p>
            <p><strong>Tracking Number:</strong> {{tracking_number}}</p>
            <p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>
          </div>

          <p>You can track your package at the carrier's website using the tracking number above.</p>

          <p>Questions? Contact us at support@highway420.com</p>

          <p>The Highway 420 Team</p>
        </div>
      `,
      abandoned_cart: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #dc2626;">Don't Forget Your Cart!</h1>
          <p>Hi {{customer_name}},</p>
          <p>We noticed you left some items in your cart. Don't miss out!</p>

          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Saved Items:</h3>
            {{cart_items}}
            <p><strong>Total: {{cart_total}}</strong></p>
          </div>

          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>🎁 Special Offer!</h3>
            <p>Use code <strong>{{discount_code}}</strong> for 10% off your order.</p>
            <p>Offer expires in {{expiration_time}} hours.</p>
          </div>

          <a href="#" style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Complete Your Order Now
          </a>

          <p>The Highway 420 Team</p>
        </div>
      `,
      welcome: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7c3aed;">Welcome to Highway 420!</h1>
          <p>Hi {{customer_name}},</p>
          <p>Welcome to Highway 420, your premium destination for smoking accessories!</p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What makes us special:</h3>
            <ul>
              <li>Premium quality products</li>
              <li>Fast, discreet shipping</li>
              <li>Expert customer support</li>
              <li>Competitive pricing</li>
            </ul>
          </div>

          <p>Ready to explore? <a href="#" style="color: #7c3aed;">Shop our collection</a></p>

          <p>Happy smoking!<br>
          The Highway 420 Team</p>
        </div>
      `,
      marketing: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #d97706;">🚀 Exclusive Highway 420 Deals!</h1>
          <p>Hi {{customer_name}},</p>
          <p>We've got some amazing deals just for you!</p>

          <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>🔥 Featured Products</h3>
            {{featured_products}}
          </div>

          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3>🎁 Special Offer!</h3>
            <p>{{special_offer}}</p>
          </div>

          <a href="#" style="background: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Shop Now
          </a>

          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            Not interested? <a href="{{unsubscribe_link}}" style="color: #6b7280;">Unsubscribe</a>
          </p>

          <p>The Highway 420 Team</p>
        </div>
      `
    };
    return templates[type] || '';
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const settingsData = {
        business: businessSettings,
        payment: paymentSettings,
        shipping: shippingSettings,
        email: emailSettings,
        marketing: marketingSettings
      };

      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  async function saveEmailTemplate(template: EmailTemplate) {
    try {
      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      if (response.ok) {
        await loadEmailTemplates();
        setShowTemplateEditor(false);
        setSelectedTemplate(null);
        alert('Email template saved successfully!');
      } else {
        throw new Error('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save email template');
    }
  }

  async function testEmailSettings() {
    try {
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailSettings.fromEmail })
      });

      if (response.ok) {
        alert('Test email sent successfully!');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error testing email:', error);
      alert('Failed to send test email');
    }
  }

  async function sendTestEmail(templateId: string) {
    try {
      const response = await fetch('/api/admin/test-email-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          testEmail: emailSettings.fromEmail
        })
      });

      if (response.ok) {
        alert('Test email sent successfully!');
      } else {
        throw new Error('Failed to send test email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email');
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'templates', label: 'Templates', icon: Edit },
    { id: 'marketing', label: 'Marketing', icon: Bell },
    { id: 'system', label: 'System', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dope-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
          <p className="text-gray-600 mt-1">Manage your store settings, email templates, and marketing automation</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-dope-orange hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-dope-orange text-dope-orange'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-dope-orange" />
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={businessSettings.companyName}
                    onChange={(e) => setBusinessSettings({...businessSettings, companyName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) => setBusinessSettings({...businessSettings, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={businessSettings.phone}
                    onChange={(e) => setBusinessSettings({...businessSettings, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={businessSettings.taxRate}
                    onChange={(e) => setBusinessSettings({...businessSettings, taxRate: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <input
                    type="text"
                    placeholder="Street address"
                    value={businessSettings.address}
                    onChange={(e) => setBusinessSettings({...businessSettings, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent mb-2"
                  />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={businessSettings.city}
                      onChange={(e) => setBusinessSettings({...businessSettings, city: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={businessSettings.state}
                      onChange={(e) => setBusinessSettings({...businessSettings, state: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={businessSettings.zipCode}
                      onChange={(e) => setBusinessSettings({...businessSettings, zipCode: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    />
                    <select
                      value={businessSettings.timezone}
                      onChange={(e) => setBusinessSettings({...businessSettings, timezone: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    >
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/New_York">Eastern Time</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Hours
                  </label>
                  <textarea
                    value={businessSettings.businessHours}
                    onChange={(e) => setBusinessSettings({...businessSettings, businessHours: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-dope-orange" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Configuration</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Gateway
                  </label>
                  <select
                    value={paymentSettings.paymentGateway}
                    onChange={(e) => setPaymentSettings({...paymentSettings, paymentGateway: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="kajapay">Kajapay</option>
                    <option value="stripe">Stripe</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={businessSettings.currency}
                    onChange={(e) => setBusinessSettings({...businessSettings, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentSettings.minimumOrder}
                    onChange={(e) => setPaymentSettings({...paymentSettings, minimumOrder: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Order Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={paymentSettings.maximumOrder}
                    onChange={(e) => setPaymentSettings({...paymentSettings, maximumOrder: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="testMode"
                    checked={paymentSettings.testMode}
                    onChange={(e) => setPaymentSettings({...paymentSettings, testMode: e.target.checked})}
                    className="h-4 w-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                  <label htmlFor="testMode" className="ml-2 text-sm text-gray-700">
                    Enable Test Mode
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="guestCheckout"
                    checked={paymentSettings.allowGuestCheckout}
                    onChange={(e) => setPaymentSettings({...paymentSettings, allowGuestCheckout: e.target.checked})}
                    className="h-4 w-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                  <label htmlFor="guestCheckout" className="ml-2 text-sm text-gray-700">
                    Allow Guest Checkout
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-dope-orange" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Configuration</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Shipping settings are managed through Shipstation. Configure carriers, rates, and warehouses there.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Carrier
                  </label>
                  <select
                    value={shippingSettings.defaultCarrier}
                    onChange={(e) => setShippingSettings({...shippingSettings, defaultCarrier: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="fedex">FedEx</option>
                    <option value="ups">UPS</option>
                    <option value="usps">USPS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Service
                  </label>
                  <select
                    value={shippingSettings.defaultService}
                    onChange={(e) => setShippingSettings({...shippingSettings, defaultService: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="ground">Ground</option>
                    <option value="2day">2-Day</option>
                    <option value="overnight">Overnight</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Free Shipping Threshold
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingSettings.freeShippingThreshold}
                    onChange={(e) => setShippingSettings({...shippingSettings, freeShippingThreshold: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Handling Fee
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={shippingSettings.handlingFee}
                    onChange={(e) => setShippingSettings({...shippingSettings, handlingFee: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-dope-orange" />
                  <h2 className="text-xl font-semibold text-gray-900">Email Configuration</h2>
                </div>
                <button
                  onClick={testEmailSettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  Test Connection
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtpHost}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    value={emailSettings.smtpUser}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpUser: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Email Address
                  </label>
                  <input
                    type="email"
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Name
                  </label>
                  <input
                    type="text"
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableTLS"
                    checked={emailSettings.enableTLS}
                    onChange={(e) => setEmailSettings({...emailSettings, enableTLS: e.target.checked})}
                    className="h-4 w-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                  />
                  <label htmlFor="enableTLS" className="ml-2 text-sm text-gray-700">
                    Enable TLS/SSL
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-dope-orange" />
                  <h2 className="text-xl font-semibold text-gray-900">Email Templates</h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedTemplate(null);
                    setShowTemplateEditor(true);
                  }}
                  className="bg-dope-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{template.type.replace('_', ' ')}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {template.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.subject}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedTemplate(template);
                          setShowTemplateEditor(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => sendTestEmail(template.id)}
                        className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Marketing Automation */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-dope-orange" />
                <h2 className="text-xl font-semibold text-gray-900">Marketing Automation</h2>
              </div>

              <div className="space-y-6">
                {/* Abandoned Cart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Abandoned Cart Recovery</h3>
                      <p className="text-sm text-gray-600">Automatically send recovery emails to customers who leave items in their cart</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingSettings.abandonedCartEnabled}
                        onChange={(e) => setMarketingSettings({...marketingSettings, abandonedCartEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange"></div>
                    </label>
                  </div>

                  {marketingSettings.abandonedCartEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Send Delay (hours)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="168"
                          value={marketingSettings.abandonedCartDelay}
                          onChange={(e) => setMarketingSettings({...marketingSettings, abandonedCartDelay: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Hours after cart is abandoned</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Welcome Email */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Welcome Email</h3>
                      <p className="text-sm text-gray-600">Send welcome emails to new customers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingSettings.welcomeEmailEnabled}
                        onChange={(e) => setMarketingSettings({...marketingSettings, welcomeEmailEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange"></div>
                    </label>
                  </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Newsletter Signup</h3>
                      <p className="text-sm text-gray-600">Allow customers to subscribe to promotional emails</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingSettings.newsletterSignupEnabled}
                        onChange={(e) => setMarketingSettings({...marketingSettings, newsletterSignupEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange"></div>
                    </label>
                  </div>
                </div>

                {/* Promotional Emails */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Promotional Emails</h3>
                      <p className="text-sm text-gray-600">Send promotional newsletters and special offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={marketingSettings.promotionalEmailsEnabled}
                        onChange={(e) => setMarketingSettings({...marketingSettings, promotionalEmailsEnabled: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dope-orange/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dope-orange"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-dope-orange" />
                <h2 className="text-xl font-semibold text-gray-900">System Configuration</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">Maintenance Mode</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Temporarily disable the site for maintenance
                  </p>
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm">
                    Enable Maintenance Mode
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Cache Management</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Clear system caches and temporary files
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm">
                    Clear All Caches
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Template Editor Modal */}
      {showTemplateEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {selectedTemplate ? 'Edit Email Template' : 'Create New Email Template'}
              </h2>
              <button
                onClick={() => {
                  setShowTemplateEditor(false);
                  setSelectedTemplate(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate?.name || ''}
                    onChange={(e) => selectedTemplate && setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Type
                  </label>
                  <select
                    value={selectedTemplate?.type || 'marketing'}
                    onChange={(e) => selectedTemplate && setSelectedTemplate({...selectedTemplate, type: e.target.value as EmailTemplate['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  >
                    <option value="order_confirmation">Order Confirmation</option>
                    <option value="shipping_update">Shipping Update</option>
                    <option value="abandoned_cart">Abandoned Cart</option>
                    <option value="welcome">Welcome Email</option>
                    <option value="marketing">Marketing Newsletter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={selectedTemplate?.subject || ''}
                  onChange={(e) => selectedTemplate && setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Content (HTML)
                </label>
                <textarea
                  value={selectedTemplate?.content || ''}
                  onChange={(e) => selectedTemplate && setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dope-orange focus:border-transparent font-mono text-sm"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="templateActive"
                  checked={selectedTemplate?.isActive || false}
                  onChange={(e) => selectedTemplate && setSelectedTemplate({...selectedTemplate, isActive: e.target.checked})}
                  className="h-4 w-4 text-dope-orange focus:ring-dope-orange border-gray-300 rounded"
                />
                <label htmlFor="templateActive" className="text-sm text-gray-700">
                  Template is active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowTemplateEditor(false);
                    setSelectedTemplate(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-dope-orange hover:bg-orange-600 text-white rounded-lg font-medium"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
