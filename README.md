# 📘 Currency Converter (Backend)

A backend application for currency conversion. It acts as a middleware between the client application and external APIs providing exchange rate information.
Features include caching, user preferences storage, and API documentation via Swagger.

## ✨ Features

- Currency conversion using external API.

- Data caching for performance optimization:

  - 24h cache for any **base-target** pair (stored in DB).

  - 5 min cache for repeated requests from the same user (in-memory via Redis).

- User preferences management (stored in Supabase).

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

## 📂 Endpoints

**GET /api/currencies**

Returns a list of supported currencies (ISO4217).
Cached for 1 hour.

**GET /api/rates**

Returns exchange rates for a given currency.
Query params:

**base** — base currency (default: user preference or USD).

**targets** — comma-separated list of currencies (EUR,GBP,JPY).

**GET /api/user**

Returns user settings (based on cookie user_id).

**POST /api/user**

Updates user settings (based on cookie user_id).

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

See **.env.example**.

Examples provided for:

- .env.development — local development.

- .env.production — production.

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Run Redis

Using Docker (recommended for development):

```bash
docker run -d -p 6379:6379 redis
```

Or run locally / via cloud (e.g. Upstash
).

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

Watch mode:

```bash
npm run test:watch
```

Coverage report:

```bash
npm run test:coverage
```

## 📖 API Documentation

Available at:
👉 **http://localhost:8080/api**
