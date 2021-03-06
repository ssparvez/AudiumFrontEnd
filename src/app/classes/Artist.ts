import { Song } from './Song';
import { Album } from './Album';
import { Event } from './Event';

export interface Artist {
    artistId?: number;
    accountId?: number;
    artistName?: string;
    bio?: string;
    albums?: Album[];
    songs?: Song[];
    events?: Event[];
    followed?: boolean;

    isLoaded?:boolean;
}
