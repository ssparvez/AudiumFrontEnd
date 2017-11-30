import { Song } from "./Song";
import { Playlist } from "./Playlist";

export interface Profile {
  accountId?: number;
  username?: string;
  publicProfile?: boolean;
  followerCount?: number;
  followingCount?: number;
  followers?: Profile[];
  following?: Profile[];
  isFollowing?: boolean;
  recentSongs?: Song[];
  createdPlaylists?: Playlist[];
}
