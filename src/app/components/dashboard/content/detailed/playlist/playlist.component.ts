import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
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
  songsInPlaylist: Song[];
  private currentUser;
  private currentAccountId;
  public numberOfSongs = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: GeneralService,
    private toastService: MzToastService ) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountId = this.currentUser['_accountId'];
  }

  ngOnInit() {
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
      this.service.post('/account/followstatus/' + this.currentAccountId + '/playlist'  + this.id + '/'
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

}
