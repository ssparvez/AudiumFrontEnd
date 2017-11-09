import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library/library.service';
import { MzModalService } from 'ng2-materialize';
import { PlaylistModalComponent } from './playlist-modal/playlist-modal.component';


@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists : Playlist[]
  constructor(private libraryService : LibraryService, private modalService : MzModalService) { }

  ngOnInit() {
    this.libraryService.getAllPlaylists().subscribe((playlists) => {
      this.playlists = playlists;
      console.log(this.playlists);
    });
  }

  openAddPlaylistForm() {
    this.modalService.open(PlaylistModalComponent);
  }

}

interface Playlist {
  name: string,
  description: string
}