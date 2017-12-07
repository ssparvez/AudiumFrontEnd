import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
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
    private router: Router,
    private toastService: MzToastService,
    private generalService: GeneralService,
    private playerService: PlayerService
  ) { }

  ngOnInit() {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.accountId = currUser._accountId;
    }
    if(this.accountId != null){
      this.generalService.get("/accounts/" + this.accountId + "/songs").subscribe((songs) => {
        this.songs = songs;
        console.log(this.songs);
      });
    }
  }

  playAllSongs() {
    this.toastService.show('Playing Song!', 4000, 'blue');
  }

  playLibrarySongs(index: number) {
    // initialize howl here?
    // this.songs[index].isPlaying = true; used to change the play button
    this.playerService.loadSongs(index, this.songs);
    console.log(index);
  }

  playbackSong($event: MouseEvent, song:Song) {
    song.isPlaying = !song.isPlaying;
  }

}
