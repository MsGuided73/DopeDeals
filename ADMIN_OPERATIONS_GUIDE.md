# 🚀 Highway 420 Website Administration Guide
*Complete Operational Manual for Managing Your E-Commerce Platform*

**Version 1.0 - October 27, 2025**
**Created by:** System Assistant
**Audience:** Website Administrators, Content Managers, Support Staff

---

## 📋 **Quick Navigation**

1. [Daily Operations](#-daily-operations)
2. [Order Management](#-order-management)
3. [Content Management](#-content-management)
4. [Inventory Management](#-inventory-management)
5. [User Management](#-user-management)
6. [System Maintenance](#-system-maintenance)
7. [Emergency Procedures](#-emergency-procedures)
8. [Performance Monitoring](#-performance-monitoring)
9. [Quick Reference](#-quick-reference)

---
---
---

## 📊 **Dashboard Overview**

### **Access Admin Panel**
1. **Navigate to:** `https://yourdomain.com/admin`
2. **Authentication:** Login with admin credentials
3. **Dashboard View:** `/admin/page.tsx`

### **Key Metrics Displayed:**
- **Order Count:** Today's/total orders
- **Revenue:** Daily/weekly/monthly
- **Product Status:** Low stock alerts
- **Recent Activity:** Latest orders, content updates

---
---
---

## 🛒 **Order Management** `[Priority: High]`

### **🎯 Daily Order Processing - 30 minutes**
1. **📱 Access Orders:** Go to `/admin/orders`
2. **📋 Review New Orders:** Status = "pending"
3. **✅ Mark Processing:** Change status to "processing"
4. **📍 Update Shipping:** Add tracking numbers when shipped
5. **📦 Mark Delivered:** Update status to "delivered"
6. **❓ Handle Issues:** Refund button for problem orders

```bash
# Daily Checklist:
□ Login to admin dashboard
□ Review pending orders (0-50)
□ Process past payment orders
□ Update shipping status
□ Handle customer inquiries
□ Generate daily sales report
```

### **📦 Order Details & Actions**

#### **View Order Details:**
- Click any order row in the table
- See: Customer info, shipping address, order items, total amount
- View payment status, payment method, order history

#### **Update Order Status:**
```mermaid
Pending → Processing → Shipped → Delivered
           ↓         ↓
        Cancelled  Refunded
```

#### **Status Update Process:**
1. **Find Order** → Search by customer name or order ID
2. **Click Actions** → Select new status
3. **Add Notes** → Optional customer-facing notes
4. **Save Changes** → System logs update automatically

### **🚨 Order Issues & Refunds**

#### **Cancel Order:**
1. **Go to Order Details** → Click "Cancel Order"
2. **Restock Items** → System automatically restores inventory
3. **Refund Process** → Follow your payment processor's refund policy

#### **Refund Workflow:**
```
Order Status: paid → Processing refund → refund initiated → refunded
Inventory: restocked → customer notified → order closed
```

### **📊 Sales Reports**
**Access:** `/admin/orders` → Click "Export Reports"

#### **Available Reports:**
- **Daily Sales:** Orders, revenue, top products
- **Monthly Summary:** Trends, best-selling categories
- **Customer Data:** Purchase history, geographical data
- **Product Performance:** Sold vs. viewed, conversion rates

```bash
# Tips:
# - Export weekly reports every Monday morning
# - Review top-selling products for inventory planning
# - Monitor geographical data for shipping optimization
```

---
---
---

## 📝 **Content Management** `[Priority: Medium]`

### **📰 Blog Posts - 15 minutes/day**

### **Add New Article:**
1. **Navigate to:** `/admin/blog`
2. **Click:** "New Post" button (top right)
3. **Fill Form:**
   - **Title:** "THCA Diamonds: Complete Guide 2025" (clickbait-friendly)
   - **Excerpt:** Brief summary (150-200 characters, appears in listings)
   - **Content:** Full article (support HTML/markdown)
   - **Author:** "Dr. Cannabis" or "Product Specialist"
   - **Category:** "Education" / "Product News" / "Science"
   - **Featured:** ✓ (shows in featured section)
   - **Image URL:** "https://cdn.example.com/thca-guide.jpg"

### **Edit Existing Article:**
1. **Find Post** → Click "Edit" in actions column
2. **Modify Content** → Update text, images, metadata
3. **Unpublish** → Change status to "draft" if needed

### **Content Strategy:**
```bash
# Weekly Content Plan:
□ Monday: Product education article ("Everything About [Product]")
□ Wednesday: News/industry article ("Market Trends", "Regulations")
□ Friday: Fun/lifestyle article ("How To", "Cultural Content")
□ Daily: Social media cross-promotion
```

#### **Blog Categories & SEO:**
| Category | Purpose | SEO Keywords |
|----------|---------|--------------|
| Education | Tutorial content | "how to", "guide", "learn" |
| Product News | Releases, updates | "new", "premium", "arrival" |
| Science | Research, facts | "research", "study", "facts" |
| Maintenance | Care guides | "cleaning", "maintain", "care" |
| Culture | Lifestyle content | "cannabis culture", "community" |

### **📸 Image Management**

#### **Upload Images:**
- **Use External CDN:** Recommended (Cloudinary, Supabase Storage)
- **File Formats:** JPG, PNG, WebP (optimize for web)
- **Naming Convention:** `blog-post-title-main-image.jpg`
- **Alt Text:** Always include SEO-friendly descriptions

#### **Logo & Brand Assets:**
- **Storage:** `Supabase Storage/public/Highway420_assets/`
- **Main Logo:** `logo_Highway420-official_transparent.png`
- **Fallback:** `logo_Highway420-square.png` (social media)

### **🔍 SEO Content Guidelines**

#### **Article Checklist:**
```
□ H1 title (main keyword)
□ Meta description (excerpt = meta)
□ H2/H3 subheadings (keyword variation)
□ Alt text on all images
□ Internal links to products/pages
□ External links to reputable sources
□ 500-2000 word content
□ Mobile-optimized formatting
□ "Call to action" at article end
□ Related article suggestions
```

#### **SEO Tips:**
- **Title Format:** "Ultimate Guide to [Keyword] 2025 - Highway 420"
- **URL Structure:** `/blog/guide-to-keyword-2025`
- **Keywords:** Target 1-2 primary, 3-4 secondary per post
- **Internal Links:** Link related product categories
- **Social Sharing:** Include share buttons on posts

---
---
---

## 📦 **Inventory Management** `[Priority: High]`

### **🔢 Stock Level Monitoring**

#### **Daily Inventory Check:**
1. **Navigate:** `/admin/inventory` (when available)
2. **Filter:** "Low Stock Items" (< 5 units)
3. **Review:** Items selling fast or approaching out-of-stock
4. **Action:** Reorder popular items proactively

#### **Low Stock Alerts:**
```
Critical: 0-2 units → Order immediately
Warning: 3-5 units → Plan to reorder
Normal: 6+ units → Monitor sales velocity
```

### **📊 Inventory Dashboard Features:**

#### **Current Monitoring:**
- **Real-time Stock:** Automatic updates on sales
- **Low Stock Alerts:** Email notifications to admin
- **Reorder Points:** Configurable thresholds per product

#### **Manual Inventory Updates:**
```
For now, inventory updated via:
1. Database direct editing
2. Order processing (automatic)
3. Manual API calls (future feature)
```

### **🛍️ Product Management**

#### **Add New Products:**
1. **Go to:** `/admin/products` (when implemented)
2. **Click:** "Add Product" button
3. **Required Fields:**
   - **Name** (course title)
   - **SKU** (unique identifier)
   - **Category** (main classification)
   - **Price** (with any variations)
   - **Stock** (initial quantity)
   - **Images** (min 3-4 quality images)
   - **Description** (detailed, benefits-focused)

#### **Product Categories:**
- **Bongs** (beakers, bubblers, steamrollers)
- **Dab Rigs** (glass, e-rigs, dabber tools)
- **Pipes** (wooden, metal, spoons)
- **Vapes** (vape pens, cartridges)
- **Accessories** (cleanup, storage, lighting)
- **Supplies** (papers, baggies, grinders)

### **💰 Pricing Strategy**

#### **Product Pricing:**
- **Cost Plus:** (2x wholesale + shipping + fees + profit)
- **Tier System:** (Like a telephone system for scale pricing S,M,L,XL)

#### **Pricing Formula:**
```
Cost: $X (from supplier)
Shipping: $Y (regional)
Fees: 15% processing
Profited: Base markup

Total Price = Cost + Shipping + $.Threed + Profited
Combine all costs and add 30% profit margin
```

#### **Dynamic Pricing Strategy:**
- **Entry Level:** $10-25 (accessible)
- **Mid-Tier:** $26-75 (popular range)
- **Premium:** $76-200+ (luxury items)

---
---
---

## 👥 **User Management** `[Priority: Low]`

### **🔐 User Administration**

#### **Current User System:**
- **Registration:** Email/password authentication
- **Age Verification:** Required 21+ compliance
- **Account Types:** Guest, Logged-in, Admin

#### **User Data Management:**
```bash
# User Information Storage:
- Personal details (name, email, shipping)
- Order history and preferences
- Age verification status
- Account settings and preferences
```

### **🛡️ Admin User Management**

#### **Add New Admin:**
1. **Access:** Database direct (currently)
2. **Set Role:** `profiles.role = 'admin'`
3. **Permissions:** Full system access

#### **Admin Tasks:**
```
□ Monitor user account activity
□ Handle support tickets (when implemented)
□ Review reported content
□ Manage banned users list
□ Generate user analytics reports
```

### **📞 Customer Support**

#### **Common Inquiries:**
- **Order Status:** Check `/admin/orders`
- **Shipping Issues:** Update tracking information
- **Returns/Exchanges:** Follow company policy
- **Product Questions:** Reference product pages
- **Technical Issues:** Monitor error logs

---
---
---

## 🛠️ **System Maintenance** `[Priority: Medium]`

### **⏰ Daily Maintenance (10 minutes)**

#### **Morning Checklist:**
```bash
□ Login to admin dashboard
□ Check low stock alerts
□ Review pending orders
□ Monitor system health metrics
□ Backup database (verify automated)
□ Check email delivery status
□ Review error logs if any
```

### **📱 Site Health Monitoring**

#### **Performance Monitoring:**
- **Response Times:** Target <2 seconds for pages
- **API Endpoints:** Monitor `/health` endpoint status
- **Database:** Monitor query performance
- **Storage:** Check upload/download capacities

#### **Error Handling:**
- **Error Logs:** Check `/var/log/application.log`
- **API Errors:** Monitor failed requests
- **Payment Errors:** Track webhook failures
- **User Errors:** Review 404/pages not found

### **💾 Data Backup Strategy**

#### **Automated Backups:**
- **Database:** Daily automated backups via Supabase
- **Media Files:** Weekly full backup of uploaded content
- **Configuration:** Version controlled settings files

#### **Manual Backup Process:**
1. **Database:** Download backup from Supabase dashboard
2. **Files:** Download `/public` and `/app` directories
3. **Code:** Export current commit from GitHub

### **🔧 Technical Maintenance**

#### **Dependencies:**
```bash
# Weekly npm audit:
npm audit
npm audit fix

# Update lockfiles:
pnpm install
```

#### **Security Updates:**
- **Regular:** Check for dependency vulnerabilities
- **Critical:** Apply security patches immediately
- **Review:** Audit admin access logs monthly

---
---
---

## 🚨 **Emergency Procedures** `[Priority: High]`

### **📢 Site Down / Major Issues**

#### **Immediate Response:**
1. **Check Status:** Visit `yourcompany.com/status` (if implemented)
2. **Monitor Console:** Check browser DevTools for errors
3. **Database:** Confirm Supabase connectivity
4. **Webhooks:** Verify Kajapay payment processing

#### **Communication:**
```
Customers: "We're aware and working on this"
Internal: Ping dev team immediately
Timeline: Target <1 hour resolution time
```

### **💳 Payment System Issues**

#### **Kajapay Problems:**
1. **Check Webhooks:** Verify `/api/kajapay/webhook` active
2. **Payment Logs:** Review failed payment records
3. **Downtime:** Switch to manual order processing if needed

#### **Order Recovery:**
```
1. Manual order creation in admin
2. Customer notification of processing
3. Payment reconciliation once fixed
```

### **📈 Sudden Traffic Spike**

#### **Capacity Issues:**
1. **Monitor Metrics:** Watch response times > 3 seconds
2. **Scale Resources:** Increase Supabase capacity if needed
3. **Cache Content:** Enable additional caching layers

### **🛡️ Security Incidents**

#### **Immediate Actions:**
1. **Isolate:** Block suspicious IP addresses
2. **Audit:** Review recent admin/login activities
3. **Data Backup:** Secure recent backups
4. **Notification:** Report appropriate authorities if needed

#### **Recovery Steps:**
```
1. Change all admin passwords
2. Review database integrity
3. Clear affected session tokens
4. Update security protocols
```

---
---
---

## 📊 **Performance Monitoring** `[Priority: Medium]`

### **🔍 Daily Metrics Review**

#### **Key Performance Indicators:**
- **Page Load Speed:** < 2 seconds target
- **Order Conversion:** Shopping cart → paid ratio
- **Search Engagement:** Searches → views → purchases
- **Error Rate:** API failures per hour
- **Database Performance:** Query response times

### **🖥️ Admin Dashboard Metrics**

#### **Real-Time Monitoring:**
```
Orders Today: 12
Revenue Today: $487.63
Active Users: 157
Search Queries: 2,341
Error Rate: 0.01%
```

#### **Weekly Reports:**
- Sales trend analysis
- Customer demographic data
- Top-performing products
- System performance logs
- Search term analytics

### **🔧 Optimization Tasks**

#### **Monthly Performance Review:**
```bash
□ Image compression optimization
□ Database query optimization
□ Code bundle size reduction
□ Loading performance improvements
□ Mobile responsiveness testing
```

---
---
---

## ⚡ **Quick Reference** `[Priority: N/A]`

### **🎯 Most Common Tasks**

| Task | Location | Frequency | Time |
|------|----------|-----------|------|
| Check Orders | `/admin/orders` | Daily | 15min |
| Approve Blog Posts | `/admin/blog` | 3x/week | 10min |
| Monitor Inventory | `/admin/inventory` | Daily | 5min |
| Review Sales | `/admin/orders/export` | Weekly | 20min |
| Update Content | `/admin/blog` | 4x/week | 20min |

### **📞 Emergency Contacts**
```
Technical Issues: [Dev Team Slack Channel]
Payment Problems: Kajapay Support (support@kajapay.com)
Server Issues: [Hosting Provider Number]
Legal Concerns: [Company Legal Team]
```

### **🔑 Important URLs**
```
Admin Login: yourdomain.com/admin
Orders: yourdomain.com/admin/orders
Blog Admin: yourdomain.com/admin/blog
API Health: yourdomain.com/api/health
System Status: [Monitoring Service URL]
```

### **💡 Pro Tips**
- **Automate Repetitive Tasks** - Use scripts where possible
- **Backup Before Changes** - Always create database snapshots
- **Test Updates First** - Use staging environment
- **Document Changes** - Update this guide with new procedures
- **Regular Training** - Stay updated with system changes

---
---
---

## 📞 **End of Guide**

**Remember:** This guide should be updated regularly as new features are added to the system. Any administrative staff member should be familiar with these procedures after orientation.

**Last Updated:** October 27, 2025
**Next Review:** November 15, 2025

**Questions?** Refer to the relevant section above or contact the development team.

---
*Maintained by Highway 420 Administration Team*
