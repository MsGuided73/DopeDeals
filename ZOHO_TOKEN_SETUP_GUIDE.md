# Zoho Refresh Token Setup Guide

## Quick Setup Process

Now that you've added ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET, follow these steps to get your refresh token:

### Step 1: Get Authorization URL
Make a GET request to: **`/api/zoho/auth-url`**

This will return an authorization URL and instructions.

### Step 2: Complete OAuth Flow
1. Open the authorization URL in your browser
2. Log in to your BMB Wholesale Inc. Zoho account
3. Grant permissions for VIP Smoke integration
4. Copy the authorization code from the response

### Step 3: Exchange for Refresh Token
Make a POST request to: **`/api/zoho/exchange-token`**

```json
{
  "code": "YOUR_AUTHORIZATION_CODE_HERE"
}
```

This will return your refresh token.

### Step 4: Add Refresh Token
Add the returned refresh_token as **ZOHO_REFRESH_TOKEN** in Replit secrets.

## API Testing

You can test these endpoints directly:

### Get Authorization URL
```bash
curl http://localhost:5000/api/zoho/auth-url
```

### Exchange Token
```bash
curl -X POST http://localhost:5000/api/zoho/exchange-token \
  -H "Content-Type: application/json" \
  -d '{"code": "YOUR_AUTH_CODE"}'
```

## What Happens Next

Once you add the ZOHO_REFRESH_TOKEN:
1. The server will automatically restart
2. Zoho integration will be fully enabled
3. Real-time inventory sync will begin
4. Order processing will be activated

## Required Scopes

The authorization will request these permissions:
- **ZohoInventory.FullAccess.all** - Full inventory management
- **ZohoInventory.items.ALL** - Product management
- **ZohoInventory.salesorders.ALL** - Order processing
- **ZohoInventory.contacts.ALL** - Customer management
- **ZohoInventory.settings.ALL** - Custom fields access
- **ZohoInventory.inventoryadjustments.ALL** - Inventory adjustments

These scopes ensure VIP Smoke can fully integrate with your BMB Wholesale Inc. inventory system.