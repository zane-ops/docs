# Webapp based on caddy
FROM caddy:2.8-alpine

LABEL org.opencontainers.image.source = "https://github.com/zane-ops/docs"

WORKDIR /var/www/html

COPY ./dist/ ./
COPY ./Caddyfile /etc/caddy/Caddyfile