import { Component, OnInit } from '@angular/core';
import { Song } from '../../../../../classes/Song';
import { GeneralService } from '../../../../../services/general/general.service';

@Component({
  selector: 'app-artist-home',
  templateUrl: './artist-home.component.html',
  styleUrls: ['./artist-home.component.css']
})
export class ArtistHomeComponent implements OnInit {
  currentUser: JSON;
  songs: Song[];
  constructor(private generalService: GeneralService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));    
    this.generalService.get("/artists/" + this.currentUser['_accountId'] + "/songs").subscribe((songs) => {
      this.songs = songs;
      console.log(songs);
    });
  }

}
