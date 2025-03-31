FROM oven/bun:1-slim AS build-env

WORKDIR /usr/src/app
COPY . /usr/src/app
COPY ./package.json bun.lockb /usr/src/app/
RUN FORCE_COLOR=true bun install --frozen-lockfile

RUN FORCE_COLOR=true bun run build

FROM caddy:2.9-alpine as production

LABEL org.opencontainers.image.source = "https://github.com/zane-ops/docs"

WORKDIR /var/www/html

COPY --from=build-env /usr/src/app/dist ./
COPY ./Caddyfile /etc/caddy/Caddyfile