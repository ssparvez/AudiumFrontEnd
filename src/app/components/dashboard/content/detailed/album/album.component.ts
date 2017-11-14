import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {
  songs: number[];
  constructor() { }

  ngOnInit() {
    this.songs = [1,2,3,4,5,6,7]
  }
}
