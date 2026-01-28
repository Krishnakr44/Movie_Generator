/**
 * JWT sign/verify using jose (works in Node and Edge for middleware).
 * Payload: { sub: userId, iat, exp }.
 */

import * as jose from "jose";
import { getJwtSecret, getJwtExpiresIn } from "./env";

const alg = "HS256";

/** Default expiration from env (e.g. "7d"). */
function getExpiration(): string {
  return getJwtExpiresIn();
}

export async function signToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode(getJwtSecret());
  return new jose.SignJWT({})
    .setProtectedHeader({ alg })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(getExpiration())
    .sign(secret);
}

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

/** Returns payload or null if invalid/expired. Uses constant-time where applicable. */
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [alg],
    });
    const sub = payload.sub;
    if (typeof sub !== "string" || !sub) return null;
    return { sub, iat: payload.iat as number | undefined, exp: payload.exp as number | undefined };
  } catch {
    return null;
  }
}
