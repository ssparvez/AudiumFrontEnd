import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DataService } from '../data.service';


@Injectable()
export class LibraryService {
  accountId: string
  constructor(private http: Http, public dataService: DataService) {

    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
  }
  getAllPlaylists() {
    return this.http.get(this.dataService.connectionURL + "/accounts/" + this.accountId + "/playlists").map(res => res.json());
  }

  getSong(songId : number) {
    return this.http.get(this.dataService.connectionURL + "/songs/" + songId).map(res => res.json());
  }

  getPlaylist(playlistId : number) {
    return this.http.get(this.dataService.connectionURL + "/playlists/" + playlistId).map(res => res.json());
  }
  getPlaylistSongs(playlistId : number) {
    return this.http.get(this.dataService.connectionURL + "/playlists/" + playlistId + "/songs").map(res => res.json());
  }

  getArtist(artistId : number) {
    return this.http.get(this.dataService.connectionURL + "/artists/" + artistId).map(res => res.json());
  }
  getArtistAlbums(artistId : number) {
    return this.http.get(this.dataService.connectionURL + "/artists/" + artistId + "/albums").map(res => res.json());
  }
  getArtistSongs(artistId : number) {
    return this.http.get(this.dataService.connectionURL + "/artists/" + artistId + "/songs").map(res => res.json());
  }
}
