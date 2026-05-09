import { Module } from '@nestjs/common';
import { LyricsModule } from '../lyrics/lyrics.module';
import { MusicsController } from './musics.controller';
import { MusicsService } from './musics.service';

@Module({
  imports: [LyricsModule],
  controllers: [MusicsController],
  providers: [MusicsService],
})
export class MusicsModule {}
