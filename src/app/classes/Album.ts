import { Artist } from './Artist';
import { Song } from './Song';

export interface Album {
    albumId?: number;
    albumTitle?: string;
    releaseYear?: string;
    artist?: Artist; // Some pages use Artist, some use artistId/artistName
    artistId?: number;
    artistName?: string;
    songs?: Song[];
    saved?: boolean;
  }
