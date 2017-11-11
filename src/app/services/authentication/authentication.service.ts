import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
import { DataService } from '../../services/data.service';
import { Http, RequestOptions, Headers } from '@angular/http';
import {CustomerAccount} from "../../classes/customer-account.service";

@Injectable()
export class AuthenticationService {

  constructor(private http: Http,
              private dataService:DataService,
              private currentUser: CustomerAccount) { }


  login(credentials) {
  /*  const headers = new Headers();
    headers.append('content-type', 'application/json');
    const options = new RequestOptions({ headers: headers});*/
    return this.http.post( this.dataService.connectionURL + '/login', credentials
      )
      .map(response => {
        let result = {
          token: response['_body']
        };

        if ( result && result.token) {
          localStorage.setItem('token', result.token);
          this.storeInfo();
          return true;
        } else {
          return false;
        }
      });
  }

  register(values) {
    return this.http.post(this.dataService.connectionURL + '/register', values)
      .map(response => {
        console.log(response.status);
        return (response.status === 200);
      });

  }

  logout() {
    sessionStorage.clear();
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  get currentUserInfo() {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return new JwtHelper().decodeToken(token); // returns token as simple json
  }


  storeInfo() {
    const info = this.currentUserInfo;
    const username = info.username;
    this.currentUser.username  = username.charAt(0).toUpperCase() + username.slice(1);
    this.currentUser.accountId = info.accountId;
    this.currentUser.role = info.role;
    this.currentUser.firstName = info.firstName;
    this.currentUser.lastName = info.lastName;
    this.currentUser.email = info.email;
    this.currentUser.dob = info.dob;
    this.currentUser.gender = info.gender;
    this.currentUser.profilePicURL = this.dataService.profilePic + this.currentUser.accountId + '.png';
    sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));

  }

}


