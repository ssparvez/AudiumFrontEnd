import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  mediaPath: string;
  accountId: number;
  artists: Artist[]
  constructor(
    private router: Router,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.mediaPath = this.dataService.mediaURL;
    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
    this.generalService.get("/accounts/" + this.accountId + "/artists").subscribe((artists) => {
      this.artists = artists
      console.log(this.artists);
    });
  }
  playSongs(artistId: number) {
    this.generalService.get("/artists/" + artistId + "/songs").subscribe((songs) => {
      this.playerService.playSongs(0, songs);
    });
  }
}
