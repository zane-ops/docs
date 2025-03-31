FROM node:lts-alpine AS base

ARG ZANE_DOMAINS
ENV ZANE_DOMAINS=$ZANE_DOMAINS

# Install bun
RUN npm install -g bun

# Install packages
WORKDIR /usr/src/app
COPY . /usr/src/app
COPY ./package.json bun.lockb /usr/src/app/
RUN FORCE_COLOR=true bun install --frozen-lockfile

# run build
RUN FORCE_COLOR=true bun run build

FROM caddy:2.9-alpine as production

LABEL org.opencontainers.image.source = "https://github.com/zane-ops/docs"

WORKDIR /var/www/html

COPY --from=build-env /usr/src/app/dist ./
COPY ./Caddyfile /etc/caddy/Caddyfile