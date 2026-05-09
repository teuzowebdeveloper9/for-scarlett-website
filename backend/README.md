# For Karina Baby Website Backend

NestJS API for synchronized lyrics stored in Supabase.

## Setup

```bash
npm install
cp .env.example .env
npm run start:dev
```

Required envs:

```env
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
LOVER_PAGE_PASSWORD=your-private-lover-password
MISTRAL_API_KEY=your-mistral-api-key
MISTRAL_TRANSCRIPTION_MODEL=voxtral-mini-latest
MISTRAL_TEXT_MODEL=mistral-large-latest
AUDIO_INPUT_DIR=../my-baby-website-karina/src/musics-karina-site
GENERATE_LYRICS_RETRIES=3
GENERATE_LYRICS_RETRY_BASE_DELAY_MS=1500
```

Use the Supabase service role key only on the backend or local scripts. Do not expose it in the frontend.

## API

```http
GET /musics/:musicId/lyrics
POST /diary/entries
GET /diary/entries
```

`GET /diary/entries` requires the `X-Lover-Password` header. The backend compares it with `LOVER_PAGE_PASSWORD`.

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
      "chinese": "简体中文翻译"
    }
  ]
}
```

## Supabase table

Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.

The SQL creates `music_lyrics` for lyrics and `karina_diary_entries` for the private diary.

`music_lyrics` stores:

- `id`
- `music_id`
- `title`
- `artist`
- `lyrics_json`
- `created_at`
- `updated_at`

`karina_diary_entries` stores:

- `id`
- `mood`
- `title`
- `description`
- `author_timezone`
- `reader_timezone`
- `created_at`

## Generate lyrics JSON from local audio

Only run this for songs you have rights or authorization to use.

```bash
npm run lyrics:generate
```

Or pass a folder manually:

```bash
npm run lyrics:generate -- ../my-baby-website-karina/src/musics-karina-site
```

The script:

- reads audio files from `AUDIO_INPUT_DIR` or the folder argument;
- generates `musicId` from each filename;
- sends local audio to Mistral transcription;
- asks Mistral to organize English lines and Simplified Chinese translations;
- upserts the final JSON into Supabase.

If Supabase or the Mistral API has a transient network failure, the script retries the request automatically and keeps going with the next file if one song still fails.
If a `musicId` already exists in Supabase, the script skips that file instead of generating it again.

The transcription logic is isolated in `scripts/generate-lyrics.ts` inside `transcribeAudioWithMistral()`, so you can replace it if you choose a different transcriber later.

## Vercel deploy

Deploy this folder as its own Vercel project with Root Directory set to `backend`.

The Vercel entrypoint is `api/index.ts`, which adapts the Nest app to a serverless function. Set the same backend env vars in Vercel, especially `FRONTEND_ORIGIN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `LOVER_PAGE_PASSWORD`.
