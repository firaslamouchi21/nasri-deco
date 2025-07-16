# Nasri Déco

A full-stack business web application for a Tunisian construction company specializing in interior design and artistic gypsum work.

## Monorepo Structure

```
nasri-deco/
├── frontend/ # React + Vite + TailwindCSS
├── backend/  # Express + MySQL
```

## Getting Started

### Backend (Branch: `iyed`)

1. `cd backend`
2. Copy `.env.example` to `.env` and fill in your DB credentials
3. `npm install`
4. `npm start`

### Frontend (Branch: `firas`)

1. `cd frontend`
2. Copy `.env.example` to `.env` and set your API URL
3. `npm install`
4. `npm run dev`

## Deployment
- Frontend: Vercel (from `firas` branch)
- Backend: Topnet VPS (from `iyed` branch)

## Notes
- `/uploads` is used for image storage and is gitignored
- Use ESLint and consistent formatting
- See project prompt for full requirements
