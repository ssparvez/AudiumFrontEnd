import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { MzModalService } from 'ng2-materialize';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';
import { Router } from "@angular/router";


@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists : Playlist[]
  constructor(
    private router: Router,
    private libraryService : LibraryService,
    private modalService : MzModalService
  ) { }

  ngOnInit() {
    this.libraryService.getAllPlaylists().subscribe((playlists) => {
      this.playlists = playlists;
      console.log(this.playlists);
    });
  }
  
  viewPlaylist(playlistId : number) {
	console.log("playlist #" + playlistId);
    this.router.navigate(['/dash/playlist/', playlistId]);
  }

  openAddPlaylistForm() {
    this.modalService.open(PlaylistModalComponent);
  }

}

interface Playlist {
  playlistId: number,
  name: string,
  description: string,
  isPublic: boolean,
  accountId: number,
  username: string
}