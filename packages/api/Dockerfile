# Base Node
FROM node:14-alpine AS base
WORKDIR /app
RUN npm add -g pnpm

# Install all dependencies
FROM base AS dependencies
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM dependencies AS build
WORKDIR /app
ENV NODE_ENV=production
COPY src src
COPY tsconfig.json ./
RUN pnpm build

# Release
FROM base AS release
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY --from=build /app/dist dist
RUN pnpm install --frozen-lockfile

CMD ["node", "dist/src/index.js"]