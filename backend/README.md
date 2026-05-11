# Shared Baby Website Backend

NestJS API for synchronized lyrics stored in Supabase. Scarlett uses the same `music_lyrics` rows as Karina; the only extra field is `portuguese` inside each `lyrics_json.lyrics[]` line.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Required envs:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173,https://for-my-baby-karina-website.vercel.app,https://for-scarlett-website.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LOVER_PAGE_PASSWORD=your-private-lover-password
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_TRANSCRIPTION_MODEL=voxtral-mini-latest
MISTRAL_TEXT_MODEL=mistral-large-latest
AUDIO_INPUT_DIR=../src/musics-karina-site
SOURCE_LYRICS_BACKEND_URL=https://for-my-baby-karina-website-back.vercel.app
COPY_LYRICS_ALLOW_ENGLISH_FALLBACK=false
COPY_LYRICS_DELAY_MS=15000
COPY_LYRICS_RETRIES=4
GENERATE_LYRICS_RETRIES=3
GENERATE_LYRICS_RETRY_BASE_DELAY_MS=1500
```

## API

`FRONTEND_ORIGIN` and `FRONTEND_ORIGINS` accept multiple frontend domains separated by commas.

```http
GET /musics/:musicId/lyrics
POST /diary/entries
GET /diary/entries
```

Response:

```json
{
  "musicId": "song-slug",
  "title": "Song title",
  "artist": "Artist",
  "lyrics": [
    {
      "time": 0,
      "english": "line in English",
      "portuguese": "linha em português",
      "chinese": "简体中文翻译"
    }
  ]
}
```

## Add Portuguese To Existing Lyrics

```bash
npm run lyrics:copy-site
```

Despite the old script name, it now adds `portuguese` to the existing `music_lyrics.lyrics_json` rows by `music_id`. It does not create a new table or column.

The script:

- reads local audio filenames from `AUDIO_INPUT_DIR`;
- fetches the matching existing lyrics from `SOURCE_LYRICS_BACKEND_URL`;
- translates missing Portuguese lines with `MISTRAL_API_KEY`;
- upserts the same `music_id` row with `english`, `portuguese`, and `chinese`.

## Supabase Table

Run `supabase/schema.sql` only for a fresh database. Existing Karina databases do not need a schema change for Portuguese, because it lives inside `lyrics_json`.
