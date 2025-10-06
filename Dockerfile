FROM node:22-alpine AS base
WORKDIR /app

# install dependencies
COPY package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN corepack enable && corepack install
RUN FORCE_COLOR=true pnpm install --frozen-lockfile

# build the app
FROM base AS build
COPY . .
RUN --mount=type=cache,target=/app/.astro FORCE_COLOR=true pnpm run build


# Webapp based on caddy
FROM caddy:2.9-alpine AS runtime
WORKDIR /var/www/html


COPY --from=build /app/dist ./
COPY --from=build /app/Caddyfile /etc/caddy/Caddyfile