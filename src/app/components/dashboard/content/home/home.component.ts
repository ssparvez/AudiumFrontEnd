import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../../services/home/home.service'
import { GeneralService } from '../../../../services/general/general.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CustomerAccount } from "../../../../classes/customer-account.service";
import { Router } from "@angular/router";

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
    private homeService : HomeService,
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
      this.generalService.get("/accounts/" + this.currentUser.accountId + "/albums/recent/0/4").subscribe((recentListens) => {
        this.recentListens = recentListens;
      });
      this.generalService.get("/songs/top/0/5").subscribe((songs) => {
        this.topSongs = songs;
      });
      this.homeService.getAllGenres().subscribe((genres) => {
        this.genres = genres;
      });
    }
  }
}
interface Genre {
  genreId: string,
  genreName: string
}


interface Artist {
  artistId: number,
  artistName: string,
  bio: string,
  albums: Album[],
  songs: Song[]
}

interface Album {
  albumId: number,
  albumTitle: string,
  releaseYear: string,
  artistId: number,
  artistName: string,
  songs: Song[]
}

interface Song {
  songId: number,
  title: string,
  artistId: number,
  artistName: string,
  albumId: number,
  albumTitle: string,
  duration: number,
  isExplicit: boolean,
  year: string,
  genreId: number,
  genreName: string,
  playCount: number
}

