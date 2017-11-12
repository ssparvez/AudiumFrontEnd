import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {JwtHelper, tokenNotExpired} from "angular2-jwt";
import { Http, RequestOptions, Headers } from '@angular/http';
import {CustomerAccount} from "../../classes/customer-account.service";
import {GeneralService} from "../general/general.service";
import {AppError} from "../../errors/AppError";
import {NotFoundError} from "../../errors/not-found-error";
import {DataService} from "../data.service";

@Injectable()
export class AuthenticationService {

  constructor(private http: Http,
              private dataService: DataService,
              private currentUser: CustomerAccount,
              private service: GeneralService,) { }


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
     this.service.post('/register', values).subscribe(
      response => {
        return true;
      },(error: AppError) => {
      if ( error instanceof NotFoundError) {
        console.log("working");
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


