FROM node:22-alpine AS base
WORKDIR /app

# install dependencies
COPY package.json ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN corepack enable && corepack install


FROM base AS build-deps
RUN FORCE_COLOR=true pnpm install --frozen-lockfile

FROM base AS prod-deps
RUN FORCE_COLOR=true pnpm install --frozen-lockfile --prod


# build the app
FROM build-deps AS build
COPY . .
ARG BASE_URL
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ENV BASE_URL=${BASE_URL}
RUN --mount=type=cache,target=/app/.astro FORCE_COLOR=true pnpm run build
RUN --mount=type=cache,target=/app/.astro FORCE_COLOR=true pnpm run db:migrate


FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "./dist/server/entry.mjs"]

