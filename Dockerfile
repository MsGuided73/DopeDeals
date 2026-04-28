# ---- base ----
FROM ghcr.io/railwayapp/nixpacks:ubuntu-1745885067 AS base
WORKDIR /app

# Corepack / pnpm pinned
RUN npm install -g corepack@0.24.1 && corepack enable \
 && corepack prepare pnpm@9.15.9 --activate

# ---- deps (installs from manifests only) ----
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 \
    pnpm install --frozen-lockfile

# ---- build ----
FROM deps AS build
WORKDIR /app
COPY . .
# Cap build-time Node heap at 1.5 GB — prevents OOM-kill mid-compilation on host with ~3GB available RAM.
# next build is the most memory-hungry step (Three.js, AI SDKs, 44+ routes).
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN pnpm build

# ---- run ----
FROM base AS runner
WORKDIR /app

# Prefer minimal runtime with Next.js standalone
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Cap runtime Node heap at 1 GB
ENV NODE_OPTIONS="--max-old-space-size=2048"

EXPOSE 3000
CMD ["node", "server.js"]


