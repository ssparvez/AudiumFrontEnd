import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { Router, NavigationEnd } from "@angular/router";
import { GeneralService } from "../../../../../services/general/general.service";
import { CreatePlaylistComponent } from "../../../../../modals/create-playlist/create-playlist.component";
import {AppError} from "../../../../../errors/AppError";
import {animate, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material";
import {Playlist} from "../../../../../classes/Playlist";

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        animate(300, style({opacity: 0}))
      ]),
      transition('* => void',[
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[];
  public currentUser: JSON;
  public isPlaying: boolean;
  public currentAccountId: number;
  public emulateCardContentHover: string[];
  public emulateCardContentHoverIcon: string[];


  constructor(private router: Router,
              private dialog: MatDialog,
              private toastService: MzToastService,
              private service: GeneralService,) {

    this.emulateCardContentHover = [];
    this.emulateCardContentHoverIcon = [];
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountId = this.currentUser['_accountId'];
    }
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.service.get("/accounts/" + this.currentAccountId + "/playlists").subscribe((playlists) => {
      this.playlists = playlists;
      console.log(this.playlists);
    });
    if(this.currentUser == null){
      this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    }
  }

  viewPlaylist(playlistId: number) {
    this.router.navigate(['/dash/playlist/', playlistId]);
  }


  openNewPlaylistForm() {
    this.dialog.open(CreatePlaylistComponent, {
      data: {
        accountId: this.currentUser['_accountId'],
        username: this.currentUser['_username'],
        isNew: true
      }, width: '600px'
    })
      .afterClosed()
      .subscribe(result => {
        if (result && result.isValid) {
          this.playlists.unshift(result.playlistAdded);
          this.toastService.show("Playlist was created", 3000, 'blue');
        }
      });
  }

  emulateContentHover(index: number, emulate: boolean) {
    if (emulate) {
      this.emulateCardContentHover[index] = 'card-content-emulated-hover';
      this.emulateCardContentHoverIcon[index] = '';
    } else {
      this.emulateCardContentHover[index] = '';
      this.emulateCardContentHoverIcon[index] = 'text-darken-1';
    }
  }

  pausePlayback($event: MouseEvent, playlistId) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlayback($event: MouseEvent, playlistId) {
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  checkOwnership(playlistOwner): boolean {
    return ( this.currentAccountId === playlistOwner);
  }
}


