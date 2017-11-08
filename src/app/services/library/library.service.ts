import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DataService } from '../data.service';


@Injectable()
export class LibraryService {

  constructor(private http: Http, public dataService: DataService) { }

  getAllSongs() {
    let accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
    return this.http.get(this.dataService.connectionURL + "/accounts/" + accountId + "/songs").map(res => res.json());
  }
  getAllPlaylists() {
    return this.http.get(this.dataService.connectionURL + "/playlists").map(res => res.json());
  }
}
