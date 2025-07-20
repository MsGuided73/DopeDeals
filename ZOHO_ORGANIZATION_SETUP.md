# Zoho Multi-Organization Setup
## VIP Smoke + BMB Wholesale Integration

## **Correct Organization Structure**

### **Organization 1: BMB Wholesale INC. Cash & Carry**
- **Role**: Primary warehouse owner (B2B)
- **Contains**: Physical inventory, warehouses, master product catalog
- **Users**: BMB admin team, SigDistro access
- **Warehouse**: "Cash & Carry Default" or similar

### **Organization 2: VIP Smoke** 
- **Role**: Secondary consumer brand (B2C) 
- **Contains**: Brand-specific settings, customer data, orders
- **Users**: VIP Smoke team
- **Warehouse Access**: Shared access to BMB's warehouse(s)

---

## **Integration Flow**

```
BMB Wholesale Org
├── Warehouse: "Cash & Carry"
│   ├── Physical Inventory
│   └── Shared Access Granted To:
│       ├── SigDistro (B2B)
│       └── VIP Smoke (B2C) ← This is what we're connecting
└── Master Product Catalog

VIP Smoke Org  
├── OAuth App: "VIP Smoke Integration"
├── API Credentials: CLIENT_ID, SECRET, REFRESH_TOKEN
├── Organization ID: VIP_SMOKE_ORG_ID
└── Accesses: BMB's Warehouse via shared permissions
```

---

## **Credential Setup Clarification**

### **What You Need:**
1. **VIP Smoke OAuth App** (in VIP Smoke's organization)
   - ZOHO_CLIENT_ID (VIP Smoke's app)
   - ZOHO_CLIENT_SECRET (VIP Smoke's app)
   - ZOHO_REFRESH_TOKEN (VIP Smoke's authorization)

2. **VIP Smoke Organization**
   - ZOHO_ORGANIZATION_ID (VIP Smoke's org, NOT BMB's)

3. **BMB Warehouse Access**
   - ZOHO_WAREHOUSE_ID (BMB's warehouse that VIP can access)

### **Permission Requirements:**
- BMB Wholesale must grant VIP Smoke **warehouse access**
- VIP Smoke creates OAuth app in their own organization
- API calls use VIP Smoke's credentials but access BMB's inventory

---

## **Setup Steps (Revised)**

### **Step 1: VIP Smoke Organization Setup**
1. VIP Smoke logs into their Zoho account
2. Creates OAuth application in VIP Smoke's organization
3. Gets VIP Smoke's organization ID

### **Step 2: Cross-Organization Permissions**
1. BMB Wholesale admin grants VIP Smoke access to warehouse
2. VIP Smoke can now see BMB's warehouse in their warehouse list
3. VIP Smoke identifies BMB's warehouse ID

### **Step 3: Test Integration**
```bash
# Using VIP Smoke's credentials to access BMB's warehouse
curl -X GET "https://www.zohoapis.com/inventory/v1/items?warehouse_id=BMB_WAREHOUSE_ID" \
  -H "Authorization: Zoho-oauthtoken VIP_SMOKE_ACCESS_TOKEN" \
  -H "organization-id: VIP_SMOKE_ORGANIZATION_ID"
```

---

## **Common Issues & Solutions**

### **Issue**: "No warehouses found"
**Cause**: BMB hasn't granted warehouse access to VIP Smoke
**Solution**: BMB admin must share warehouse with VIP Smoke organization

### **Issue**: "Access denied to warehouse"
**Cause**: Insufficient permissions on shared warehouse
**Solution**: BMB admin must grant inventory read/write access

### **Issue**: "Organization not found"
**Cause**: Using BMB's org ID instead of VIP Smoke's
**Solution**: Use VIP Smoke's own organization ID

---

## **Benefits of This Setup**

1. **Proper Separation**: VIP Smoke maintains its own organization identity
2. **Shared Inventory**: Real-time access to BMB's warehouse
3. **Security**: VIP Smoke can't access BMB's organizational settings
4. **Scalability**: Easy to add more brands under this model
5. **Reporting**: Each organization maintains its own order/customer data

---

## **Integration Testing Checklist**

- [ ] VIP Smoke organization exists in Zoho
- [ ] OAuth app created in VIP Smoke's organization  
- [ ] VIP Smoke has access to BMB's warehouse
- [ ] Can fetch products from BMB's warehouse using VIP's credentials
- [ ] Can create orders in VIP's organization using BMB's inventory
- [ ] Real-time inventory updates work across organizations