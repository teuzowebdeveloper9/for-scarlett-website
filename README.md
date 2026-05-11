# For Scarlett Baby Website

Romantic Vite + React website in Portuguese with Chinese visual accents, a local music player, neon heart visuals, photo album, and synchronized lyrics support.

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

Set `VITE_API_URL` to the shared NestJS backend URL. Default:

```env
VITE_API_URL=https://for-my-baby-karina-website-back.vercel.app
```

The player calls:

```text
GET /musics/:musicId/lyrics
```

If no lyrics JSON exists yet, the player still works and shows a placeholder. When a line has `portuguese`, this Scarlett frontend displays it; Karina can keep displaying `english`.

## Vercel deploy

Deploy this repo as two Vercel projects:

- Frontend project root: repository root. Uses `vercel.json`.
- Backend project root: `backend`. Uses `backend/vercel.json`.

Set the frontend `VITE_API_URL` to the deployed backend URL. Set backend env vars in the backend Vercel project, including `FRONTEND_ORIGIN`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

`FRONTEND_ORIGIN` accepts multiple domains separated by commas:

```env
FRONTEND_ORIGIN=https://for-my-baby-karina-website.vercel.app,https://for-scarlett-website.vercel.app
```
