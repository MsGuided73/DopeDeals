# Zoho API Credentials Setup Guide

## 🎯 **Overview**
You need 4 specific credentials to activate the VIP Smoke ↔ Zoho Inventory integration:
- **ZOHO_CLIENT_ID** - OAuth app identifier
- **ZOHO_CLIENT_SECRET** - OAuth app secret key
- **ZOHO_REFRESH_TOKEN** - Long-term access token
- **ZOHO_ORGANIZATION_ID** - Your Zoho Inventory organization

---

## 📋 **Prerequisites**
- Active Zoho Inventory account
- Admin access to your Zoho organization
- Access to Zoho Developer Console

---

## 🚀 **Step-by-Step Guide**

### **PHASE 1: Create OAuth Application** (Admin Required)

#### Step 1: Access Zoho Developer Console
1. Go to [https://api-console.zoho.com/](https://api-console.zoho.com/)
2. **Sign in with your Zoho admin account** ⚠️ *Admin auth required*
3. Click "Add Client" or "Get Started"

#### Step 2: Create Server-Based Application
1. Select **"Server-based Applications"**
2. Fill in application details:
   - **Client Name**: `VIP Smoke Integration`
   - **Homepage URL**: `https://your-replit-app.replit.app`
   - **Authorized Redirect URIs**: `https://your-replit-app.replit.app/api/zoho/callback`
3. Click **"Create"**

#### Step 3: Get Client Credentials ✅ **COLLECT THESE**
After creation, you'll see:
- **Client ID** → This is your `ZOHO_CLIENT_ID`
- **Client Secret** → This is your `ZOHO_CLIENT_SECRET`

📝 **Save these immediately - you'll need them for the next steps**

---

### **PHASE 2: Generate Refresh Token** (Admin Required)

#### Step 4: Set Up Scopes and Generate Authorization Code
1. In your OAuth app, go to **"Generate Code"** tab
2. **Scope**: Enter `ZohoInventory.FullAccess.all`
3. **Time Duration**: Select `10 minutes` (enough time for setup)
4. **Scope Description**: `VIP Smoke inventory integration`
5. Click **"Generate"**

#### Step 5: Authorize the Application ⚠️ *Admin auth required*
1. Click the generated authorization URL
2. **Sign in with admin credentials**
3. Review permissions and click **"Accept"**
4. **Copy the authorization code** from the redirect URL
   - Look for `code=1000...` in the URL
   - Copy everything after `code=`

#### Step 6: Exchange Code for Refresh Token
You'll need to make an API call. Use this curl command (replace placeholders):

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=https://your-replit-app.replit.app/api/zoho/callback" \
  -d "code=YOUR_AUTHORIZATION_CODE"
```

#### Step 7: Extract Refresh Token ✅ **COLLECT THIS**
From the API response, copy the `refresh_token` value:
```json
{
  "access_token": "1000...",
  "refresh_token": "1000...",  ← This is your ZOHO_REFRESH_TOKEN
  "expires_in": 3600
}
```

---

### **PHASE 3: Get Organization ID** (No Admin Required)

#### Step 8: Find Your Organization ID
**Method 1: From Zoho Inventory URL**
1. Log into Zoho Inventory
2. Look at the URL: `https://inventory.zoho.com/app/[ORGANIZATION_ID]`
3. Copy the organization ID from the URL

**Method 2: From API Call**
Use this curl command with your credentials:
```bash
curl -X GET "https://www.zohoapis.com/inventory/v1/organizations" \
  -H "Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN"
```

#### Step 9: Record Organization ID ✅ **COLLECT THIS**
- Copy the `organization_id` from the response
- This is your `ZOHO_ORGANIZATION_ID`

---

### **PHASE 4: Get Warehouse Information** (Multi-Warehouse Setup)

#### Step 10: Identify Default Warehouse ⚠️ *Critical for shared inventory*
Since VIP Smoke pulls from BMB Wholesale's shared warehouse:

1. **Get Warehouse List:**
```bash
curl -X GET "https://www.zohoapis.com/inventory/v1/settings/warehouses" \
  -H "Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN" \
  -H "organization-id: YOUR_ORGANIZATION_ID"
```

2. **Find the Default/Primary Warehouse:**
   - Look for `"is_primary": true` in the response
   - Or identify by name containing "Cash & Carry" or "Default"
   - Note the `warehouse_id` and `warehouse_name`

#### Step 11: Test Warehouse Access ✅ **COLLECT WAREHOUSE ID**
```bash
curl -X GET "https://www.zohoapis.com/inventory/v1/items?warehouse_id=WAREHOUSE_ID" \
  -H "Authorization: Zoho-oauthtoken YOUR_ACCESS_TOKEN" \
  -H "organization-id: YOUR_ORGANIZATION_ID"
```

If this returns products, you have the correct warehouse ID.

---

## ✅ **Final Checklist**

Before providing credentials to VIP Smoke, verify you have:

- [ ] **ZOHO_CLIENT_ID** (from OAuth app creation)
- [ ] **ZOHO_CLIENT_SECRET** (from OAuth app creation)  
- [ ] **ZOHO_REFRESH_TOKEN** (from token exchange)
- [ ] **ZOHO_ORGANIZATION_ID** (BMB Wholesale's organization)
- [ ] **ZOHO_WAREHOUSE_ID** (Default warehouse for Cash & Carry) 🆕

---

## 🔒 **Security Notes**

- **Keep credentials secure** - never share them publicly
- **Refresh tokens don't expire** unless revoked
- **Client secrets should be treated like passwords**
- VIP Smoke will securely store these in environment variables

---

## ⚡ **Quick Reference Commands**

**Generate Authorization Code:**
```
Scope: ZohoInventory.FullAccess.all
Duration: 10 minutes
```

**Token Exchange:**
```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
  -d "grant_type=authorization_code" \
  -d "client_id=CLIENT_ID" \
  -d "client_secret=CLIENT_SECRET" \
  -d "redirect_uri=REDIRECT_URI" \
  -d "code=AUTH_CODE"
```

**Get Organizations:**
```bash
curl -X GET "https://www.zohoapis.com/inventory/v1/organizations" \
  -H "Authorization: Zoho-oauthtoken ACCESS_TOKEN"
```

---

## 🚨 **Common Issues & Solutions**

### Issue: "Invalid Redirect URI"
**Solution**: Ensure redirect URI in OAuth app matches exactly what you use in token exchange

### Issue: "Authorization Code Expired"
**Solution**: Generate a new authorization code (Step 4-5)

### Issue: "Insufficient Privileges"
**Solution**: Ensure you're using admin credentials for OAuth setup

### Issue: "Invalid Scope"
**Solution**: Use exact scope: `ZohoInventory.FullAccess.all`

---

## 🎯 **What Happens Next**

Once you provide all 4 credentials:
1. VIP Smoke will immediately test the connection
2. Categories will sync first (2-5 minutes)
3. Product catalog will import (5-30 minutes)
4. Real-time webhooks will activate
5. Inventory will stay synchronized automatically

**Estimated Total Setup Time**: 15-30 minutes
**Estimated Sync Time**: 30-60 minutes for full integration