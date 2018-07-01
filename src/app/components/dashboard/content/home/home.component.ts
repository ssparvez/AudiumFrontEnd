import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewChecked, Component, ChangeDetectorRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../../../services/general/general.service';
import { AuthenticationService } from '../../../../services/authentication/authentication.service';
import { CustomerAccount } from "../../../../classes/CustomerAccount";
import { Router, NavigationEnd } from "@angular/router";
import { Observable } from 'rxjs/Rx';
import { Song } from '../../../../classes/Song';
import { Genre } from '../../../../classes/Genre';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[animate(500, style({opacity: 1}))]),
      transition('* => void',[animate(500, style({opacity: 0}))])
    ])
  ]
})
export class HomeComponent implements OnInit {
  recentListens: Song[];
  topSongs: Song[];
  genres: Genre[];
  mediaPath: string;
  showAllGenres: boolean = false;
  @ViewChild('recentListensCollection') public recentListensCollection: ElementRef;
  public isPlaying;
  constructor(
    private generalService: GeneralService,
    private authenticationService: AuthenticationService,
    public currentUser: CustomerAccount,
    private cdRef: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    this.mediaPath = environment.mediaURL;
    if(this.authenticationService != null && this.authenticationService.currentUserInfo != null){
      this.currentUser = this.authenticationService.currentUserInfo;
    }

    if(this.currentUser != null && this.currentUser.accountId != null) {
      this.generalService.get("/accounts/" + this.currentUser.accountId + "/albums/recent/0/4")
        .catch(error => Observable.throw(new Error(error.status))).subscribe((recentListens) => {
          if(recentListens != null) this.recentListens = recentListens;
          else this.recentListens = [];

          this.generalService.get("/songs/top/0/5")
            .catch(error => Observable.throw(new Error(error.status))).subscribe((songs) => {
              if(songs != null) this.topSongs = songs;
              else this.topSongs = [];
    
              this.generalService.get("/genres")
                .catch(error => Observable.throw(new Error(error.status))).subscribe((genres) => {
                  if(genres != null) this.genres = genres;
                  else this.genres = [];
              });
          });
      });
    }
  }

  ngAfterViewChecked() {
    if(this.recentListensCollection != null) this.cdRef.detectChanges();
  }

  pausePlayback($event: MouseEvent, albumId) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlayback($event: MouseEvent, albumId) {
    this.isPlaying = true;
    //this.playRecentSongs(albumId);
    $event.preventDefault();
    $event.stopPropagation();
  }
}
