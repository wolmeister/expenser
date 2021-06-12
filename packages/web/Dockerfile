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
COPY public public
COPY tsconfig.json ./
COPY webpack.config.js ./
RUN pnpm build

# Release
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]