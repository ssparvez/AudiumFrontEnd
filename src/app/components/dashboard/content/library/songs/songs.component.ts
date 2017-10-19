import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  songs: number[]; // store retrieved songs in this var
  constructor(private toastService: MzToastService) { }

  ngOnInit() {
    this.songs = [1,2,3,4,5,6,7,8,9,10,11,12]
  }

  playAllSongs() {
    this.toastService.show('Playing Song!', 4000, 'blue');
  }

}
