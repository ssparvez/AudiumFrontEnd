import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
import { Account } from '../../classes/Account';


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
        if ( result && result.token) {
          localStorage.setItem('token', result.token);
          const info = this.currentUser;
            const account = new Account(info.username,
              info.firstName,
              info.lastName,
              info.email,
              info.accountID,
              info.role);
          sessionStorage.setItem('currentUser', JSON.stringify(account));
          return true;
        } else {
          return false;
        }
      });

  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return tokenNotExpired();
  }
  get currentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return new JwtHelper().decodeToken(token); // returns token as simple json
  }
}


