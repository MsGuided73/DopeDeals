# Zoho Inventory Integration - Admin Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the Zoho Inventory integration. The VIP Smoke platform uses Zoho's OAuth 2.0 authentication to securely connect with your Zoho Inventory account for real-time inventory management, order synchronization, and product data exchange.

## Prerequisites
- Active Zoho Inventory account with admin privileges
- Access to Zoho Developer Console
- Organization ID from your Zoho Inventory account

## Step 1: Get BMB Wholesale Inc. Organization ID

**Important:** VIP Smoke will integrate directly with your existing BMB Wholesale Inc. Zoho Inventory organization. You'll need to provide the current organization ID.

### 1.1 Find Your Organization ID
1. Log into your BMB Wholesale Inc. Zoho Inventory account
2. Go to **Settings** → **Organization Profile**
3. Copy the **Organization ID** (it will be a long number like `10234695`)
4. Save this ID - this is what you'll provide to the development team

**Note:** VIP Smoke products will be managed within your existing BMB Wholesale Inc. inventory system. You may want to use categories, brands, or custom fields to distinguish VIP Smoke products from other inventory.

## Step 2: Create a Connected App in Zoho Developer Console

### 2.1 Access Developer Console
1. Go to [Zoho Developer Console](https://api-console.zoho.com/)
2. Log in with your Zoho Inventory credentials
3. Click **ADD CLIENT** or **CREATE NEW CLIENT**

### 2.2 Choose Client Type
Select **Self Client** because:
- No redirect URL needed
- Perfect for server-to-server integration
- Simplifies the token generation process
- Ideal for backend applications like VIP Smoke

### 2.3 App Registration Details
- **Client Name:** `VIP Smoke E-Commerce Integration`
- **Description:** `Backend integration for VIP Smoke platform to sync inventory, orders, and product data within BMB Wholesale Inc. Zoho Inventory`

### 2.4 Get Client Credentials
After creation, you'll receive:
- **Client ID** (format: `1000.XXXXXXXXXXXXXXXXXXXXXXXX`)
- **Client Secret** (format: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

**⚠️ Important:** Keep these credentials secure and never share them publicly.

## Step 3: Configure Required Scopes

For VIP Smoke integration, you need these specific scopes:

### Essential Scopes (Required)
```
ZohoInventory.items.ALL
ZohoInventory.contacts.ALL
ZohoInventory.salesorders.ALL
ZohoInventory.invoices.ALL
ZohoInventory.settings.READ
ZohoInventory.packages.ALL
ZohoInventory.shipmentorders.ALL
```

### Optional Scopes (Recommended for Future Features)
```
ZohoInventory.inventoryadjustments.READ
ZohoInventory.transferorders.READ
ZohoInventory.customerpayments.READ
ZohoInventory.purchaseorders.READ
```

## Step 4: Generate Refresh Token

### 4.1 Generate Grant Token
1. In your Zoho Developer Console, go to your **VIP Smoke** app
2. Click the **Generate Code** tab
3. Enter the required scopes (copy the scopes from Step 3 above, separated by commas):
   ```
   ZohoInventory.items.ALL,ZohoInventory.contacts.ALL,ZohoInventory.salesorders.ALL,ZohoInventory.invoices.ALL,ZohoInventory.settings.READ,ZohoInventory.packages.ALL,ZohoInventory.shipmentorders.ALL
   ```
4. Set **Time Duration:** 3 minutes (default)
5. **Description:** `VIP Smoke initial token generation`
6. Click **CREATE**
7. **Copy the grant token immediately** (it expires in 3 minutes)

### 4.2 Exchange Grant Token for Refresh Token
Use this curl command (replace the placeholders with your actual values):

```bash
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST \
"https://accounts.zoho.com/oauth/v2/token" \
-d "grant_type=authorization_code" \
-d "client_id=YOUR_CLIENT_ID" \
-d "client_secret=YOUR_CLIENT_SECRET" \
-d "code=YOUR_GRANT_TOKEN"
```

**Example with sample values:**
```bash
curl -H "Content-Type: application/x-www-form-urlencoded" -X POST \
"https://accounts.zoho.com/oauth/v2/token" \
-d "grant_type=authorization_code" \
-d "client_id=1000.XXXXXXXXXXXXXXXXXXXXXXXXX" \
-d "client_secret=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
-d "code=1000.xxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxx"
```

### 4.3 Save the Response
You'll get a response like this:
```json
{
  "access_token": "1000.xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxx",
  "refresh_token": "1000.xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxx",
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Save the `refresh_token`** - this is what you'll need for the VIP Smoke platform.

## Step 5: Determine Your Data Center

Check which Zoho data center your account uses:

- **United States (.com):** `https://www.zohoapis.com`
- **Europe (.eu):** `https://www.zohoapis.eu`
- **India (.in):** `https://www.zohoapis.in`
- **Australia (.com.au):** `https://www.zohoapis.com.au`

Your API domain from Step 4.3 response will indicate the correct data center.

## Step 6: Provide Credentials to VIP Smoke Development Team

Send these **4 pieces of information** securely to the development team:

### Required Environment Variables:
1. **ZOHO_CLIENT_ID:** `1000.XXXXXXXXXXXXXXXXXXXXXXXXX`
2. **ZOHO_CLIENT_SECRET:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. **ZOHO_REFRESH_TOKEN:** `1000.xxxxxxxxxxxxxxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxx`
4. **ZOHO_ORGANIZATION_ID:** `850205569` (BMB Wholesale Inc. organization ID)

### Optional (Auto-detected):
- **ZOHO_API_DOMAIN:** `https://www.zohoapis.com` (or your region's domain)

## Step 7: Verification and Testing

Once the development team has configured the credentials:

### 7.1 Initial Sync Test
The system will automatically:
- Test connection to your BMB Wholesale Inc. Zoho Inventory
- Sync product categories and brands
- Import active products (VIP Smoke will filter/manage relevant inventory)
- Set up webhook endpoints for real-time updates
- Configure product categorization for VIP Smoke-specific items

### 7.2 Expected Results
You should see:
- Products from BMB Wholesale Inc. inventory available in VIP Smoke platform
- Inventory levels synchronized in real-time
- Orders from VIP Smoke creating sales orders in BMB Wholesale Inc. Zoho Inventory
- Real-time stock updates across both systems
- VIP Smoke products managed within your existing inventory system

## Troubleshooting

### Common Issues and Solutions:

#### 1. "Invalid Client" Error
- **Solution:** Verify Client ID and Client Secret are correct
- Ensure no extra spaces or line breaks in the credentials

#### 2. "Invalid Grant Token" Error
- **Solution:** Grant tokens expire in 3 minutes - generate a new one
- Make sure to use the token immediately after generation

#### 3. "Access Denied" Error
- **Solution:** Check that all required scopes are included
- Verify your Zoho account has admin privileges

#### 4. "Organization Not Found" Error
- **Solution:** Double-check your Organization ID from Step 1
- Ensure you're using the correct Zoho Inventory account

## Security Best Practices

1. **Never share credentials publicly** (email, chat, repositories)
2. **Use secure channels** to transmit credentials to development team
3. **Store refresh tokens securely** - they don't expire
4. **Monitor API usage** in Zoho Developer Console
5. **Revoke tokens if compromised** using Zoho's token revocation endpoint

## Integration Features

Once configured, the Zoho integration provides:

### Real-time Inventory Management
- Automatic stock level updates
- Low stock alerts
- Multi-warehouse support

### Order Synchronization
- VIP Smoke orders create Zoho sales orders
- Customer information sync
- Invoice generation

### Product Management
- Automatic product imports
- Category and brand synchronization
- Pricing updates

### Customer Management
- Customer creation and updates
- Purchase history tracking
- VIP membership status sync

## Support

If you encounter issues during setup:

1. **Check Zoho Developer Console** for error messages
2. **Verify Organization ID** is correct
3. **Ensure all scopes are granted** during token generation
4. **Contact VIP Smoke development team** with specific error messages

## Additional Resources

- [Zoho Developer Console](https://api-console.zoho.com/)
- [Zoho Inventory API Documentation](https://www.zoho.com/inventory/api/v1/)
- [OAuth 2.0 Troubleshooting Guide](https://www.zoho.com/accounts/protocol/oauth-troubleshooting.html)

---

**Next Steps:** Once you've completed this setup and provided the credentials, the development team will configure the integration and notify you when testing can begin.