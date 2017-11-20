import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {
  accountId: number;
  artists: Artist[]
  constructor(
    private router: Router,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
    this.generalService.get("/accounts/" + this.accountId + "/artists").subscribe((artists) => {
      this.artists = artists
      console.log(this.artists);
    });
  }
}
