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
  getAllAlbums() {
    
  }
  getAllPlaylists() {
    return this.http.get(this.dataService.connectionURL + "/accounts/" + this.accountId + "/playlists").map(res => res.json());
  }
}
