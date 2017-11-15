import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  topSongs: number[];
  albums: number[];
  constructor() { }

  ngOnInit() {
    this.topSongs = [1,2,3,4,5];
    this.albums = [1,2,3,4];
  }

}
