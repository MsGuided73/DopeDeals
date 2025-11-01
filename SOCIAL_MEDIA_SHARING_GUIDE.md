# 📱 Social Media Sharing & Link Preview Guide

## 🎯 **What Controls Link Previews**

When your website link is shared on social media, messaging apps, or other platforms, the preview is controlled by **meta tags** in your HTML `<head>`.

## 📍 **Where to Edit**

**File:** `app/layout.tsx`

The meta tags are defined in the `metadata` export at the top of the file.

## 🏷️ **Key Meta Tags You Can Customize**

### **1. Basic Information**
```typescript
export const metadata = {
  title: "HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop",
  description: "Life is Highway, Ride With Us. Premium smoking accessories, bongs, pipes, dab rigs, vaporizers & cannabis culture essentials. Free shipping over $75.",
  // ...
}
```

### **2. Open Graph (Facebook, LinkedIn, etc.)**
```typescript
openGraph: {
  title: 'HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop',
  description: 'Life is Highway, Ride With Us. Premium smoking accessories...',
  images: [{
    url: 'https://your-image-url.jpg',
    width: 1200,
    height: 630,
    alt: 'HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop',
  }],
}
```

### **3. Twitter/X Cards**
```typescript
twitter: {
  card: 'summary_large_image',
  title: 'HIGHWAY 420 - Premium Cannabis Culture & Smoke Shop',
  description: 'Life is Highway, Ride With Us...',
  images: ['https://your-image-url.jpg'],
  creator: '@yourtwitterhandle',
}
```

## 🔧 **How to Customize**

### **Change the Tagline/Description:**
1. Open `app/layout.tsx`
2. Find the `description` field in the `metadata` object
3. Update the text between the quotes
4. Save the file

### **Change the Preview Image:**
1. Update the `url` in both `openGraph.images[0].url` and `twitter.images[0]`
2. Make sure the image is:
   - At least 1200x630 pixels for Open Graph
   - Square or landscape orientation
   - Under 5MB in size
   - Hosted on a reliable CDN (like your Supabase storage)

### **Change the Title:**
1. Update the `title` field in the metadata object
2. This appears in browser tabs, search results, and social previews

## 🖼️ **Image Requirements**

### **Open Graph (Facebook, LinkedIn, Discord)**
- **Size:** 1200 x 630 pixels (1.91:1 ratio)
- **Format:** JPG, PNG, or GIF
- **Max size:** 5MB
- **Text space:** Keep important text within safe area

### **Twitter/X Cards**
- **Size:** 1200 x 675 pixels (16:9 ratio) or larger
- **Format:** JPG, PNG, or GIF
- **Max size:** 5MB

## 🧪 **Testing Your Changes**

### **Test Open Graph:**
1. Go to: https://opengraph.xyz/
2. Enter your website URL
3. Check the preview

### **Test Twitter Cards:**
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your website URL
3. Check the preview

### **Test Facebook:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your website URL
3. Click "Debug" and check the preview

## 📱 **Platform-Specific Behavior**

### **WhatsApp:**
- Uses Open Graph tags
- Shows large image with title and description

### **iMessage (iOS):**
- Uses Open Graph tags
- Shows compact preview with image

### **Discord:**
- Uses Open Graph tags
- Shows rich embed with image, title, and description

### **LinkedIn:**
- Uses Open Graph tags
- Shows professional preview with image

## ⚡ **Quick Updates**

### **Change Just the Description:**
```typescript
description: "Your new tagline goes here. Keep it under 160 characters for best results.",
```

### **Change Just the Image:**
```typescript
images: [{
  url: 'https://your-new-image-url.jpg',
  // ... rest stays the same
}],
```

### **Add Twitter Handle:**
```typescript
twitter: {
  // ... existing config
  creator: '@youractualtwitterhandle',
}
```

## 🎯 **Best Practices**

1. **Keep descriptions under 160 characters** for optimal display
2. **Use high-quality, branded images** that represent your business
3. **Test on multiple platforms** to ensure consistent appearance
4. **Update regularly** to reflect current promotions or branding
5. **Use your actual domain** in the `url` field once deployed

## 🔄 **After Making Changes**

1. Save `app/layout.tsx`
2. The development server will restart automatically
3. Test your changes using the validation tools above
4. If deployed, you may need to wait for social platforms to recrawl your site

**Remember:** Social platforms cache previews, so changes might not appear immediately. Use their debug tools to force refresh!
