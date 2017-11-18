import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { MzModalService, MzToastService } from 'ng2-materialize';
import { Router } from "@angular/router";
import { GeneralService } from "../../../../../services/general/general.service";
import { MdDialog } from "@angular/material";
import { CreatePlaylistComponent } from "../../../../../modals/create-playlist/create-playlist.component";


@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[];
  public currentUser: JSON;
  public currentAccountId: number;
  public emulateCardContentHover: string[];
  public emulateCardContentHoverIcon: string[];

  constructor(
    private router: Router,
    private libraryService: LibraryService,
    private dialog: MdDialog,
    private toastService: MzToastService
  )
  {
    this.emulateCardContentHover = [];
    this.emulateCardContentHoverIcon = [];
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountId = this.currentUser['_accountId'];
  }

  ngOnInit() {
    this.libraryService.getAllPlaylists().subscribe((playlists) => {
      this.playlists = playlists;
      for (let playlist of playlists){
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
    this.dialog.open(CreatePlaylistComponent,{ data: {accountId: this.currentUser['_accountId'],
      username: this.currentUser['_username']}, width: '600px'} )
      .afterClosed()
      .subscribe(result => {
        if ( result.isValid ) {
          this.playlists.unshift(result.playlistAdded);
          this.toastService.show("Playlist was created", 3000, 'blue');
        }
      });
  }

  openMenu(value) {
    console.log(value);
    return true; // Returning false from this function causes issues with right-click context menu
  }

  emulateContentHover(index: number, emulate: boolean) {
    if (emulate) {
      this.emulateCardContentHover[index] = 'card-content-emulated-hover';
      this.emulateCardContentHoverIcon[index] = '';
    }else{
      this.emulateCardContentHover[index] = '';
      this.emulateCardContentHoverIcon[index] = 'text-darken-1';
    }
  }


}

interface Playlist {
  playlistId: number;
  name: string;
  description: string;
  isPublic: boolean;
  accountId: number;
  username: string;
  songs: Song[];
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
  timeAdded: number
}
