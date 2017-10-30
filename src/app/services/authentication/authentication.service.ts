import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {JwtHelper, tokenNotExpired} from "angular2-jwt";


@Injectable()
export class AuthenticationService {

  constructor( private http: Http) { }


  login(credentials) {
  /*  const headers = new Headers();
    headers.append('content-type', 'application/json');
    const options = new RequestOptions({ headers: headers});*/
    return this.http.post('http://localhost:8080/login', credentials
      )
      .map(response => {
        let result = {
          token: response['_body']
        };
        console.log(response);
        if ( result && result.token) {
          localStorage.setItem('token', result.token);
          return true;
        } else {
          return false;
        }
      });

  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return tokenNotExpired();
  }
}
