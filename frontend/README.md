# Falcon University - Frontend

Admin dashboard and student interview interface built with Next.js.

## Tech Stack

- Next.js 14
- Tailwind CSS
- React Hooks

## Pages

| Route | Description |
|-------|-------------|
| `/` | Admin Dashboard - Upload PDF, view applicants |
| `/interview` | Student Interview - Chat interface |

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

For production, update to your deployed backend URL.

## Build

```bash
npm run build
npm start
```