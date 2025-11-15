# Post-Deployment Glitches & Bug Tracker

This document tracks issues discovered after deployment that need to be addressed.

## User Feedback System

A floating feedback button has been implemented on all pages of the live website. Users can click this button to report bugs, suggest design improvements, or request features. All submissions are automatically formatted and added to this document as new issues.

**How it works:**
- Users click the green "Feedback" button in the bottom-right corner
- A modal opens with a form to categorize and describe their feedback
- Submissions are sent to `/api/feedback` endpoint
- New issues are automatically appended to this document with proper formatting
- Each issue gets a unique number and follows the standard template

**Feedback Categories:**
- 🐛 Bug Report - Technical issues and glitches
- 🎨 Design Issue - Visual or UX problems
- ✨ Feature Request - New functionality suggestions
- 💭 Other - General feedback

---

## Issue #1: Collections Grid Image Flickering on Hover

**Date Reported:** November 1, 2025
**Component:** `app/components/CollectionsGrid.tsx`
**Affected Element:** 2x2 grid card (Highway 420 hero image)
**Browser/Device:** All browsers
**Severity:** Medium (UI annoyance)
**Status:** Open

### Description
The large 2x2 grid card image in the collections grid flickers when the mouse hovers over it. The flickering occurs during the hover transition effects.

### Steps to Reproduce
1. Navigate to the homepage
2. Locate the collections grid section
3. Hover over the large 2x2 card (Highway 420 image)
4. Observe flickering during the hover animation

### Technical Details
**Current Implementation:**
```jsx
<a
  href="/ride-with-us"
  className="col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-lg relative group hover:scale-105 transition-transform duration-300 block"
>
  <img src={logoPath} alt="Highway 420" className="w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-black/50 group-hover:to-transparent transition-all duration-300" />
  <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <LogoButton href="/ride-with-us" label="RIDE WITH US" />
  </div>
</a>
```

**Potential Causes:**
- Multiple CSS transitions conflicting (scale + gradient + opacity)
- Image rendering issues during transform
- Z-index stacking problems with overlay elements
- CSS transition timing conflicts

### Proposed Solutions
1. **Simplify transitions:** Reduce the number of simultaneous transitions
2. **Use transform3d:** Add `transform: translateZ(0)` to enable hardware acceleration
3. **Adjust timing:** Stagger transition delays to prevent conflicts
4. **Optimize image loading:** Ensure image is properly cached/preloaded

### Priority
- High: Affects user experience on main page
- Medium: Not breaking functionality, just visual annoyance

### Assigned To
[Unassigned]

### Notes
- Issue occurs on both desktop and mobile hover states
- Similar hover effects on smaller cards work without flickering
- May be related to the large image size (2x2 grid span)

---



## Issue #2: 🐛 Bug Report

**Date Reported:** November 1, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3000
**Browser/Device:** Chrome
**Severity:** Medium
**Status:** Open

### Description
Testing email functionality

### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3000

### Technical Details
**User Agent:** Chrome
**Page URL:** http://localhost:3000
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
No contact information provided
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #3: 🐛 Bug Report

**Date Reported:** November 3, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3004/products
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
The Add to Cart button is not working from the /products page

### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3004/products

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3004/products
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
**Contact Info:** DCB
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #4: 🐛 Bug Report

**Date Reported:** November 3, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3004/(public)/auth?redirectTo=%2Faccount
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
sign in/sign up is not working.  Need to link the auth form

### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3004/(public)/auth?redirectTo=%2Faccount

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3004/(public)/auth?redirectTo=%2Faccount
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
**Contact Info:** dcb
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #5: 🐛 Bug Report

**Date Reported:** November 13, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3000/privacy
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
Need to remove Dope City references within privacy page


### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3000/privacy

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3000/privacy
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
**Contact Info:** DB
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #6: 🐛 Bug Report

**Date Reported:** November 13, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3000/product/72b56efd-6419-4e60-9283-af75786040fa
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
Need to import global highway420 footer


### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3000/product/72b56efd-6419-4e60-9283-af75786040fa

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3000/product/72b56efd-6419-4e60-9283-af75786040fa
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
No contact information provided
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #7: 🐛 Bug Report

**Date Reported:** November 13, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3000/product/72b56efd-6419-4e60-9283-af75786040fa
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
Need to clean up descriptions


### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3000/product/72b56efd-6419-4e60-9283-af75786040fa

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3000/product/72b56efd-6419-4e60-9283-af75786040fa
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
No contact information provided
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #8: 🐛 Bug Report

**Date Reported:** November 13, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3000/pipes
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
Change free shipping to $75.00


### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3000/pipes

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3000/pipes
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
No contact information provided
- Submitted via user feedback form
- Requires investigation and validation

---



## Issue #9: 🐛 Bug Report

**Date Reported:** November 13, 2025
**Component:** User Feedback
**Affected Element:** http://localhost:3000/products?category=accessories
**Browser/Device:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Severity:** Medium
**Status:** Open

### Description
Add to cart on this products/accessories page is not working


### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: http://localhost:3000/products?category=accessories

### Technical Details
**User Agent:** Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Sa...
**Page URL:** http://localhost:3000/products?category=accessories
**Feedback Type:** 🐛 Bug Report

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- Medium: 🐛 bug report

### Assigned To
[Unassigned]

### Notes
No contact information provided
- Submitted via user feedback form
- Requires investigation and validation

---

## Template for New Issues

**Issue Title:** [Brief description]

**Date Reported:** [Date]
**Component:** [File path]
**Affected Element:** [Specific element/class]
**Browser/Device:** [Affected platforms]
**Severity:** [Critical/High/Medium/Low]
**Status:** [Open/In Progress/Resolved]

### Description
[Detailed description of the issue]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Technical Details
[Code snippets, error messages, etc.]

### Proposed Solutions
1. [Solution 1]
2. [Solution 2]

### Priority
- [Priority level]: [Reasoning]

### Assigned To
[Assignee]

### Notes
[Additional context]
