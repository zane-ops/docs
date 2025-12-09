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


FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
USER node
CMD node ./dist/server/entry.mjs

