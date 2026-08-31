# Build stage: installs full dependencies (incl. devDependencies) and compiles TypeScript.
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production stage: only production dependencies + compiled output.
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY .sequelizerc ./
COPY src/config/database.js ./src/config/database.js
COPY src/migrations ./src/migrations
COPY src/seeders ./src/seeders

EXPOSE 3000

CMD ["node", "dist/server.js"]
