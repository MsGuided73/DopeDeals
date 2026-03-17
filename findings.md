# Findings - Digital Ocean Migration

## Existing Documentation
- **`COOLIFY_SETUP_GUIDE.md`**: Contains a preliminary guide for Coolify deployment, including environment variables and Docker configuration. It lists 23 environment variables needed for production.
- **`SERVER_DEPLOYMENT_PLAN.md`**: Outlines a multi-site architecture (main, tobacco, admin) and a 2-instance Supabase configuration.
- **`Dockerfile`**: A standard Dockerfile exists in the root, configured for a Next.js build.
- **`nginx.conf.example`**: Provides a template for Nginx configuration, likely for use within the VPS or as a reverse proxy.

## Discovery Results (2026-03-17)
- **North Star**: Compliance-driven move, with expected performance gains from dedicated hardware.
- **Integrations**: Existing stack (Supabase, KajaPay, Didit) remains. No new integrations.
- **Source of Truth**: Supabase managed instance will remain the SSOT. The VPS will only host the application code and Coolify.
- **Delivery Payload**: Migration of existing domains (`dopedeals.com`, etc.) to the new server.
- **Compliance**: No specific location-based logic changes required at this stage.

## Current State
- **Server Status**: Selected (likely 4GB+ RAM for Coolify) but not yet purchased.
- **Deployment Strategy**: Coolify on Digital Ocean.
- **SSOT**: Managed Supabase.

## Integration Context
- **Supabase**: Primary database and authentication.
- **KajaPay**: Payment processor.
- **Didit**: Age verification.
- **Zoho/Airtable**: Background sync services.
- **OpenAI**: AI features.

## Risks & Constraints
- The multi-site architecture described in `SERVER_DEPLOYMENT_PLAN.md` requires careful routing and potentially multiple droplets or sophisticated Coolify project configuration.
- Environment variables must be securely transferred to the production environment.
- Compliance rules (zipcode blocking) must be verified in the US-based US environment.
