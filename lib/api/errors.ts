/**
 * Centralized API error responses and status codes.
 */
export function apiError(
  message: string,
  status: number = 400
): Response {
  return Response.json({ error: message }, { status });
}

export function notFound(message: string = "Not found"): Response {
  return apiError(message, 404);
}

export function rateLimited(message: string = "Too many requests"): Response {
  return Response.json(
    { error: message },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}

export function serverError(
  message: string = "Internal server error"
): Response {
  return apiError(message, 500);
}
