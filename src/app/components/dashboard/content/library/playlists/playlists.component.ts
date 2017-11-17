import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { MzModalService, MzToastService } from 'ng2-materialize';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';
import { Router } from "@angular/router";
import {GeneralService} from "../../../../../services/general/general.service";
import {MdDialog} from "@angular/material";
import {CreatePlaylistComponent} from "../../../../../modals/create-playlist/create-playlist.component";


@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[];
  currentUser: JSON;

  constructor(
    private router: Router,
    private libraryService: LibraryService,
    private modalService: MzModalService,
    private dialog: MdDialog,
    private toastService: MzToastService
  ) { }

  ngOnInit() {
    this.libraryService.getAllPlaylists().subscribe((playlists) => {
      this.playlists = playlists;
      console.log(this.playlists);
    });
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  }

  viewPlaylist(playlistId: number) {
    console.log("playlist #" + playlistId);
    this.router.navigate(['/dash/playlist/', playlistId]);
  }

  openAddPlaylistForm() {
    this.modalService.open(PlaylistModalComponent);
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

  openMenu() {
    console.log('hi');
    return false;
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
  id: number;
  title: string;
  artistId: number;
  artistName: string;
  albumId: number;
  albumTitle: string;
  duration: number;
  isExplicit: boolean;
  timeAdded: number;
}

