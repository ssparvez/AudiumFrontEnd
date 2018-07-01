import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { mediaURL } from '../../../../../../environments/environment';
import {trigger, transition, style, animate} from "@angular/animations";
import { PlaybackService } from '../../../../../services/playback/playback.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[animate(300, style({opacity: 0}))]),
      transition('* => void',[animate(300, style({opacity: 0}))])
    ])
  ]
})
export class ArtistsComponent implements OnInit {
  mediaPath: string;
  accountId: number;
  artists: Artist[];
  public isPlaying: boolean;
  constructor(
    private router: Router,
    private generalService: GeneralService,
    private playbackService: PlaybackService,
  ) {}loadSongs

  ngOnInit() {

    this.mediaPath = mediaURL;
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null) this.accountId = currUser._accountId;

    if(this.accountId != null){
      this.generalService.get("/accounts/" + this.accountId + "/artists").subscribe((artists) => {
        this.artists = artists
        console.log(this.artists);
      });
    }
  }
  playSongs(artistId: number) {
    this.generalService.get("/artists/" + artistId + "/songs").subscribe((songs) => {
    this.playbackService.loadSongQueue(songs);
    this.playbackService.playSongFromQueue(0);    });
  }

  pausePlayback($event: MouseEvent) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlayback($event: MouseEvent) {
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }
}
