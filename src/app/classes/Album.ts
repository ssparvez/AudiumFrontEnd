import { Song } from './Song';

export interface Album {
    albumId?: number;
    albumTitle?: string;
    releaseYear?: string;
    artistId?: number;
    artistName?: string;
    songs?: Song[];
    saved?: boolean;
  }
