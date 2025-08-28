# 📘 Currency Converter (Backend)

A backend application for currency conversion. It acts as a middleware between the client application and external APIs providing exchange rate information.
Features include caching, user preferences storage, and API documentation via Swagger.

## ✨ Features

- Currency conversion using external API.
- **External exchange rate provider:** [fxratesapi.com](https://fxratesapi.com/) (authenticated with `FX_RATES_API_KEY`).
- Data caching for performance optimization:

  - 24h cache for any **base-target** pair (stored in DB).
  - 5 min cache for repeated requests from the same user (in-memory via Redis).

- User preferences management (stored in Supabase/Postgres).
- Automatic **httpOnly** cookie **user_id** assignment on first request.
- API documentation with Swagger.

## 🚀 Tech Stack

- Node.js (LTS)
- NestJS
- TypeScript
- Supabase (user preferences storage)
- Redis (caching)
- Axios (external API requests)
- Swagger (API documentation)
- **fxratesapi.com** (exchange rate data source)

## 📂 Endpoints

**GET /api/currencies**
Returns a list of supported currencies (ISO4217). Cached for 1 hour.

**GET /api/rates**
Returns exchange rates for a given currency. Query params:

- **base** — base currency (default: user preference or USD).
- **targets** — comma-separated list of currencies (EUR,GBP,JPY).

**GET /api/user**
Returns user settings (based on cookie `user_id`).

**POST /api/user**
Updates user settings (based on cookie `user_id`).

## 🗄️ User Data Structure (Supabase)

```js
{
  user_id: string, // UUID (primary key)
  base_currency: string, // ISO4217 (e.g., "USD")
  favorites: string[], // array of currency codes
  created_at: string, // ISO8601
  updated_at: string // ISO8601
}
```

## ⚙️ Setup & Run

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/currency-converter.git
cd currency-converter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env files

See examples below for: `.env`, `.env.development.local`, and `.env.production.local`.

### 4. Generate Prisma client

```bash
npx prisma generate
```

> **Note:** `DATABASE_URL` must be present in `.env` before running `prisma generate`.

### 5. Run Redis

Using Docker (recommended for development):

```bash
docker run -d -p 6379:6379 redis
```

Or run locally / via cloud (e.g. Upstash).

### 6. Start the app

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm run start:prod
```

## 🧪 Testing

Using Vitest.

Run tests:

```bash
npm run test
```

## 📖 API Documentation

Available at:
👉 **[http://localhost:8080/api](http://localhost:8080/api)**

---

## 🔑 Environment Variables

Create the following files at the project root.

### `.env`

> Database must be here to use it in `npx prisma generate`.

```env
# Prisma / Database (Supabase Postgres or any Postgres-compatible DB)
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>"
```

### `.env.development.local`

```env
# App port
APP_PORT="8080"

# Cookie settings
COOKIE_HTTP_ONLY="true"
COOKIE_SECURE="false"
COOKIE_SAME_SITE="lax"
COOKIE_MAX_AGE="86400000"
COOKIE_PATH="/"

# Exchange Rate API

FX_RATES_API_KEY="<Your API Key>"

# Redis settings
REDIS_HOST = "<redis host>"
REDIS_PORT = "<redis port>"

#Cache TTLs
SAME_REQUESTS_CACHE_TTL = "300000"
CURRENCIES_REQUEST_CACHE_TTL = "3600000"
BASE_TARGET_REQUEST_CACHE_TTL = "86400000"
```

### `.env.production.local`

```env
# App port
APP_PORT="8080"

# Cookie settings
COOKIE_HTTP_ONLY="true"
COOKIE_SECURE="true"
COOKIE_SAME_SITE="strict"
COOKIE_MAX_AGE="86400000"
COOKIE_PATH="/"

# Exchange Rate API

FX_RATES_API_KEY="<Your API Key>"

# Redis settings
REDIS_HOST = "<redis host>"
REDIS_PORT = "<redis port>"

#Cache TTLs
SAME_REQUESTS_CACHE_TTL = "300000"
CURRENCIES_REQUEST_CACHE_TTL = "3600000"
BASE_TARGET_REQUEST_CACHE_TTL = "86400000"
```
