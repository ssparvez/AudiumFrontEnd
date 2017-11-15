import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
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
  }

}

interface Playlist {
  playlistId: number,
  name: string,
  description: string,
  isPublic: boolean,
  accountId: number,
  username: string,
  songs: Song[]
}

interface Song {
  id: number,
  title: string,
  artistId: number,
  artistName: string,
  albumId: number,
  albumTitle: string,
  duration: number,
  isExplicit: boolean,
  timeAdded: number
}