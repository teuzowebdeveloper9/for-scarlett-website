import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { DiaryEntryResponseDto } from './dto/diary-entry-response.dto';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Post('entries')
  createEntry(
    @Body() payload: CreateDiaryEntryDto,
  ): Promise<DiaryEntryResponseDto> {
    return this.diaryService.createEntry(payload);
  }

  @Get('entries')
  listEntries(
    @Headers('x-lover-password') password?: string,
  ): Promise<DiaryEntryResponseDto[]> {
    return this.diaryService.listEntries(password);
  }
}
