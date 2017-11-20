import {Song} from "./Song";

export interface Playlist {

  playlistId?: number;
  name?: string;
  description?: string;
  isPublic?: boolean;
  accountId?: number;
  username?: string;
  followed?: boolean;
  songs?: Song[];

}




