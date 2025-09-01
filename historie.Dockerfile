FROM node:20-slim AS builder
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --ignore-scripts

COPY . .
RUN yarn history-build

FROM node:alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json yarn.lock* ./

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.histoire/dist ./.histoire/dist


EXPOSE 3000
ENTRYPOINT ["npx", "serve", ".histoire/dist"]
