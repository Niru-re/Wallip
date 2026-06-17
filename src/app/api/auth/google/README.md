Google OAuth routes

- GET /api/auth/google
  Redirects to Google consent screen.

- GET /api/auth/google/callback
  Handles OAuth callback, creates/loads user in MySQL, and sets wallip_session cookie.

Required env:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI (must match Google console redirect)
- GOOGLE_OAUTH_SCOPE (optional; defaults to "openid email profile")

