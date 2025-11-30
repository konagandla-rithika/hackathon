# Backend for the Vite frontend

This is a minimal Node/Express development backend to use with the frontend in this workspace.

Quick start

1. Open a terminal in `frontend/backend`.
2. Install dependencies:

```powershell
npm install
```

3. Start server in dev mode (auto-restart with changes):

```powershell
npm run dev
```

Server runs on `http://localhost:5000` by default. API endpoints are under `http://localhost:5000/api`.

Example endpoints

- `GET /api/products` — list products
- `POST /api/products` — add a product (dev only)
- `POST /api/contact` — submit contact message
- `POST /api/login` — mock login (username/password checked against `data.json`)
- `POST /api/register` — register a new user (stores hashed password)
- `POST /api/login` — login verifies hashed password and returns a dev token
- `GET /api/customers` — list customers
- `GET /api/customers/:id` — get a customer by id
- `POST /api/customers` — create a new customer (fields: `name` (required), `email` (required, validated), `phone` (optional, validated), `address` (optional))
- `PUT /api/customers/:id` — update customer details (pass fields to update; `email` and `phone` are validated)
- `DELETE /api/customers/:id` — delete a customer

Connect from Vite frontend

In development, configure a proxy in `vite.config.js` to forward `/api` requests to the backend. Example:

```js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

Notes & next steps

- This backend uses `data.json` for simple file-based persistence (development only).
- For production replace with a proper database (Postgres, MySQL, MongoDB) and secure auth.
- If you'd like, I can add a Postgres + Sequelize or MongoDB + Mongoose example next.
 
Security notes

- Passwords are hashed with `bcryptjs` before being stored in `data.json` for development convenience.
- This file-based approach is for development only — use a database and secure password practices (strong hashing, salted, rate-limiting) in production.
