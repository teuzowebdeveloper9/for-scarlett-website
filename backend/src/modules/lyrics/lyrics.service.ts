import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LyricsResponseDto } from './dto/lyrics-response.dto';
import { LyricsJson, LyricsLine } from '../../types/music.types';

interface MusicLyricsRow {
  music_id: string;
  title: string;
  artist: string;
  lyrics_json: LyricsJson | LyricsLine[] | null;
}

@Injectable()
export class LyricsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findByMusicId(musicId: string): Promise<LyricsResponseDto> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('music_lyrics')
      .select('music_id,title,artist,lyrics_json')
      .eq('music_id', musicId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const row = data as MusicLyricsRow | null;

    if (!row) {
      throw new NotFoundException(`Lyrics not found for musicId "${musicId}".`);
    }

    return {
      musicId: row.music_id,
      title: row.title,
      artist: row.artist,
      lyrics: this.extractLyrics(row.lyrics_json),
    };
  }

  private extractLyrics(lyricsJson: MusicLyricsRow['lyrics_json']): LyricsLine[] {
    if (!lyricsJson) {
      return [];
    }

    if (Array.isArray(lyricsJson)) {
      return lyricsJson;
    }

    return lyricsJson.lyrics ?? [];
  }
}
