import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import {Playlist} from "../../../../../classes/Playlist";
import {GeneralService} from "../../../../../services/general/general.service";
import {AppError} from "../../../../../errors/AppError";
import {Song} from "../../../../../classes/Song";
import {MzToastService} from "ng2-materialize";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
  animations: [
    trigger('fade',[
      transition('* => void',[
        animate(600, style({opacity: 0}))
      ])
    ])
  ]
})

export class PlaylistComponent implements OnInit {

  private id;
  public playlist: Playlist;
  public songsInPlaylist: Song[] = null;
  public isPlaying;
  private currentUser;
  private currentAccountId;
  public numberOfSongs = 0;
  public songCounter = 0;
  public playbackCondition: string = "play_arrow";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: GeneralService,
    private toastService: MzToastService ) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountId = this.currentUser['_accountId'];
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.service.get('/playlist/' + this.id + '/' + this.currentAccountId ).subscribe((playlist) => {
        console.log(playlist);
        this.playlist = playlist;
        this.loadSongs(this.playlist.playlistId);
      });
    });
  }

  isOwnerOfPlaylist() {
    return (this.playlist.accountId === this.currentAccountId);
  }

  isFollowing() {
    return this.playlist.followed;
  }

  loadSongs(playlistId: number) {
    this.service.get('/playlist/' + playlistId + '/songs').subscribe(
      songs => {
        this.songsInPlaylist = songs;
        this.numberOfSongs = this.songsInPlaylist.length;
        console.log(this.songsInPlaylist);
      }, (error: AppError) => {
        this.songsInPlaylist = null;
      }
    );
  }

  changeFollowStatus(status) {
      this.service.post('/account/' + this.currentAccountId + '/playlist'  + this.id + '/follow/'
        + status, "")
        .subscribe(
        response => {
          this.playlist.followed = status;
          if (status) {
            this.toastService.show("You are now following this playlist", 3000, 'blue');
          } else {
            this.toastService.show("You are no longer following this playlistt", 3000, 'blue');
          }
        }, (error: AppError) => {
            this.toastService.show("Playlist follow status could not be changed", 3000, 'blue');
        }
      );
  }

  pausePlayback() {

    this.isPlaying = false;
    this.playbackCondition= "play_arrow";
  }

  playPlayback() {
    this.isPlaying = true;
  }
  playbackSong($event: MouseEvent) {
    this.isPlaying = !this.isPlaying;
    if ( this.isPlaying) {
      $event.srcElement.innerHTML = "pause";
    } else {
      $event.srcElement.innerHTML = "play_arrow";
    }

  }

}

