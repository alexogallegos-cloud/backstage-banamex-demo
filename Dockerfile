# Multi-stage Dockerfile para Railway
# Etapa 1: Build completo (frontend + backend)
FROM node:24-bookworm-slim AS build

RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 g++ build-essential libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# 4 GB heap para que el webpack de Backstage no haga OOM
ENV NODE_OPTIONS="--max_old_space_size=4096"

RUN yarn install --immutable
RUN yarn tsc
RUN yarn build:backend

# Etapa 2: Imagen de runtime (solo deps de producción)
FROM node:24-bookworm-slim AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Usuario sin root para seguridad
USER node
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS="--no-node-snapshot"

# Skeleton = estructura de package.json de todos los workspaces
COPY --chown=node:node --from=build /app/.yarn ./.yarn
COPY --chown=node:node --from=build /app/.yarnrc.yml ./
COPY --chown=node:node --from=build /app/backstage.json ./
COPY --chown=node:node --from=build /app/yarn.lock ./
COPY --chown=node:node --from=build /app/package.json ./
COPY --chown=node:node --from=build /app/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Instalar solo deps de producción
RUN yarn workspaces focus --all --production && yarn cache clean

# Catálogo Banamex + bundle compilado + configs
COPY --chown=node:node --from=build /app/examples ./examples
COPY --chown=node:node --from=build /app/packages/backend/dist/bundle.tar.gz ./
COPY --chown=node:node --from=build /app/app-config*.yaml ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

CMD ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]