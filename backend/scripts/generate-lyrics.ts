import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { LyricsJson, LyricsLine } from '../src/types/music.types';

interface TimedTranscriptionSegment {
  time: number;
  text: string;
}

interface MistralTranscriptionSegment {
  start?: number;
  end?: number;
  text?: string;
}

interface MistralTranscriptionResponse {
  text?: string;
  segments?: MistralTranscriptionSegment[];
  chunks?: MistralTranscriptionSegment[];
}

const audioExtensions = new Set(['.mp3', '.m4a', '.wav', '.ogg']);
const supabase = createClient(getRequiredEnv('SUPABASE_URL'), getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
const maxRetries = Number(process.env.GENERATE_LYRICS_RETRIES ?? 3);
const retryBaseDelayMs = Number(process.env.GENERATE_LYRICS_RETRY_BASE_DELAY_MS ?? 1500);

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be configured.`);
  }

  return value;
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
    .replace(/\s*\((youtube|official audio|official video|audio|video)\)\s*/gi, ' ')
    .replace(/\s*\[[^\]]+\]\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes('fetch failed') ||
    error.message.includes('Connect Timeout Error') ||
    error.message.includes('ETIMEDOUT') ||
    error.message.includes('ECONNRESET') ||
    error.message.includes('ENOTFOUND') ||
    error.message.includes('503')
  );
}

async function retryWithBackoff<T>(operation: () => Promise<T>, label: string): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= Math.max(1, maxRetries); attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const retryable = isRetryableError(error);
      const isLastAttempt = attempt === Math.max(1, maxRetries);

      if (!retryable || isLastAttempt) {
        throw error;
      }

      const delay = retryBaseDelayMs * attempt;
      console.warn(`${label} failed on attempt ${attempt}/${maxRetries}. Retrying in ${delay}ms.`);
      await sleep(delay);
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`${label} failed.`);
}

function parseTrackInfo(fileName: string) {
  const nameWithoutExtension = fileName.replace(/\.[^.]+$/, '');
  const parts = nameWithoutExtension.split(' - ').map(cleanName).filter(Boolean);

  return {
    musicId: slugify(nameWithoutExtension),
    title: parts.length >= 3 ? parts[1] : parts[0] || nameWithoutExtension,
    artist: parts.length >= 3 ? parts[0] : parts[1] || 'Unknown artist',
  };
}

async function listAudioFiles(audioDir: string): Promise<string[]> {
  const entries = await readdir(audioDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && audioExtensions.has(extname(entry.name).toLowerCase()))
    .map((entry) => join(audioDir, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

async function hasLyricsForMusicId(musicId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('music_lyrics')
    .select('music_id')
    .eq('music_id', musicId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function transcribeAudioWithMistral(audioPath: string): Promise<TimedTranscriptionSegment[]> {
  const apiKey = getRequiredEnv('MISTRAL_API_KEY');
  const fileBuffer = await readFile(audioPath);
  const formData = new FormData();

  formData.append('model', process.env.MISTRAL_TRANSCRIPTION_MODEL ?? 'voxtral-mini-latest');
  formData.append('timestamp_granularities', 'segment');
  formData.append('file', new Blob([new Uint8Array(fileBuffer)]), basename(audioPath));

  const response = await retryWithBackoff(
    () =>
      fetch('https://api.mistral.ai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }),
    `Mistral transcription for ${basename(audioPath)}`,
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Mistral transcription failed for ${basename(audioPath)}: ${message}`);
  }

  const payload = (await response.json()) as MistralTranscriptionResponse;
  const segments = payload.segments ?? payload.chunks ?? [];

  if (segments.length > 0) {
    return segments.map((segment, index) => ({
      time: segment.start ?? index,
      text: segment.text ?? '',
    }));
  }

  if (payload.text) {
    return [{ time: 0, text: payload.text }];
  }

  return [];
}

async function organizeAndTranslateLyrics(segments: TimedTranscriptionSegment[]): Promise<LyricsLine[]> {
  if (segments.length === 0) {
    return [];
  }

  const apiKey = getRequiredEnv('MISTRAL_API_KEY');
  const model = process.env.MISTRAL_TEXT_MODEL ?? 'mistral-large-latest';

  const response = await retryWithBackoff(
    () =>
      fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You turn authorized local audio transcriptions into timed bilingual lyric lines. Return strict JSON only.',
            },
            {
              role: 'user',
              content: JSON.stringify({
                instructions:
                  'Group nearby transcription segments into short lyric lines. Keep the original meaning in English. Translate each line to Simplified Chinese. Preserve the first timestamp of each grouped line. Return {"lyrics":[{"time":0,"english":"...","chinese":"..."}]}.',
                segments,
              }),
            },
          ],
        }),
      }),
    'Mistral lyric organization',
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Mistral lyric organization failed: ${message}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content !== 'string') {
    throw new Error('Mistral lyric organization returned an unexpected response.');
  }

  const parsed = JSON.parse(content.replace(/^```json|```$/g, '').trim()) as { lyrics?: LyricsLine[] };

  return parsed.lyrics ?? [];
}

async function saveLyricsToSupabase(lyricsJson: LyricsJson): Promise<void> {
  const { error } = await retryWithBackoff(
    async () =>
      await supabase.from('music_lyrics').upsert(
        {
          music_id: lyricsJson.musicId,
          title: lyricsJson.title,
          artist: lyricsJson.artist,
          lyrics_json: lyricsJson,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'music_id' },
      ),
    `Supabase upsert for ${lyricsJson.musicId}`,
  );

  if (error) {
    throw error;
  }
}

async function processAudioFile(audioPath: string): Promise<void> {
  const trackInfo = parseTrackInfo(basename(audioPath));

  if (await hasLyricsForMusicId(trackInfo.musicId)) {
    console.log(`Skipping ${trackInfo.title} (${trackInfo.musicId}) because it already exists.`);
    return;
  }

  console.log(`Generating lyrics for ${trackInfo.title} (${trackInfo.musicId})`);

  const transcription = await transcribeAudioWithMistral(audioPath);
  const lyrics = await organizeAndTranslateLyrics(transcription);
  const lyricsJson: LyricsJson = {
    ...trackInfo,
    lyrics,
  };

  await saveLyricsToSupabase(lyricsJson);
  console.log(`Saved ${lyrics.length} lyric lines for ${trackInfo.musicId}`);
}

async function main() {
  const audioDir = process.argv[2] ?? process.env.AUDIO_INPUT_DIR ?? '../my-baby-website-karina/src/musics-karina-site';
  const audioFiles = await listAudioFiles(audioDir);
  const failures: string[] = [];

  if (audioFiles.length === 0) {
    console.log(`No audio files found in ${audioDir}`);
    return;
  }

  for (const audioFile of audioFiles) {
    try {
      await processAudioFile(audioFile);
    } catch (error) {
      failures.push(basename(audioFile));
      console.error(`Failed to process ${basename(audioFile)}`);
      console.error(error);
    }
  }

  if (failures.length > 0) {
    console.warn(`Finished with ${failures.length} failed file(s): ${failures.join(', ')}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
