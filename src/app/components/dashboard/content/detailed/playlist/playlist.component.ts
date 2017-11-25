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
        animate(300, style({opacity: 0}))
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
  public playbackCondition = "play_circle_outline";

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
      window.scrollTo(0, 0);
    });
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.service.get('/playlist/' + this.id + '/' + this.currentAccountId ).subscribe((playlist) => {
        this.playlist = playlist;
        this.assignFollowStatus();
        this.loadSongs(this.playlist.playlistId);
      });
    });
  }

  isOwnerOfPlaylist() {
    return (this.playlist.accountId === this.currentAccountId);
  }

  isFollowing(): boolean {
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
      this.service.update('/accounts/' + this.currentAccountId + '/playlist/'  + this.id + '/follow/'
        + status, "")
        .subscribe(
        response => {
          this.playlist.followed = status;
          if (status) {
            this.addPlaylistToFollow();
            this.toastService.show("You are now following this playlist", 3000, 'blue');
          } else {
            this.removePlaylistFromFollowed();
            this.toastService.show("You are no longer following this playlistt", 3000, 'blue');
          }
        }, (error: AppError) => {
            this.toastService.show("Playlist follow status could not be changed", 3000, 'blue');
        }
      );
  }

  assignFollowStatus(): void {
    const playlistsFollowed = JSON.parse(localStorage.getItem("playlistsfollowed"));
    if (playlistsFollowed.find( x => x === this.playlist.playlistId) != null ) {
      this.playlist.followed = true;
    }
  }
  removePlaylistFromFollowed() {
    const playlistsFollowed: number[] = JSON.parse(localStorage.getItem("playlistsfollowed"));
    playlistsFollowed.splice(playlistsFollowed.indexOf(this.playlist.playlistId),1);
    localStorage.setItem("artistsfollowed", JSON.stringify(playlistsFollowed));
  }

  addPlaylistToFollow() {
    const playlistsFollowed: number[] = JSON.parse(localStorage.getItem("playlistsfollowed"));
    playlistsFollowed.unshift(this.playlist.playlistId);
    localStorage.setItem("playlistsfollowed", JSON.stringify(playlistsFollowed));
  }
  pausePlayback(playlistId) {

    this.isPlaying = false;
    this.playbackCondition= "play_arrow";
  }

  playPlayback(playlistId) {
    this.isPlaying = true;
  }

  playbackSong($event: MouseEvent, song:Song) {
    this.isPlaying = !this.isPlaying;
    song.isPlaying = !song.isPlaying;

  }

}

