import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DataService } from '../data.service';


@Injectable()
export class HomeService {

  constructor(private http: Http, public dataService: DataService) { }

  getAllGenres() {
    return this.http.get(this.dataService.connectionURL + "/genres").map(res => res.json());
  }

}
