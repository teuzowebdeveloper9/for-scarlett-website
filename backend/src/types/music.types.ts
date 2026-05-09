export interface Music {
  musicId: string;
  title: string;
  artist: string;
}

export interface LyricsLine {
  time: number;
  english: string;
  chinese: string;
}

export interface LyricsJson extends Music {
  lyrics: LyricsLine[];
}
