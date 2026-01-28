# Authentication System

Production-grade auth: register, login, logout, forgot/reset password, JWT in httpOnly cookies, protected routes.

## Env (required)

```env
MONGODB_URI=...
JWT_SECRET=...   # Min 32 chars (e.g. openssl rand -hex 32)
JWT_EXPIRES_IN=7d
APP_URL=http://localhost:3000   # Used for reset-password link
```

## Folder structure

```
lib/
  auth/
    env.ts         # getJwtSecret, getJwtExpiresIn, getAppUrl
    jwt.ts         # signToken, verifyToken (jose)
    cookies.ts     # getAuthCookieFromHeader, buildSetAuthCookie, buildClearAuthCookie
    resetToken.ts  # generateResetToken, hashResetToken, secureCompare
    validate.ts    # Zod schemas: register, login, forgot, reset
    index.ts
  db/schemas/
    user.ts        # User model (email, password, resetPasswordToken, resetPasswordExpires)
app/api/auth/
  register/route.ts    # POST — create user, set cookie
  login/route.ts       # POST — verify credentials, set cookie
  logout/route.ts      # POST — clear cookie
  me/route.ts          # GET — current user from cookie
  forgot-password/route.ts  # POST — set reset token, log link
  reset-password/route.ts   # POST — validate token, set new password
middleware.ts          # Protects /dashboard, /story; redirects to /login
app/
  login/page.tsx
  register/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx
  dashboard/page.tsx   # Example protected page
lib/api/
  authClient.ts        # Frontend: register, login, logout, me, forgotPassword, resetPassword
```

## API

- **POST /api/auth/register** — Body: `{ email, password }`. Returns `{ user: { id, email, createdAt } }`. Sets httpOnly cookie.
- **POST /api/auth/login** — Body: `{ email, password }`. Same response and cookie.
- **POST /api/auth/logout** — Clears cookie. Returns `{ ok: true }`.
- **GET /api/auth/me** — Returns `{ user }` if cookie valid; 401 otherwise.
- **POST /api/auth/forgot-password** — Body: `{ email }`. Same success message whether user exists (no enumeration). Reset link logged to server console in dev.
- **POST /api/auth/reset-password** — Body: `{ token, password }`. Token from email link query.

## Security

- Passwords hashed with bcrypt (12 rounds). Never returned in API.
- JWT in httpOnly cookie (SameSite=Lax, Secure in prod). Not in JSON body.
- Reset token: crypto random, stored hashed (SHA-256); expiry 1 hour.
- Login uses constant-time behaviour (dummy hash compare when user missing).
- Middleware clears cookie and redirects to login when JWT invalid or expired.

## Protected routes

Edit `middleware.ts`: `PROTECTED_PATHS` and `config.matcher`. Default: `/dashboard`, `/story`. Unauthenticated users redirect to `/login?from=<path>`.

## Frontend usage

```ts
import { authClient } from "@/lib/api/authClient";

// Register / login (cookie set by server)
const { data, error, status } = await authClient.register(email, password);
const { data, error } = await authClient.login(email, password);

// Logout (cookie cleared)
await authClient.logout();

// Current user (e.g. after page load)
const { data } = await authClient.me(); // data.user | undefined

// Forgot / reset
await authClient.forgotPassword(email);
await authClient.resetPassword(token, newPassword);
```

Use `credentials: "include"` (already in authClient) so the browser sends the httpOnly cookie on same-origin requests.
