export const formatResponseBody = (body: unknown) => {
  if (!body) return undefined;

  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body;

    return JSON.stringify(parsed, null, 2);
  } catch {
    return String(body);
  }
};
