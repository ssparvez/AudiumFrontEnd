import { Song } from "./Song";

export interface SongQueue {
    songs?: Song[]; // might have to be any
    index?: number;

    isMuted: boolean,
    isShuffled: boolean,
    isRepeated: boolean,
    volumeLevel: number,
    previousVolumeLevel: number,
    repeatLevel: number,
    seekPosition: number,

    isPlaying?: boolean;
    sound?: Howl;
  }
  