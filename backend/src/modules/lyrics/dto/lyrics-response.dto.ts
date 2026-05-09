import { LyricsLineDto } from './lyrics-line.dto';

export class LyricsResponseDto {
  musicId: string;
  title: string;
  artist: string;
  lyrics: LyricsLineDto[];
}
