# Hisobim

CRM for small shops: products, customers and a debt ledger. The frontend is Next.js 16; the API is Node.js + Express. This demo uses in-memory storage.

## Local launch

1. Copy `backend/.env.example` to `backend/.env` and set a long `JWT_SECRET`.
2. Run `npm install` in both `backend` and `frontend`.
3. In `backend`: `npm run dev`.
4. Copy `frontend/.env.example` to `frontend/.env.local`, then in `frontend` run `npm run dev`.
5. Open `http://localhost:3000` and create a seller account with a phone number.

## Deploy: Render API + Vercel frontend

1. Push this repository to GitHub.
2. In Render, create a Blueprint from the repository. It will read `render.yaml` and expose `/health`.
3. After Render gives you an API URL (for example `https://hisobim-api.onrender.com`), open its environment variables and set `CORS_ORIGINS` to `https://YOUR-VERCEL-PROJECT.vercel.app` (keep `http://localhost:3000` too, comma-separated, if needed).
4. In Vercel import the repository and set **Root Directory** to `frontend`. Add `BACKEND_URL=https://hisobim-api.onrender.com` and `NEXT_PUBLIC_APP_URL=https://YOUR-VERCEL-PROJECT.vercel.app` for Production and Preview as appropriate.
5. Deploy Vercel, then update Render `CORS_ORIGINS` with the final Vercel domain and redeploy Render.

The browser never stores the JWT itself: Next.js server actions call Render and keep the token in an HttpOnly cookie. `BACKEND_URL` must therefore be a server environment variable, without `NEXT_PUBLIC_`.

## Demo storage warning

Data is held only in the backend process memory. It is intentionally suitable for a demo: every Render restart, redeploy or free-tier sleep clears all users, products, customers and debts. No `DATABASE_URL`, Prisma migration or local PostgreSQL setup is needed.

## API overview

- `POST /seller/auth/register`, `POST /seller/auth/login`
- `GET /seller/me`
- `GET|POST /seller/products`
- `GET|POST /seller/clients`
- `GET|POST /seller/debts`; `POST /seller/debts/:id/payments`

## Production checklist

- Set the precise Vercel domain(s) in `CORS_ORIGINS`.
- Run `npm run build` in both applications before submitting.
