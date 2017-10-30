import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { SongsService } from '../../../../../services/songs/songs.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  songs: Song []; // store retrieved songs in this var
  constructor(private toastService: MzToastService, private songsService: SongsService) { }

  ngOnInit() {
    this.songsService.getAll().subscribe((songs) => {
      this.songs = songs
    });
  }

  playAllSongs() {
    this.toastService.show('Playing Song!', 4000, 'blue');
  }

}

interface Song {
  id: string,
  title: string,
  artists: Artist [],
  album: string
}

interface Artist {
  name: string
}
