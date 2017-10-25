import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SongsService {

  constructor(private http: Http) { }

  getAll() {
    return this.http.get("http://localhost:8080/songs").map(res => res.json());
  }

}
