import { Account } from "./Account";
import { Song } from "./Song";

export interface Playlist {

  playlistId?: number;
  name?: string;
  description?: string;
  isPublic?: boolean;
  accountId?: number;
  creator?: Account; // Some pages use creator, some use playlistId/username
  username?: string;
  followed?: boolean;
  songs?: Song[];

}




