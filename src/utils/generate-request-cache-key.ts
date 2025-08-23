//function that generates key for same-requests cache.
export const generateRequestCacheKey = (
  userId: string,
  method: string,
  query: string,
  path: string,
): string => {
  return `${method}:${path}:${query}:${userId}`;
};
