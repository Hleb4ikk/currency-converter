export const appConfig = () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  cookies: {
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE ?? 'lax',
    maxAge: Number(process.env.COOKIE_MAX_AGE ?? 86400000), // 1 day
    path: process.env.COOKIE_PATH ?? '/',
  },
  currencyFreaksUrl: process.env.CURRENCY_FREAKS_API_URL,
});
