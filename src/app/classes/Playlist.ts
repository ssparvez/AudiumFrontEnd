export interface Playlist {

  playlistId?: number;
  name?: string;
  description?: string;
  isPublic?: boolean;
  creator?: {
    accountId: number;
  };

}
