import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto';
import { DiaryEntryResponseDto } from './dto/diary-entry-response.dto';

interface DiaryEntryRow {
  id: string;
  mood: string;
  title: string;
  description: string;
  author_timezone: string;
  reader_timezone: string;
  created_at: string;
}

@Injectable()
export class DiaryService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async createEntry(payload: CreateDiaryEntryDto): Promise<DiaryEntryResponseDto> {
    const entry = {
      mood: this.cleanText(payload.mood, 'mood', 48),
      title: this.cleanText(payload.title, 'title', 120),
      description: this.cleanText(payload.description, 'description', 4000),
      author_timezone: this.cleanOptionalText(payload.authorTimezone, 'Asia/Almaty', 64),
      reader_timezone: this.cleanOptionalText(payload.readerTimezone, 'America/Sao_Paulo', 64),
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('karina_diary_entries')
      .insert(entry)
      .select('id,mood,title,description,author_timezone,reader_timezone,created_at')
      .single();

    if (error) {
      throw error;
    }

    return this.toResponse(data as DiaryEntryRow);
  }

  async listEntries(password: string | undefined): Promise<DiaryEntryResponseDto[]> {
    this.assertLoverPassword(password);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('karina_diary_entries')
      .select('id,mood,title,description,author_timezone,reader_timezone,created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return ((data ?? []) as DiaryEntryRow[]).map((row) => this.toResponse(row));
  }

  private cleanText(value: string | undefined, fieldName: string, maxLength: number): string {
    const text = typeof value === 'string' ? value.trim() : '';

    if (!text) {
      throw new BadRequestException(`${fieldName} is required.`);
    }

    if (text.length > maxLength) {
      throw new BadRequestException(`${fieldName} must be ${maxLength} characters or less.`);
    }

    return text;
  }

  private cleanOptionalText(value: string | undefined, fallback: string, maxLength: number): string {
    const text = typeof value === 'string' ? value.trim() : '';
    return text.slice(0, maxLength) || fallback;
  }

  private assertLoverPassword(password: string | undefined): void {
    const configuredPassword = process.env.LOVER_PAGE_PASSWORD;

    if (!configuredPassword) {
      throw new Error('LOVER_PAGE_PASSWORD must be configured.');
    }

    if (!password || password !== configuredPassword) {
      throw new UnauthorizedException('Invalid lover password.');
    }
  }

  private toResponse(row: DiaryEntryRow): DiaryEntryResponseDto {
    return {
      id: row.id,
      mood: row.mood,
      title: row.title,
      description: row.description,
      authorTimezone: row.author_timezone,
      readerTimezone: row.reader_timezone,
      createdAt: row.created_at,
    };
  }
}
