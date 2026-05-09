# For Karina Baby Website

Romantic Vite + React website with a local music player, neon heart visuals, and synchronized lyrics support.

## Frontend setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Local songs

Add authorized local audio files here:

```text
src/musics-karina-site
```

The player discovers `.mp3`, `.m4a`, `.wav`, and `.ogg` files automatically with `import.meta.glob`.

## Lyrics API

Set `VITE_API_URL` to the NestJS backend URL. Default:

```env
VITE_API_URL=http://localhost:3000
```

The player calls:

```text
GET /musics/:musicId/lyrics
```

If no lyrics JSON exists yet, the player still works and shows a placeholder.

## Private diary

The main page includes a diary form for Karina to leave notes from Kazakhstan while you sleep in Brazil.

Your protected reading page is:

```text
/lover
```

The `/lover` page asks for a password and calls:

```text
GET /diary/entries
```

Set `LOVER_PAGE_PASSWORD` in the backend `.env`. Do not put this password in frontend env files.

## Vercel deploy

Deploy this repo as two Vercel projects:

- Frontend project root: repository root. Uses `vercel.json`.
- Backend project root: `backend`. Uses `backend/vercel.json`.

Set the frontend `VITE_API_URL` to the deployed backend URL. Set backend env vars in the backend Vercel project, including `FRONTEND_ORIGIN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `LOVER_PAGE_PASSWORD`.
