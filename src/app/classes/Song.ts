export interface Song {
  songId?: number;
  title?: string;
  duration?: string;
  file?: string;
  year?: Date;
  isExplicit?: boolean;
  lyrics?: string;

  artistId?: number;
  artistName?: string;
  albumId?: number;
  albumTitle?: string;
  timeAdded?: number;
  trackNumber?: number;
  genreId?: number;
  genreName?: string;
  playCount?: number;
  playCountLastMonth?: number;
  //artists: Artist [],
  //album: Album []
  isPlaying?: boolean;
  sound?: Howl;

  saved?: boolean;
  timePlayed?: number;
}
