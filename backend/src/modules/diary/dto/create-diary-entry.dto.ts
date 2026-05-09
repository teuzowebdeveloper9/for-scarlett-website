export class CreateDiaryEntryDto {
  mood: string;
  title: string;
  description: string;
  authorTimezone?: string;
  readerTimezone?: string;
}
