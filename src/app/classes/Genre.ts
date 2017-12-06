import { Artist } from './Artist'
import { Song } from './Song'

export interface Genre {
    genreId?: number;
    genreName?: string;
    songs?: Song[];
    artists?: Artist[];
}
