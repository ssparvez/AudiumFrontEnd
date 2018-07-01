import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { MzToastService } from 'ng2-materialize';
import { Song } from '../../../../../classes/Song';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlaybackService } from '../../../../../services/playback/playback.service';

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
    private playbackService: PlaybackService
  ) { }

  ngOnInit() {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null) this.accountId = currUser._accountId;

    if(this.accountId != null){
      this.generalService.get("/accounts/" + this.accountId + "/songs").subscribe((songs) => {
        this.songs = songs;
        console.log(this.songs);
      });
    }
  }

  playAllSongs(song: Song) {
    if(this.songs.length > 0) {
      this.toastService.show('Playing All Songs!', 4000, 'blue');
      this.playbackService.loadSongQueue(this.songs);
      this.playbackService.playSong(this.songs[0])
    }
  }

  playbackSong($event: MouseEvent, song:Song) {
    song.isPlaying = !song.isPlaying;
  }
}
