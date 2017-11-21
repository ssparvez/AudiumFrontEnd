import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { Router } from "@angular/router";
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
        animate(600, style({opacity: 0}))
      ]),
      transition('* => void',[
        animate(600, style({opacity: 0}))
      ])
    ])
  ]
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[];
  public currentUser: JSON;
  public isPlaying;
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
    this.currentAccountId = this.currentUser['_accountId'];

  }

  ngOnInit() {
    this.service.get("/accounts/" + this.currentAccountId + "/playlists").subscribe((playlists) => {
      this.playlists = playlists;
      for (let playlist of playlists) {
        this.emulateCardContentHover.push('');
        this.emulateCardContentHoverIcon.push('text-darken-1');
      }
      console.log(this.playlists);
    });
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  viewPlaylist(playlistId: number) {
    console.log("playlist #" + playlistId);
    this.router.navigate(['/dash/playlist/', playlistId]);
  }


  openNewPlaylistForm() {
    this.dialog.open(CreatePlaylistComponent, {
      data: {
        accountId: this.currentUser['_accountId'],
        username: this.currentUser['_username']
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

  playbackControl(isPlaying) {

    this.isPlaying = !isPlaying;
  }


  checkOwnership(playlistOwner): boolean {
    return ( this.currentAccountId === playlistOwner);
  }
}


