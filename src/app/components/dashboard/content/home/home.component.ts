import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../../services/general/general.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CustomerAccount } from "../../../../classes/CustomerAccount";
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import { Song } from '../../../../classes/Song';
import { Genre } from '../../../../classes/Genre';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  recentListens: Song[];
  topSongs: Song[];
  genres: Genre[];
  constructor(
    private generalService : GeneralService,
    private authenticationService : AuthenticationService,
    private currentUser : CustomerAccount,
    private router : Router
  ) { }

  ngOnInit() {
    if(this.authenticationService != null && this.authenticationService.currentUserInfo != null){
      this.currentUser = this.authenticationService.currentUserInfo;
    }

    if(this.currentUser != null && this.currentUser.accountId != null){
      this.generalService.get("/accounts/" + this.currentUser.accountId + "/albums/recent/0/4")
        .catch(error => Observable.throw(new Error(error.status))).subscribe((recentListens) => {
          if(recentListens != null){
            this.recentListens = recentListens;
          }else{
            this.recentListens = [];
          }
          this.generalService.get("/songs/top/0/5")
            .catch(error => Observable.throw(new Error(error.status))).subscribe((songs) => {
              if(songs != null){
                this.topSongs = songs;
              }else{
                this.topSongs = [];
              }
              this.generalService.get("/genres")
                .catch(error => Observable.throw(new Error(error.status))).subscribe((genres) => {
                  if(genres != null){
                    this.genres = genres;
                  }else{
                    this.genres = [];
                  }
              });
          });
      });
    }
  }
}
