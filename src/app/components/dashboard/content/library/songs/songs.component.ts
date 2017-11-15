import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { LibraryService } from '../../../../../services/library/library.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  songs: Song []; // Store retrieved songs in this var
  constructor(private toastService: MzToastService, private libraryService: LibraryService) { }

  ngOnInit() {
    this.libraryService.getAllSongs().subscribe((songs) => {
      this.songs = songs
      console.log(this.songs);
    });
  }

  playAllSongs() {
    this.toastService.show('Playing Song!', 4000, 'blue');
  }

}

interface Song {
  id: number,
  title: string,
  //artists: Artist [],
  //album: Album []
  artistId: number,
  artistName: string,
  albumId: number,
  albumTitle: string,
  file: string,
  timeAdded: number
}

interface Artist {
  artistId: number,
  artistName: string
}

interface Album {
  albumId: number,
  title: string
}
