# Task Plan - Server Migration to Digital Ocean

## Goal
Successfully migrate the Highway420 application (main site, tobacco site, and admin dashboard) to a US-based Digital Ocean VPS using Coolify for deployment management.

## Phases

### Phase 1: Blueprint & Discovery
- [ ] Answer discovery questions (User input required)
- [ ] Define environment variable requirements for production
- [ ] Confirm domain and DNS strategy

### Phase 2: Link (Connectivity)
- [ ] Verify access to Digital Ocean VPS
- [ ] Install/Verify Coolify on VPS
- [ ] Test connectivity between VPS and Supabase/KajaPay APIs

### Phase 3: Architect (Preparation)
- [ ] Standardize `Dockerfile` for production
- [ ] Finalize production environment variable list
- [ ] Validate build process locally

### Phase 4: Stylize & Refine
- [ ] Configure custom domains and SSL in Coolify
- [ ] Refine production-specific configurations (CORS, URLs)

### Phase 5: Trigger (Deployment)
- [ ] Execute deployment via Coolify
- [ ] Verify application health post-deployment
- [ ] Perform smoke tests on core features (Orders, Payments, Compliance)
