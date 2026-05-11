function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function buildCorsOptions() {
  const frontendOrigins = (process.env.FRONTEND_ORIGIN ?? '')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  return {
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(origin);
      const isAllowedOrigin =
        frontendOrigins.includes(normalizedOrigin) ||
        /^http:\/\/localhost:\d+$/.test(normalizedOrigin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(normalizedOrigin);

      callback(null, isAllowedOrigin);
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Lover-Password'],
  };
}
