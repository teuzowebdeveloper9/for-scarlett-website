import { Controller, Get, Param } from '@nestjs/common';
import { LyricsResponseDto } from '../lyrics/dto/lyrics-response.dto';
import { MusicsService } from './musics.service';

@Controller('musics')
export class MusicsController {
  constructor(private readonly musicsService: MusicsService) {}

  @Get(':musicId/lyrics')
  getLyrics(@Param('musicId') musicId: string): Promise<LyricsResponseDto> {
    return this.musicsService.getLyrics(musicId);
  }
}
