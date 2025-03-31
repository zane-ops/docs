FROM node:lts-alpine AS builder

ARG ZANE_DOMAINS
ENV ZANE_DOMAINS=$ZANE_DOMAINS
ENV FORCE_COLOR=true

# install pnpm
RUN npm install -g pnpm@8

# Install packages
WORKDIR /usr/src/app
COPY package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# run build
COPY . ./
RUN pnpm run build

### Production phase
FROM caddy:2.9-alpine as production

LABEL org.opencontainers.image.source = "https://github.com/zane-ops/docs"

WORKDIR /var/www/html

COPY --from=builder /usr/src/app/dist ./
COPY ./Caddyfile /etc/caddy/Caddyfile