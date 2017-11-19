import { Song } from './Song';
import { Album } from './Album';

export interface Artist {
    artistId?: number,
    artistName?: string,
    bio?: string,
    albums?: Album[],
    songs?: Song[]
}