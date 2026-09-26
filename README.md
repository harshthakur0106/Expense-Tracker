# SpendWise

SpendWise is a simple personal expense tracker built with Next.js, TypeScript, and Tailwind CSS. The app is designed for a college-level project and focuses on beginner-friendly code, local data storage, and clean dashboard analytics without using external AI or backend services.

## Features

- Dashboard with income, expenses, balance and transaction summaries
- Add transaction form with validation
- Transaction history page with search, filters, date sorting, edit and delete
- Spending insights section for category analysis and estimate trends
- Local JSON-style seed dataset with realistic synthetic personal expense data
- LocalStorage-based transaction persistence for newly added entries
- API routes for transactions and analytics

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Lucide icons

## Project Structure

- app/ — pages and API routes
- components/ — reusable UI components
- lib/ — calculations and seed dataset

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
```

## Deploy on Vercel

This project is set up to be deployable on Vercel directly.

1. Push the project to GitHub.
2. Import it into Vercel.
3. Use the default Next.js settings.
4. Deploy.

The app does not require a database, AI API, or authentication, so it is simple to deploy and suitable for academic demonstration.
