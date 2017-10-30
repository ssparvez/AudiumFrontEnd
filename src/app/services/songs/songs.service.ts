import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DataService } from '../data.service';

@Injectable()
export class SongsService {

  constructor(private http: Http, public dataService: DataService) { }

  getAll() {
    return this.http.get(this.dataService.connectionURL + "/songs").map(res => res.json());
  }
}
