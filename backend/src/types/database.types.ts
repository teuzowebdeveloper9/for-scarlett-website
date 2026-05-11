import { LyricsJson, LyricsLine } from './music.types';

export interface Database {
  public: {
    Tables: {
      music_lyrics: {
        Row: {
          id: string;
          music_id: string;
          title: string;
          artist: string;
          lyrics_json: LyricsJson | LyricsLine[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          music_id: string;
          title: string;
          artist: string;
          lyrics_json: LyricsJson | LyricsLine[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          music_id?: string;
          title?: string;
          artist?: string;
          lyrics_json?: LyricsJson | LyricsLine[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      karina_diary_entries: {
        Row: {
          id: string;
          mood: string;
          title: string;
          description: string;
          author_timezone: string;
          reader_timezone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          mood: string;
          title: string;
          description: string;
          author_timezone?: string;
          reader_timezone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          mood?: string;
          title?: string;
          description?: string;
          author_timezone?: string;
          reader_timezone?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
