import { Component, Input, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
  
})
export class PlaylistComponent implements OnInit {

  private id;
  playlist: Playlist
  
  constructor(
    private route: ActivatedRoute,
    private libraryService : LibraryService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.libraryService.getPlaylist(this.id).subscribe((playlist) => {
        this.playlist = playlist;
      });
      this.libraryService.getPlaylistSongs(this.id).subscribe((songs) => {
        this.playlist.songs = songs;
      });
    });
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
  file: string,
  timeAdded: number
}