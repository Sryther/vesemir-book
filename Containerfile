# syntax=docker/dockerfile:1
# =============================================================================
# Hardened, minimal image for "Le Grimoire de Vesemir".
# Multi-stage: build the Vite app with Node, then serve the static output with
# the unprivileged NGINX image (non-root, listens on 8080).
# =============================================================================

# ---- Build stage -----------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

# Install deps from the lockfile first (better layer caching).
COPY package.json package-lock.json ./
RUN npm ci

# Build the static site into /app/dist.
COPY . .
RUN npm run build

# ---- Runtime stage ---------------------------------------------------------
# Unprivileged NGINX (non-root, listens on 8080), Alpine-based for a tiny surface.
# For production, pin by digest, e.g.:
#   FROM nginxinc/nginx-unprivileged:1.27-alpine@sha256:<digest>
# Resolve the current digest with:
#   docker buildx imagetools inspect nginxinc/nginx-unprivileged:1.27-alpine
FROM nginxinc/nginx-unprivileged:1.27-alpine AS runtime

# Run as the built-in unprivileged "nginx" user (UID 101) — never root.
USER 101

# Hardened server config + built static site.
COPY --chown=101:0 nginx.conf /etc/nginx/nginx.conf
COPY --chown=101:0 --from=build /app/dist/ /usr/share/nginx/html/

EXPOSE 8080

# Built-in healthcheck mirrors the Kubernetes probe.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["sh", "-c", "wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1"]

CMD ["nginx", "-g", "daemon off;"]
