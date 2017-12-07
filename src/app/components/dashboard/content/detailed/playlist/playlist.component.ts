import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Playlist } from "../../../../../classes/Playlist";
import { GeneralService } from "../../../../../services/general/general.service";
import { AppError } from "../../../../../errors/AppError";
import { Song } from "../../../../../classes/Song";
import { MzToastService } from "ng2-materialize";
import { animate, style, transition, trigger } from "@angular/animations";
import {PlaybackService} from "../../../../../services/playback/playback.service";

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
  private previousSongPlaying: number;

  public playbackCondition = "play_circle_outline";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: GeneralService,
    private playbackService: PlaybackService,
    private toastService: MzToastService ) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null) {
      this.currentAccountId = this.currentUser['_accountId'];
    }

  }

  ngOnInit() {
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
        // this.playbackService.loadSongQueue(this.songsInPlaylist);
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
            this.toastService.show("Playlist follow status could not be changed", 3000, 'red');
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

  pausePlayback($event: MouseEvent, playlistId) {
    this.isPlaying = false;
    this.playbackCondition= "play_arrow";
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlayback($event: MouseEvent, playlistId) {
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playbackSong($event: MouseEvent, song:Song) {
    this.isPlaying = !this.isPlaying;
    song.isPlaying = !song.isPlaying;
  }

  playSong(song: Song, index) {
    if (this.playbackService.playSongFromQueue(index)) {
      if ( this.previousSongPlaying !== undefined && this.previousSongPlaying !== index) {
        this.songsInPlaylist[this.previousSongPlaying].isPlaying = false;
      }
      this.previousSongPlaying = index;
      song.isPlaying = true;
      this.isPlaying = true;
      this.playbackService.getPlayback()
        .on('play', () => {
        this.songsInPlaylist[this.previousSongPlaying].isPlaying = true; }
        ).on('pause', () => {
        this.songsInPlaylist[this.previousSongPlaying].isPlaying = false; }
        );
    }
  }

  pauseSong(song: Song) {
    song.isPlaying = false;
    this.isPlaying = false;
    this.playbackService.pause();
  }

}

