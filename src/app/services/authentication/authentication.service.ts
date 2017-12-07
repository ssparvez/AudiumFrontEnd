import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { JwtHelper, tokenNotExpired } from "angular2-jwt";
import { Http, RequestOptions, Headers } from '@angular/http';
import { CustomerAccount } from "../../classes/CustomerAccount";
import { GeneralService } from "../general/general.service";
import { DataService } from "../data.service";
// Errors
import { AppError } from "../../errors/AppError";
import { NotFoundError } from "../../errors/not-found-error";
import { ServerError } from "../../errors/server-error";
import { PlaybackService } from "../playback/playback.service";
import { UserPreferences } from '../../classes/UserPreferences';

@Injectable()
export class AuthenticationService {

  constructor(private http: Http,
              private dataService: DataService,
              private currentUser: CustomerAccount,
              private playbackService: PlaybackService,
              private service: GeneralService) { }


  login(credentials) {
  /*  const headers = new Headers();
    headers.append('content-type', 'application/json');
    const options = new RequestOptions({ headers: headers});*/
    return this.http.post( this.dataService.connectionURL + '/login', credentials
      ).map(response => {
        const result = {
          token: response['_body']
        };
        if ( result && result.token) {
          localStorage.setItem('token', result.token);
          console.log(this.currentUserInfo.isValid);
          if ( this.currentUserInfo.isValid) {
            this.storeInfo();
            if ( this.currentUserInfo.role === 'BasicUser' || this.currentUserInfo.role === 'PremiumUser') {
              this.loadPersonalizedData();
            }
            return 1;
          }
          else {
            return 2;
          }
        } else {
          return 0;
        }
      });
  }

  logout() {
    if(this.playbackService.getPlayback() != undefined && this.playbackService.getPlayback().state() === "loaded")  {
      this.playbackService.getPlayback().unload();
    }
    sessionStorage.clear();
    localStorage.clear();
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

  loadPersonalizedData() {
    this.service.get('/accounts/'+ this.currentUser.accountId +'/preferences').subscribe(
      preferences => {
        localStorage.setItem("sessionPrivacy", JSON.stringify( {private: !(preferences.defaultPublicSession)} ));
        sessionStorage.setItem("sessionPrivacy", JSON.stringify( {private: !(preferences.defaultPublicSession)} ));
        localStorage.setItem("preferences", JSON.stringify(preferences));
        sessionStorage.setItem("preferences", JSON.stringify(preferences));
      }, (error: AppError) => {
        console.log("auth Prefs: error");
      }
    );
    this.service.get('/accounts/'+ this.currentUser.accountId +'/playlists/allfollowed').subscribe(
      playlistIds => {
        localStorage.setItem("playlistsfollowed", JSON.stringify(playlistIds));
        console.log(playlistIds);
      }, (error: AppError) => {
      }
    );
    this.service.get('/accounts/'+ this.currentUser.accountId +'/artists/allfollowed').subscribe(
      artistIds => {
        localStorage.setItem("artistsfollowed", JSON.stringify(artistIds));
        console.log(artistIds);
      }, (error: AppError) => {
      }
    );
    this.service.get('/accounts/'+ this.currentUser.accountId +'/albums/allsaved').subscribe(
      albumIds => {
        localStorage.setItem("albumssaved", JSON.stringify(albumIds));
      }, (error: AppError) => {
      }
    );
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


