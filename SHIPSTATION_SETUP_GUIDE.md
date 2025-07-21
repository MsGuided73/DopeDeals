# ShipStation Integration Setup Guide

## Overview

VIP Smoke now includes comprehensive ShipStation integration for order fulfillment and shipping management. This guide walks you through the complete setup process.

## Prerequisites

1. **ShipStation Account**: You need an active ShipStation account with API access
2. **VIP Smoke Platform**: Ensure your platform is running and database is configured

## Step 1: ShipStation Account Setup

### 1.1 Plan Requirements
- **V1 API**: Requires Scale-Gold, Accelerate, or higher plans
- **V2 API**: Available on all plans (early access)
- **Inventory API**: Paid add-on for any plan

### 1.2 Generate API Credentials
1. Log into your ShipStation account
2. Go to **Account Settings** → **API Settings**
3. Select your API Version (V1 recommended for production)
4. Click **Generate API Key**
5. Complete email verification if required
6. Save your **API Key** and **API Secret**

## Step 2: Environment Configuration

Add the following environment variables to your `.env` file or Replit Secrets:

### Required Variables
```bash
# ShipStation API Credentials
SHIPSTATION_API_KEY=your_api_key_here
SHIPSTATION_API_SECRET=your_api_secret_here
```

### Optional Variables
```bash
# Webhook Configuration
SHIPSTATION_WEBHOOK_URL=https://your-domain.replit.app/api/shipstation/webhooks/process
SHIPSTATION_ENABLE_WEBHOOKS=true

# Default Warehouse (if you have multiple)
SHIPSTATION_DEFAULT_WAREHOUSE_ID=your_warehouse_id

# Sync Configuration
SHIPSTATION_SYNC_INTERVAL=3600000  # 1 hour in milliseconds
```

## Step 3: Database Schema Deployment

The ShipStation integration requires additional database tables. Run the following command to create them:

```bash
npm run db:push
```

This will create the following tables:
- `shipstation_orders` - Order synchronization data
- `shipstation_shipments` - Shipping and tracking information
- `shipstation_webhooks` - Webhook event processing
- `shipstation_products` - Product synchronization
- `shipstation_warehouses` - Warehouse information
- `shipstation_sync_status` - Synchronization monitoring

## Step 4: Webhook Setup (Optional but Recommended)

Webhooks provide real-time updates from ShipStation. To set them up:

### 4.1 Configure Webhook URL
Your webhook URL should be:
```
https://your-domain.replit.app/api/shipstation/webhooks/process
```

### 4.2 Setup via API
The integration can automatically setup webhooks for you:

```bash
curl -X POST "https://your-domain.replit.app/api/shipstation/webhooks/setup" \
  -H "Content-Type: application/json"
```

### 4.3 Manual Setup via ShipStation UI
1. Go to **Account Settings** → **Integration Partners**
2. Select **Webhooks**
3. Click **Add a Webhook**
4. Configure:
   - **Name**: VIP Smoke Integration
   - **Target URL**: Your webhook URL
   - **Events**: ORDER_NOTIFY, SHIP_NOTIFY, ITEM_ORDER_NOTIFY

## Step 5: Testing the Integration

### 5.1 Health Check
Test if the integration is working:

```bash
curl "https://your-domain.replit.app/api/shipstation/health"
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-21T...",
  "apiStatus": {
    "baseUrl": "https://ssapi.shipstation.com",
    "version": "v1",
    "authenticated": true
  }
}
```

### 5.2 Configuration Validation
Validate your API credentials:

```bash
curl "https://your-domain.replit.app/api/shipstation/config/validate"
```

### 5.3 Get Carriers
Test API connectivity by fetching available carriers:

```bash
curl "https://your-domain.replit.app/api/shipstation/carriers"
```

## Step 6: Core Features Usage

### 6.1 Order Synchronization

#### Sync Orders from ShipStation
```bash
curl -X POST "https://your-domain.replit.app/api/shipstation/sync/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2024-01-31T23:59:59Z",
    "fullSync": false
  }'
```

#### Create Order in ShipStation
```bash
curl -X POST "https://your-domain.replit.app/api/shipstation/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "VIP-001",
    "orderDate": "2024-01-21T10:00:00Z",
    "orderStatus": "awaiting_shipment",
    "customerId": "customer-123",
    "billTo": {
      "name": "John Doe",
      "street1": "123 Main St",
      "city": "Austin",
      "state": "TX",
      "postalCode": "78701",
      "country": "US"
    },
    "shipTo": {
      "name": "Jane Smith",
      "street1": "456 Oak Ave",
      "city": "Dallas",
      "state": "TX",
      "postalCode": "75201",
      "country": "US"
    },
    "items": [{
      "name": "Premium Glass Pipe",
      "quantity": 1,
      "unitPrice": 49.99
    }],
    "orderTotal": 49.99
  }'
```

### 6.2 Shipping Rate Quotes

Get shipping rates for an order:

```bash
curl -X POST "https://your-domain.replit.app/api/shipstation/rates" \
  -H "Content-Type: application/json" \
  -d '{
    "packageCode": "package",
    "fromPostalCode": "78701",
    "toCountry": "US",
    "toPostalCode": "75201",
    "weight": {
      "value": 1.5,
      "units": "pounds"
    }
  }'
```

### 6.3 Create Shipping Labels

Create a shipping label for an order:

```bash
curl -X POST "https://your-domain.replit.app/api/shipstation/orders/VIP-001/label" \
  -H "Content-Type: application/json" \
  -d '{
    "carrierCode": "fedex",
    "serviceCode": "fedex_ground",
    "packageCode": "package",
    "testLabel": true
  }'
```

### 6.4 Product Synchronization

Sync products from ShipStation:

```bash
curl -X POST "https://your-domain.replit.app/api/shipstation/sync/products"
```

### 6.5 Analytics and Monitoring

Check synchronization status:

```bash
curl "https://your-domain.replit.app/api/shipstation/sync/status?syncType=orders"
```

Get shipment analytics:

```bash
curl "https://your-domain.replit.app/api/shipstation/analytics/shipments?startDate=2024-01-01&endDate=2024-01-31"
```

## Step 7: Integration Workflow

### Typical Order Fulfillment Flow

1. **Order Creation**: Customer places order on VIP Smoke
2. **Order Sync**: Order automatically synced to ShipStation
3. **Rate Shopping**: Get competitive shipping rates
4. **Label Creation**: Generate shipping label with best rate
5. **Tracking**: Automatic tracking updates via webhooks
6. **Customer Notification**: Real-time shipping updates

### Automated Synchronization

The integration supports automatic synchronization:

- **Orders**: Bi-directional sync between VIP Smoke and ShipStation
- **Products**: Keep inventory and product data in sync
- **Shipments**: Real-time tracking and status updates
- **Webhooks**: Instant notifications for status changes

## Step 8: Troubleshooting

### Common Issues

#### 1. Authentication Errors
- Verify API credentials are correct
- Check if your ShipStation plan supports API access
- Ensure email verification is completed

#### 2. Webhook Issues
- Verify webhook URL is accessible
- Check firewall settings
- Ensure HTTPS is used (required by ShipStation)

#### 3. Sync Failures
- Check sync status endpoint for error details
- Verify date ranges are valid
- Monitor server logs for detailed error messages

#### 4. Rate Calculation Errors
- Ensure address information is complete
- Verify weight and dimensions are provided
- Check if carrier supports the destination

### Debug Endpoints

Monitor integration health:

```bash
# Health check
curl "https://your-domain.replit.app/api/shipstation/health"

# Sync status
curl "https://your-domain.replit.app/api/shipstation/sync/status"

# Available carriers
curl "https://your-domain.replit.app/api/shipstation/carriers"

# Warehouses
curl "https://your-domain.replit.app/api/shipstation/warehouses"
```

## Step 9: Production Considerations

### Security
- Store API credentials securely in environment variables
- Use HTTPS for all webhook endpoints
- Implement proper error handling and logging

### Performance
- Configure appropriate sync intervals
- Use webhooks to minimize API calls
- Monitor rate limits and implement backoff strategies

### Monitoring
- Set up alerts for sync failures
- Monitor webhook processing
- Track shipping cost trends and carrier performance

## Support and Documentation

### Official ShipStation Resources
- [ShipStation V1 API Documentation](https://www.shipstation.com/docs/api/)
- [ShipStation V2 API Documentation](https://docs.shipstation.com/)
- [ShipStation Help Center](https://help.shipstation.com/)

### VIP Smoke Integration Features
- Complete order fulfillment workflow
- Real-time shipping rates and label generation
- Automated inventory synchronization
- Comprehensive webhook support
- Analytics and reporting capabilities
- Multi-warehouse support
- International shipping support

## Getting Help

If you encounter issues with the ShipStation integration:

1. Check the health endpoint for system status
2. Review server logs for detailed error messages
3. Verify your ShipStation account and API credentials
4. Ensure all required environment variables are set
5. Test with the provided API examples

The integration is designed to be robust and handle various edge cases, but proper configuration is essential for optimal performance.