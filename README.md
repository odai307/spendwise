# SpendWise

SpendWise is a full-stack personal finance tracker with authentication, transaction management, monthly budgets, and high-level reporting.

## Features
- JWT-based auth (register, login, profile updates, password change)
- Transactions CRUD with filters, search, pagination, and summary totals
- Monthly budgets with per-category limits and spending status
- Reports view using live transaction totals
- User settings for name and preferred currency

## Tech Stack
**Frontend**
- React + Vite
- Tailwind CSS
- React Router
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Joi validation
- JWT auth

## Project Structure
```
client/   # React app (Vite)
server/   # Express API
```

Note: `design/` contains local-only architecture and raw HTML assets and is excluded from git.

## Getting Started

### 1) Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### 2) Environment variables
Create these files locally (examples below):

`server/.env`
```
PORT=3000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
```

`client/.env`
```
VITE_API_URL=http://localhost:3000
```

### 3) Run the apps
```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

Frontend runs on `http://localhost:5173` and the API runs on `http://localhost:3000`.

## API Overview
All protected routes require:
```
Authorization: Bearer <token>
```

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `PATCH /api/auth/me/password`

### Transactions
- `GET /api/transactions`
- `GET /api/transactions/:id`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/transactions/summary`
- `GET /api/transactions/categories`

### Budgets
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/budgets/status`

## Notes
- Update `CLIENT_URL` and `VITE_API_URL` if you change ports.
- Store secrets only in `.env` (not committed to git).
