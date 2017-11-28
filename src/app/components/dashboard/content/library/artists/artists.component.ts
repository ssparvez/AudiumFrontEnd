import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';
import {trigger, transition, style, animate} from "@angular/animations";

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        animate(300, style({opacity: 0}))
      ]),
      transition('* => void',[
        animate(300, style({opacity: 0}))
      ])
    ])
  ]
})
export class ArtistsComponent implements OnInit {
  mediaPath: string;
  accountId: number;
  artists: Artist[];
  public isPlaying;
  constructor(
    private router: Router,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService
  ) {}loadSongs

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });

    this.mediaPath = this.dataService.mediaURL;
    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
    this.generalService.get("/accounts/" + this.accountId + "/artists").subscribe((artists) => {
      this.artists = artists
      console.log(this.artists);
    });
  }
  playSongs(artistId: number) {
    this.generalService.get("/artists/" + artistId + "/songs").subscribe((songs) => {
      this.playerService.loadSongs(0, songs);
    });
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
