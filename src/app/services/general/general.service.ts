import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {DataService} from "../data.service";
import {NotFoundError} from "../../errors/not-found-error";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';


@Injectable()
export class GeneralService {

  constructor( private http: AuthHttp, private data: DataService) { }


  update(endpoint, resources) {
    return this.http.put(this.data.connectionURL + endpoint, resources)
      .map(response => response)
      .catch(this.handleError);
  }

  get(endpoint, resources) {
    return this.http.get(this.data.connectionURL + endpoint, resources)
      .map(response => response)
      .catch(this.handleError);
  }


   handleError(error: Response) {
    if ( error.status === 404) {
      return Observable.throw(new NotFoundError(error));
    }
  }
}
