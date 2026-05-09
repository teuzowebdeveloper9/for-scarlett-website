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
