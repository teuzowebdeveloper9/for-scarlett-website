import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusicsModule } from './modules/musics/musics.module';

@Module({
  imports: [MusicsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
