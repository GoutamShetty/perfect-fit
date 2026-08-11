# Perfect Fit

Luxury tailored fashion e-commerce store. Made in Karnataka.
Full-stack Next.js app with a storefront, cart, checkout (Razorpay + Cash on Delivery), order tracking, and an admin panel.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + **Framer Motion** (gold/black luxury theme)
- **MongoDB** (Mongoose)
- **JWT** admin auth (httpOnly cookie)
- **Razorpay** online payments + **COD**
- **Cloudinary** (optional) for admin image uploads

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example and fill in your keys:

```bash
cp .env.example .env.local
```

At minimum set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
(Razorpay and Cloudinary are optional — the store works with COD and image URLs without them.)

3. Seed the database with an admin user and sample products:

```bash
npm run seed
```

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The admin panel is at [/admin](http://localhost:3000/admin).

## Environment Variables

See [.env.example](.env.example) for the full list and where to get each value.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local` in the Vercel project settings.
4. Deploy. Run `npm run seed` locally (pointing at the same `MONGODB_URI`) to populate data.

## Project Structure

```
src/
  app/
    (store)/        Storefront pages (home, shop, product, cart, checkout, ...)
    admin/          Admin dashboard (products, orders, coupons, home content)
    api/            Route handlers (products, orders, coupons, auth, payments)
  components/       Shared + admin UI components
  context/          Cart + wishlist context (localStorage)
  lib/              db, auth, razorpay, coupon, config helpers
  models/           Mongoose models
scripts/seed.ts     Database seeder
```
