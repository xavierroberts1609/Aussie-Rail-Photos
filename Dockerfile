# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
# Prisma's query engine needs OpenSSL to load; Alpine doesn't include it
# by default, and Prisma can't detect the right engine variant without it.
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
# Cap V8's heap during the build so it stays within what small VPS-class
# hosts (256-512MB RAM + swap) can actually handle, instead of growing
# unbounded and locking up the whole machine.
ENV NODE_OPTIONS="--max-old-space-size=384"
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV PORT=3000

# Standalone server + static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# Defense in depth: .dockerignore already keeps .env out of the build
# context, but strip any standalone-output .env just in case so no dev
# secrets can ever end up baked into the image.
RUN rm -f ./.env

# Prisma client + CLI + schema/migrations (needed at runtime for migrate
# deploy). Without node_modules/prisma present, `npx prisma` would try to
# download a fresh (mismatched, much larger) copy from npm at container
# startup, which is slow, needs network access, and can OOM a small VM.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder /app/prisma ./prisma

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
