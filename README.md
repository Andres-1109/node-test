# RiwiMediCare Plus — Supply Request API

REST backend for RiwiMediCare Plus, a medication and medical supply distribution company. The API manages the full lifecycle of supply requests made by clinics to warehouses: registering clinics, managing medication inventory, creating supply requests, assigning them to a warehouse, tracking their status, and consulting request history per clinic.

## 1. Coder

Andres Felipe Giraldo Acosta

## 2. Clan

Node - Nest AM

## 3. Technologies used

- **Node.js 18+** with **Express 5** and **TypeScript** (strict mode)
- **PostgreSQL** with **Sequelize** ORM, migrations managed via **sequelize-cli**
- **JWT** (`jsonwebtoken`) for authentication and **bcrypt** for password hashing
- **zod** for request-body/DTO schema validation
- **multer** for the JSON-file seeding endpoint
- **swagger-jsdoc** + **swagger-ui-express** for interactive API documentation
- **ESLint** + **Prettier** for linting and formatting
- **Jest** + **ts-jest** for unit testing (services layer, repositories mocked)
- **Docker** + **Docker Compose** for local PostgreSQL and for containerizing the API itself

## 4. Installation instructions

```bash
# 1. Clone the repository
git clone https://github.com/Andres-1109/node-test
cd riwimedicare-plus-supply-request-api

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env
# then edit .env with your own values (see section 5)

# 4. Start PostgreSQL (via Docker Compose)
docker compose up -d db

# 5. Run the database migrations
npm run migrate
```

## 5. Environment variables (`.env.example`)

```env
# Application
PORT=3000
NODE_ENV=development

# PostgreSQL (matches docker-compose.yml service "db")
DB_HOST=localhost
DB_PORT=5434
DB_NAME=riwimedicare_plus
DB_USER=riwimedicare_user
DB_PASSWORD=change_me

# JWT
JWT_SECRET=change_me_to_a_long_random_string
JWT_EXPIRES_IN=1d
```

Copy this file to `.env` and replace `DB_PASSWORD` and `JWT_SECRET` with your own values. `DB_HOST=localhost` and `DB_PORT=5434` are correct when running the API directly on your machine against the Dockerized Postgres (which maps container port 5432 to host port 5434). If you run the API itself inside Docker Compose (see section 6), the `api` service overrides `DB_HOST`/`DB_PORT` internally to talk to the `db` service directly — you don't need to change your `.env` for that.

## 6. How to run the project

**Option A — API on your machine, PostgreSQL in Docker (recommended for development):**

```bash
docker compose up -d db      # start PostgreSQL only
npm run migrate              # apply migrations (first time / after pulling new migrations)
npm run dev                  # start the API with hot reload (ts-node-dev)
```

The API listens on `http://localhost:3000` by default (or whatever `PORT` you set in `.env`).

**Option B — everything in Docker (API + PostgreSQL):**

```bash
docker compose up -d --build
```

This builds the API image (multi-stage `Dockerfile`) and starts both the `db` and `api` services. The API container connects to `db` over the Compose network. To run migrations inside the container:

```bash
docker compose run --rm api npx sequelize-cli db:migrate
```

**Production build (without Docker):**

```bash
npm run build     # compiles TypeScript to dist/
npm start         # runs node dist/server.js
```

**Other useful scripts:**

```bash
npm run lint            # ESLint
npm test                # Jest unit tests
npm run test:coverage   # Jest unit tests with coverage report
npm run migrate:undo    # revert the last migration
```

## 7. How to use `POST /seed/upload`

This endpoint seeds the database from a `.json` file (`multipart/form-data`, field name `file`). It is **administrator-only**, so you need a JWT for a user with role `administrator` first.

A ready-to-use sample file is provided at `src/seeders/seed-data.json` (2 administrators, 2 request managers, 3 clinics with distinct `taxId`s, 2 warehouses, and 5 medications distributed across them).

**Step 1 — register an administrator (skip if you already have one):**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Admin User",
        "email": "admin@riwimedicare.com",
        "password": "Secret123",
        "role": "administrator"
      }'
```

Copy the `token` field from the response.

**Step 2 — upload the seed file:**

```bash
curl -X POST http://localhost:3000/seed/upload \
  -H "Authorization: Bearer <YOUR_ADMIN_JWT>" \
  -F "file=@src/seeders/seed-data.json;type=application/json"
```

A successful response returns `201` with the number of records inserted per entity:

```json
{ "users": 4, "clinics": 3, "warehouses": 2, "medications": 5 }
```

The upload is validated (file type, JSON syntax, and shape) before anything is inserted, and all inserts happen inside a single database transaction — if anything fails, nothing is left partially inserted. You can also test this endpoint from the Swagger UI (see section 9) using the "Try it out" button on `POST /seed/upload`.

## 8. GitHub repository

https://github.com/Andres-1109/node-test

## 9. API documentation (`/api-docs`)

Once the server is running, the full interactive Swagger UI is available at:

```
http://localhost:3000/api-docs
```

Every endpoint is documented there, including request/response examples for every possible status code. Protected endpoints show a lock icon and require a bearer JWT.

**Testing both roles via the Authorize button:**

1. Register two users with `POST /auth/register` (or use the ones from `src/seeders/seed-data.json`): one with `"role": "administrator"` and one with `"role": "requestManager"`.
2. Log in with `POST /auth/login` for the role you want to test, and copy the `token` from the response.
3. In the Swagger UI, click the **Authorize** button (top right, next to the lock icon).
4. Paste the token in the value field (just the raw JWT, no `Bearer ` prefix — Swagger adds it for you) and click **Authorize**, then **Close**.
5. Every request you send through "Try it out" will now include that token. Endpoints restricted to `administrator` (e.g. `POST /clinics`, `PUT /warehouses/{id}`, `DELETE /medications/{id}`, `PUT /supply-requests/{id}`) will return `403` if you try them while authorized as a `requestManager`. `administrator` has full access everywhere `requestManager` does (e.g. both can `POST /supply-requests` and `PUT /supply-requests/{id}/status`), so use the `requestManager` token specifically to confirm it gets `403` on the admin-only routes above.
6. To switch roles, click **Authorize** again, then **Logout**, then paste the other role's token and **Authorize** again.

## 10. Database backup

To generate the .sql backup, dump the database to `.sql` with:

```bash
docker exec -t riwimedicare-plus-db pg_dump -U riwimedicare_user -d riwimedicare_plus > backup.sql
```

`pg_dump` runs inside the `db` container (the official Postgres image already includes it), connects over the local socket, and the dump — schema plus data — is redirected to `backup.sql` on the host. Adjust `-U`/`-d` if you changed `DB_USER`/`DB_NAME` in your `.env`.

To restore it into an empty database:

```bash
docker exec -i riwimedicare-plus-db psql -U riwimedicare_user -d riwimedicare_plus < backup.sql
```
