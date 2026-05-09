import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';

@Module({
  imports: [SupabaseModule],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
