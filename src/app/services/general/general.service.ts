import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import {DataService} from "../data.service";
import {NotFoundError} from "../../errors/not-found-error";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {ServerError} from "../../errors/server-error";
import {AuthorizationError} from "../../errors/authorization-error";


@Injectable()
export class GeneralService {

  constructor( private http: AuthHttp, private data: DataService) { }


  get(endpoint) {
    return this.http.get(this.data.connectionURL + endpoint)
      .map(response => response.json())
      .catch(this.handleError);
  }


  update(endpoint, resources) {
    return this.http.put(this.data.connectionURL + endpoint, resources)
      .map(response => response.json())
      .catch(this.handleError);
  }

  post(endpoint, resources) {
    return this.http.post(this.data.connectionURL + endpoint , resources)
      .map(response => response.json())
      .catch(this.handleError);
  }

  deleteResource(endpoint) {
    return this.http.delete(this.data.connectionURL + endpoint)
      .map(response => response.json())
      .catch(this.handleError);
  }

   handleError(error: Response) {
    if ( error.status === 404) {
      return Observable.throw(new NotFoundError(error));
    }
     if ( error.status === 500) {
       return Observable.throw(new ServerError(error));
     }
     if ( error.status === 401) {
       return Observable.throw(new AuthorizationError(error));
     }

  }
}
