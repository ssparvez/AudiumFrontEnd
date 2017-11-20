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

  getAllSongs() {
    return this.http.get(this.dataService.connectionURL + "/accounts/" + this.accountId + "/songs").map(res => res.json());
  }
  getAllArtists() {
    return this.http.get(this.dataService.connectionURL + "/accounts/" + this.accountId + "/artists").map(res => res.json());
  }
  getAllAlbums() {
    return this.http.get(this.dataService.connectionURL + "/accounts/" + this.accountId + "/albums").map(res => res.json());
  }
  getAllPlaylists() {
    return this.http.get(this.dataService.connectionURL + "/accounts/" + this.accountId + "/playlists").map(res => res.json());
  }

  getPlaylist(playlistId: number) {
    return this.http.get(this.dataService.connectionURL + "/playlist/" + playlistId).map(res => res.json());
  }
  getPlaylistSongs(playlistId: number) {
    return this.http.get(this.dataService.connectionURL + "/playlist/" + playlistId + "/songs").map(res => res.json());
  }

  getAlbum(albumId: number) {
    return this.http.get(this.dataService.connectionURL + "/album/" + albumId).map(res => res.json());
  }
  getAlbumSongs(albumId: number) {
    return this.http.get(this.dataService.connectionURL + "/album/" + albumId + "/songs").map(res => res.json());
  }

  getArtist(artistId: number) {
    return this.http.get(this.dataService.connectionURL + "/artist/" + artistId).map(res => res.json());
  }
  getArtistAlbums(artistId: number) {
    return this.http.get(this.dataService.connectionURL + "/artist/" + artistId + "/albums").map(res => res.json());
  }
  getArtistSongs(artistId: number) {
    return this.http.get(this.dataService.connectionURL + "/artist/" + artistId + "/songs").map(res => res.json());
  }
}
