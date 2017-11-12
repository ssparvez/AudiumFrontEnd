import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {DataService} from "../data.service";
import {NotFoundError} from "../../errors/not-found-error";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {RequestOptions} from "@angular/http";


@Injectable()
export class GeneralService {

  constructor( private http: AuthHttp, private data: DataService) { }


  get(endpoint, resources) {

    const options = new RequestOptions({body: resources});
    return this.http.get(this.data.connectionURL + endpoint, options)
      .map(response => response)
      .catch(this.handleError);
  }


  update(endpoint, resources) {
    return this.http.put(this.data.connectionURL + endpoint, resources)
      .map(response => response)
      .catch(this.handleError);
  }

<<<<<<< HEAD
  get(endpoint, resources) {
    return this.http.get(this.data.connectionURL + endpoint, resources)
=======
  post(endpoint, resources) {
    return this.http.post(this.data.connectionURL + endpoint , resources)
>>>>>>> 37586ae01439fb7962617065901cbe41bf1d2e3a
      .map(response => response)
      .catch(this.handleError);
  }


   handleError(error: Response) {
    if ( error.status === 404) {
      return Observable.throw(new NotFoundError(error));
    }
  }
}
