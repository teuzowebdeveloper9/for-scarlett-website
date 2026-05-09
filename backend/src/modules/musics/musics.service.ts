import { Injectable } from '@nestjs/common';
import { LyricsResponseDto } from '../lyrics/dto/lyrics-response.dto';
import { LyricsService } from '../lyrics/lyrics.service';

@Injectable()
export class MusicsService {
  constructor(private readonly lyricsService: LyricsService) {}

  getLyrics(musicId: string): Promise<LyricsResponseDto> {
    return this.lyricsService.findByMusicId(musicId);
  }
}
