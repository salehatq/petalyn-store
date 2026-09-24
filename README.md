# Petalyn

A full-stack ecommerce storefront for flowers, built with React, Vite, Node.js, Express, MongoDB, and Cloudinary.

## What is included

- Responsive customer storefront
- Product catalogue and search
- Persistent shopping cart
- Server-side order total calculation
- Admin login with hashed passwords
- HTTP-only JWT authentication
- CSRF protection for authenticated mutations
- Protected admin product CRUD
- Cloudinary image uploads
- MongoDB persistence
- Security headers and rate limiting
- Production-oriented environment configuration

## Stack

**Frontend**
- React 19
- Vite 8
- React Router
- Axios
- React Icons
- React Toastify

**Backend**
- Node.js
- Express 5
- MongoDB + Mongoose
- Cloudinary + Multer
- bcryptjs
- JSON Web Tokens
- Helmet
- CORS
- Express Rate Limit

## Project structure

```text
petalyn/
├── frontend/   # React + Vite storefront and admin UI
├── backend/    # Express API, MongoDB models and Cloudinary uploads
├── render.yaml # Render backend deployment configuration
└── README.md
```

## Local development

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `MONGODB_URI`, Cloudinary credentials, and a strong `JWT_SECRET` (32+ characters, or as you wish :).

Then start the API:

```bash
npm run dev
```

### 2. Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

The frontend defaults to `http://localhost:5173` and the API to `http://localhost:3000`.

### 3. Seed sample data

Make sure the backend `.env` contains `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters.

```bash
cd backend
npm run seed
```

For deployed seed data, set `SEED_IMAGE_BASE_URL` to the public URL where the four sample images are hosted. Admin-uploaded images are stored in Cloudinary.

## Environment variables

Never commit real secrets (as I have hidden it). Use `.env.example` files as templates for public viewers.

### Backend

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`
- `FRONTEND_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `SEED_IMAGE_BASE_URL`
- `COOKIE_DOMAIN` (normally left empty)

### Frontend

- `VITE_API_URL`

Only non-sensitive configuration belongs in `VITE_*` variables because frontend variables are exposed to the browser.

## Deployment

Recommended production setup:

- **GitHub** — source control
- **Vercel** — React/Vite frontend
- **Render** — Express API
- **MongoDB Atlas** — database
- **Cloudinary** — product images

### Vercel

Set the project root to `frontend` and add:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

The included `vercel.json` keeps React Router routes working on refresh.

### Render

The included `render.yaml` is configured for the backend. Add the production secrets in Render's environment settings. Set:

```text
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Do not commit these values to GitHub.

### MongoDB Atlas

Create a database user with a strong password, allow the deployed backend to connect, and use the Atlas connection string as `MONGODB_URI`.

### Cloudinary

Create a Cloudinary account and add the cloud name, API key, and API secret to the backend environment. Product uploads are stored under `petalyn/products`.

## Security notes

- Admin passwords are hashed with bcrypt before storage.
- Admin authentication uses an HTTP-only JWT cookie.
- Authenticated write operations use a CSRF token.
- Admin product mutation and order-list routes require authentication.
- Login attempts are rate limited.
- Uploads are limited to JPG, PNG, and WebP images up to 5 MB.
- Production secrets belong in hosting-provider environment variables, never in Git.

## License

This project is for public use and learning purposes. You are free to use, modify, and distribute it as you wish.