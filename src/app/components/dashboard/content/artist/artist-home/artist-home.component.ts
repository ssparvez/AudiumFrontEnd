import { Component, OnInit } from '@angular/core';
import { Artist } from '../../../../../classes/Artist';
import { Song } from '../../../../../classes/Song';
import { GeneralService } from '../../../../../services/general/general.service';
import {ColorHelper} from "@swimlane/ngx-charts"

@Component({
  selector: 'app-artist-home',
  templateUrl: './artist-home.component.html',
  styleUrls: ['./artist-home.component.css']
})
export class ArtistHomeComponent implements OnInit {
  colorScheme = {
    name: 'vivid',
    selectable: true,
    group: 'Ordinal',
    domain: [
      '#647c8a', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514'
    ]
  }

  data = [];
  artist: Artist;
  currentUser: JSON;
  songs: Song[];
  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    console.log("accountID: /artists/account/" + this.currentUser['_accountId']);
    this.generalService.get("/artists/account/" + this.currentUser['_accountId']).subscribe((artist) => {
      this.artist = artist;
      this.generalService.get("/artists/" + this.artist.artistId + "/songs").subscribe((songs) => {
        this.songs = songs;
        this.data = []; // not sure why this needs to be done;
        songs.slice(0,10).forEach((item, i, data) => { this.data.push({ name: (item.title), value: (item.playCount) }) });

        // for(let song of this.songs.slice(0,4)) {
        //   this.data.push({name: song.title, value: song.playCount})
        // }
        console.log(this.data);
        console.log(songs);
      });
    });
  }
}
