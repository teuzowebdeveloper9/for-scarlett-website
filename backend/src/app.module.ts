import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DiaryModule } from './modules/diary/diary.module';
import { MusicsModule } from './modules/musics/musics.module';

@Module({
  imports: [MusicsModule, DiaryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
