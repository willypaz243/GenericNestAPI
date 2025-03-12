# Stage 1: Base image setup
FROM debian:stable-slim AS base

# Install necessary dependencies
RUN apt-get update \
    && apt-get install -y \
    curl \
    ca-certificates \
    --no-install-recommends

# Set up bash environment for Volta
SHELL ["/bin/bash", "-c"]
ENV BASH_ENV=~/.bashrc
ENV VOLTA_HOME=/root/.volta
ENV PATH=$VOLTA_HOME/bin:$PATH
RUN curl https://get.volta.sh | bash
RUN volta install node@22.14.0
RUN volta install pnpm@latest


# Stage 2: Builder stage
FROM base AS builder

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig*.json ./
COPY src ./src

RUN pnpm install
RUN pnpm build
# RUN pnpm migrations:runjs

# Stage 3: Runner stage
FROM base AS runner

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package.json .

CMD ls -la && pnpm migrations:runjs && node dist/main