# Image Troubleshooting Notes

## Pre-roll images missing (sigdistro.com hotlinking + Next/Image)

**Date:** 2026-01-26

### Symptoms
- Pre-roll product cards showed broken images on the `/pre-rolls` page.
- Browser console showed image requests failing despite valid product data.

### Diagnosis
- Audited `/api/products/pre-rolls` results: all pre-roll items had valid `image_url` values.
- All image URLs were hosted on `sigdistro.com`.
- Next/Image optimization was attempting to proxy these hotlinked assets, which caused the images to fail.

### Root Cause
Next/Image optimization conflicted with hotlinked `sigdistro.com` assets on the pre-rolls page.

### Fix
Render `sigdistro.com` images without optimization on the pre-rolls page:

```tsx
<Image
  src={product.image_url}
  alt={product.name}
  fill
  unoptimized={product.image_url.includes("sigdistro.com")}
  className="object-cover group-hover:scale-110 transition-transform duration-300"
/>
```

### Verification
- Reloaded the pre-rolls page after the change.
- Images rendered correctly.

### Notes
- `sigdistro.com` is already included in `next.config.js` remote patterns; the issue was the optimizer path, not the allowlist.
- If this reappears on other pages, apply the same `unoptimized` conditional for `sigdistro.com` images.