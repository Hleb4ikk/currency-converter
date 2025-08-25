//App configuration.
export const appConfig = () => ({
  appPort: Number(process.env.APP_PORT!),

  database: {
    url: process.env.DATABASE_URL!,
  },
  cookies: {
    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE ?? 'lax',
    maxAge: Number(process.env.COOKIE_MAX_AGE ?? 86400000), // 1 day
    path: process.env.COOKIE_PATH ?? '/',
  },
  fxRatesApiKey: process.env.FX_RATES_API_KEY!,
  redis: {
    url: `redis://${process.env.REDIS_HOST ?? '127.0.0.1'}:${process.env.REDIS_PORT ?? 6379}`,
  },
  cacheTTLs: {
    sameRequests: Number(process.env.SAME_REQUESTS_CACHE_TTL ?? 300000),
    currenciesRequest: Number(
      process.env.CURRENCIES_REQUEST_CACHE_TTL ?? 3600000,
    ),
    ratesRequest: Number(process.env.BASE_TARGET_REQUEST_CACHE_TTL ?? 86400000),
  },
});
