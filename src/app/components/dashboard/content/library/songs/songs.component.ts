import { Component, OnInit } from '@angular/core';
import { MzToastService } from 'ng2-materialize';
import { Song } from '../../../../../classes/Song';
import { PlayerService } from '../../../../../services/player/player.service'
import { GeneralService } from '../../../../../services/general/general.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
  accountId: number;
  songs: Song []; // Store retrieved songs in this var
  constructor(
    private toastService: MzToastService, 
    private generalService: GeneralService, 
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;    
    this.generalService.get("/accounts/" + this.accountId + "/songs").subscribe((songs) => {
      this.songs = songs
      console.log(this.songs);
    });
  }

  playAllSongs() {
    this.toastService.show('Playing Song!', 4000, 'blue');
  }

  playLibrarySongs(index: number) {
    // initialize howl here?
    this.playerService.playSongs(index, this.songs);
    console.log(index);
  }

}