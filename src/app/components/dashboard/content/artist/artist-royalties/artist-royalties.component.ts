import { Component, OnInit } from '@angular/core';
import { Song } from '../../../../../classes/Song';
import { GeneralService } from '../../../../../services/general/general.service';

@Component({
  selector: 'app-artist-royalties',
  templateUrl: './artist-royalties.component.html',
  styleUrls: ['./artist-royalties.component.css']
})
export class ArtistRoyaltiesComponent implements OnInit {
  colorScheme = {
    name: 'vivid',
    selectable: true,
    group: 'Ordinal',
    domain: [
      '#647c8a', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a', '#f3e562', '#ff9800', '#ff5722', '#ff4514'
    ]
  }
  totalRevenue = 0;
  data = [];
  currentUser: JSON;
  songs: Song[];

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser")); 
    // /artists/accounts/{accountId}/stats   
    this.generalService.get("/artists/accounts/" + this.currentUser['_accountId'] + "/stats").subscribe((songs) => {
      for(let song of songs) { 
        this.totalRevenue += song.playCountLastMonth;
      }
      this.totalRevenue *= .08;
      this.songs = songs;
      this.data = []; // not sure why this needs to be done
      songs.slice(0,10).forEach((item, i, data) => { this.data.push({ name: (item.title), value: (item.playCountLastMonth * .08) }) });
      
      console.log("total = " + this.totalRevenue);      
      console.log(this.data);
      console.log(songs);
    });
  }

}
