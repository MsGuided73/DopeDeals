# Highway 420 Image Dimensions Guide

This document tracks the standard image dimensions and aspect ratios required for the Highway 420 frontend application.

## Hero Carousel

The Fullscreen Carousel on the landing page uses dynamic aspect ratios to maintain a cinematic, short-height presentation (often referred to as a "half-height" banner).

### Aspect Ratios
*   **Desktop/Tablet:** `15:4` (approx. `3.75:1`)
*   **Mobile:** `2:1`

### Required Asset Dimensions

To ensure images fit perfectly into the updated carousel without any cropping on standard screens, use the following dimensions:

**For Desktop/Tablet:**
*   **1920 x 512 pixels** (Standard HD monitors)
*   **2560 x 682 pixels** (For super-crisp resolution on 4K/Retina displays)

**For Mobile:**
*   **800 x 400 pixels**

### Single Image Strategy (Recommended)

If you prefer to design a single responsive asset rather than managing separate desktop and mobile images, use the base desktop resolution: **1920 x 512 pixels**.

**How it scales:**
Because the mobile screen is slightly *taller* relative to its width (32:9) compared to desktop (42:9), the CSS (`object-fit: cover`) will automatically zoom in slightly and trim off the far left and right edges on phones. 

**Design Rule:** Keep logos, text, or main visual focal points centered within the "safe zone" so they aren't cropped out on mobile devices.
