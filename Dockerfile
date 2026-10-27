# The Next.js app as a standalone server.
#
# The editor packages are installed from vendor/excalidraw/*.tgz, which
# `npm run excalidraw:build` creates from ../excalidraw (along with
# public/fonts). Both are gitignored, so run that script before building.

FROM node:24-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 NEXT_OUTPUT=standalone
COPY package.json package-lock.json ./
COPY vendor ./vendor
RUN npm ci
COPY . .
# The /api rewrite to the backend is fixed at build time.
ARG BACKEND_URL=http://backend:8000
ENV BACKEND_URL=$BACKEND_URL
RUN test -d public/fonts || (echo "public/fonts is missing: run npm run excalidraw:build first" && exit 1)
RUN npm run build

FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
