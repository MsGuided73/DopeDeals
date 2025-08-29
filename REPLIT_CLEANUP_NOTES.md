# Replit Cleanup Notes

This repository has been updated to remove Replit-specific configuration:

- Deleted `.replit` file
- Removed Replit plugins from `vite.config.ts` (runtime error modal, cartographer) and `process.env.REPL_ID` checks
- Removed `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal` from devDependencies
- No package.json scripts use Replit-specific commands

Next steps:
- Standard dev workflow is Next.js: `pnpm dev`, build with `pnpm build`, start with `pnpm start`
- If deploying with platforms like Vercel, Netlify, or Render, configure environment variables via their dashboards (.env.local for local)
- For legacy Vite client removal, follow the migration plan to port remaining pages/components to `app/` then remove `client/` and Vite

