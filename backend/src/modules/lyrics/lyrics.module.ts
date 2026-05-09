import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { LyricsService } from './lyrics.service';

@Module({
  imports: [SupabaseModule],
  providers: [LyricsService],
  exports: [LyricsService],
})
export class LyricsModule {}
