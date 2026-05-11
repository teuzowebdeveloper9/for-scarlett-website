import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readdir } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { Database } from '../src/types/database.types';
import { LyricsJson, LyricsLine } from '../src/types/music.types';

interface LyricsApiResponse {
  musicId: string;
  title: string;
  artist: string;
  lyrics: LyricsLine[];
}

interface IndexedTranslation {
  index: number;
  portuguese: string;
}

interface TranslationResponse {
  translations?: Array<string | IndexedTranslation>;
}

const audioExtensions = new Set(['.mp3', '.m4a', '.wav', '.ogg']);
const sourceBackendUrl = normalizeUrl(
  process.env.SOURCE_LYRICS_BACKEND_URL ??
    'https://for-my-baby-karina-website-back.vercel.app',
);
const allowEnglishFallback =
  process.env.COPY_LYRICS_ALLOW_ENGLISH_FALLBACK === 'true';
const translationDelayMs = Number(process.env.COPY_LYRICS_DELAY_MS ?? 15000);
const translationRetries = Number(process.env.COPY_LYRICS_RETRIES ?? 4);
const sourceFetchRetries = Number(process.env.COPY_LYRICS_SOURCE_RETRIES ?? 4);
const supabase = createClient<Database>(
  getRequiredEnv('SUPABASE_URL'),
  getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be configured.`);
  }

  return value;
}

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanName(value: string): string {
  return value
    .replace(
      /\s*\((youtube|official audio|official video|audio|video)\)\s*/gi,
      ' ',
    )
    .replace(/\s*\[[^\]]+\]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTrackInfo(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, '');
  const parts = nameWithoutExtension
    .split(' - ')
    .map(cleanName)
    .filter(Boolean);

  return {
    musicId: slugify(nameWithoutExtension),
    title: parts.length >= 3 ? parts[1] : parts[0] || nameWithoutExtension,
    artist: parts.length >= 3 ? parts[0] : parts[1] || 'Unknown artist',
  };
}

async function listAudioFiles(audioDir: string): Promise<string[]> {
  const entries = await readdir(audioDir, { withFileTypes: true });

  return entries
    .filter(
      (entry) =>
        entry.isFile() &&
        audioExtensions.has(extname(entry.name).toLowerCase()),
    )
    .map((entry) => join(audioDir, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

async function fetchSourceLyrics(
  musicId: string,
): Promise<LyricsApiResponse | null> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= sourceFetchRetries; attempt += 1) {
    try {
      const response = await fetch(
        `${sourceBackendUrl}/musics/${encodeURIComponent(musicId)}/lyrics`,
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(
          `Failed to fetch ${musicId} from ${sourceBackendUrl}: ${message}`,
        );
      }

      return (await response.json()) as LyricsApiResponse;
    } catch (error) {
      lastError = error;

      if (attempt === sourceFetchRetries) {
        break;
      }

      const delay = 5000 * attempt;
      console.warn(
        `Source lyrics fetch failed for ${musicId} on attempt ${attempt}/${sourceFetchRetries}. Retrying in ${delay}ms.`,
      );
      await sleep(delay);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Failed to fetch ${musicId} from ${sourceBackendUrl}.`);
}

function parseTranslationContent(
  content: string,
  lineCount: number,
): string[] {
  const parsed = JSON.parse(
    content.replace(/^```json|```$/g, '').trim(),
  ) as TranslationResponse;
  const translations = parsed.translations ?? [];
  const output = Array.from({ length: lineCount }, () => '');

  translations.forEach((item, index) => {
    if (typeof item === 'string') {
      output[index] = item;
      return;
    }

    if (Number.isInteger(item.index)) {
      output[item.index] = item.portuguese ?? '';
    }
  });

  return output;
}

async function requestPortugueseTranslations(
  englishLines: string[],
  songLabel: string,
): Promise<string[]> {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    if (allowEnglishFallback) {
      console.warn(
        `MISTRAL_API_KEY missing. Copying English into Portuguese for ${songLabel}.`,
      );
      return englishLines;
    }

    throw new Error(
      `MISTRAL_API_KEY must be configured to create Portuguese lyrics for ${songLabel}.`,
    );
  }

  let lastError: unknown;

  for (let attempt = 1; attempt <= translationRetries; attempt += 1) {
    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.MISTRAL_TEXT_MODEL ?? 'mistral-large-latest',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You translate authorized lyric line fragments into natural Brazilian Portuguese. Return strict JSON only.',
            },
            {
              role: 'user',
              content: JSON.stringify({
                instructions:
                  'Translate each item text into Brazilian Portuguese. Preserve every index exactly. Return {"translations":[{"index":0,"portuguese":"..."}]}. Keep blank input text blank.',
                lines: englishLines.map((text, index) => ({ index, text })),
              }),
            },
          ],
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message);
      }

      const payload = await response.json();
      const content = payload.choices?.[0]?.message?.content;

      if (typeof content !== 'string') {
        throw new Error('Mistral returned an unexpected response.');
      }

      return parseTranslationContent(content, englishLines.length);
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === translationRetries;

      if (isLastAttempt) {
        break;
      }

      const delay = translationDelayMs * attempt;
      console.warn(
        `Portuguese translation failed for ${songLabel} on attempt ${attempt}/${translationRetries}. Retrying in ${delay}ms.`,
      );
      await sleep(delay);
    }
  }

  if (allowEnglishFallback) {
    console.warn(`Using English fallback for ${songLabel}.`);
    return englishLines;
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Portuguese translation failed for ${songLabel}.`);
}

async function translateLinesToPortuguese(
  lines: LyricsLine[],
  songLabel: string,
): Promise<string[]> {
  const englishLines = lines.map(
    (line) => line.portuguese ?? line.english ?? '',
  );
  const needsTranslation = lines.some(
    (line) => !line.portuguese && line.english,
  );

  if (!needsTranslation) {
    return englishLines;
  }

  return requestPortugueseTranslations(englishLines, songLabel);
}

async function saveLyricsToSupabase(lyricsJson: LyricsJson): Promise<void> {
  const payload = {
    title: lyricsJson.title,
    artist: lyricsJson.artist,
    lyrics_json: lyricsJson,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('music_lyrics')
    .update(payload)
    .eq('music_id', lyricsJson.musicId)
    .select('music_id');

  if (error) {
    throw error;
  }

  if (data.length > 0) {
    return;
  }

  const { error: insertError } = await supabase.from('music_lyrics').insert({
    music_id: lyricsJson.musicId,
    ...payload,
  });

  if (insertError) {
    throw insertError;
  }
}

function alreadyHasPortuguese(lines: LyricsLine[]): boolean {
  return lines.every((line) => Boolean(line.portuguese) || !line.english);
}

async function copyTrack(audioPath: string): Promise<boolean> {
  const fallbackTrackInfo = parseTrackInfo(basename(audioPath));
  const sourceLyrics = await fetchSourceLyrics(fallbackTrackInfo.musicId);

  if (!sourceLyrics) {
    console.warn(
      `Skipping ${fallbackTrackInfo.musicId}: source backend returned 404.`,
    );
    return false;
  }

  if (alreadyHasPortuguese(sourceLyrics.lyrics)) {
    console.log(`Skipping ${sourceLyrics.musicId}; Portuguese already exists.`);
    return false;
  }

  const portugueseLines = await translateLinesToPortuguese(
    sourceLyrics.lyrics,
    sourceLyrics.title,
  );
  const lyrics = sourceLyrics.lyrics.map((line, index) => ({
    ...line,
    portuguese: line.portuguese ?? portugueseLines[index] ?? '',
  }));
  const lyricsJson: LyricsJson = {
    musicId: sourceLyrics.musicId,
    title: sourceLyrics.title || fallbackTrackInfo.title,
    artist: sourceLyrics.artist || fallbackTrackInfo.artist,
    lyrics,
  };

  await saveLyricsToSupabase(lyricsJson);
  console.log(`Saved Portuguese lyrics for ${lyricsJson.musicId}`);
  return true;
}

async function main() {
  const audioDir =
    process.argv[2] ??
    process.env.AUDIO_INPUT_DIR ??
    '../src/musics-karina-site';
  const audioFiles = await listAudioFiles(audioDir);
  const failures: string[] = [];

  console.log(
    `Adding Portuguese into existing music_lyrics rows from ${sourceBackendUrl}.`,
  );

  for (const audioFile of audioFiles) {
    try {
      const didTranslate = await copyTrack(audioFile);

      if (didTranslate) {
        await sleep(translationDelayMs);
      }
    } catch (error) {
      failures.push(basename(audioFile));
      console.error(`Failed to update ${basename(audioFile)}`);
      console.error(error);
    }
  }

  if (failures.length > 0) {
    console.warn(
      `Finished with ${failures.length} failed file(s): ${failures.join(', ')}`,
    );
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
