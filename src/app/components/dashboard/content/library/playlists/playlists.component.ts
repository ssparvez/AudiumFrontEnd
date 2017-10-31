import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';


@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists : Playlist[]
  constructor(private libraryService : LibraryService) { }

  ngOnInit() {
    this.libraryService.getAllPlaylists().subscribe((playlists) => {
      this.playlists = playlists
    });
  }

}

interface Playlist {
  name: string,
  description: string
}