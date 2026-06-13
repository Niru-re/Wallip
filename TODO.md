- [x] Add MySQL auth implementation (login + signup) using Next.js server routes
- [x] Add MySQL tables + session storage SQL in `database/mysql-auth.sql`
- [x] Add dependencies (`mysql2`, `bcryptjs`) to `package.json`
- [x] Implement MySQL connection helper `src/lib/mysql.ts`
- [x] Implement API routes:
  - [x] `/api/auth/signup` (hash + insert user)
  - [x] `/api/auth/login` (verify + create session)
  - [x] `/api/auth/logout` (delete session + clear cookie)
  - [x] `/api/auth/me` (current session user)
- [x] Create pages:
  - [x] `/login`
  - [x] `/signup`
- [x] Configure `.env.local` sample for MySQL connection
- [ ] Run tests: signup -> login -> logout



