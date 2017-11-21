import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { Song } from '../../../../../classes/Song';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private id;
  artist: Artist;
  // generic placeholder object
  things = [1,2,3,4,5]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generalService : GeneralService,
    private playerService : PlayerService
  ) {}


  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      // get artist
      this.generalService.get("/artists/" + this.id).subscribe((artist) => {
        this.artist = artist;
        // get artist songs
		    this.generalService.get("/artists/" + this.id + "/songs").subscribe((songs) => {
          this.artist.songs = songs;
          console.log(this.artist.songs);
          // get artist albums
          this.generalService.get("/artists/" + this.id + "/albums").subscribe((albums) => {
            this.artist.albums = albums;
          });
        });
      });
    });
  }

  playArtistSongs(index: number, songs: Song[]) : void {
    this.playerService.playSongs(index, songs);
  }

  playAlbumSongs(albumId: number) {
    this.generalService.get( "/albums/" + albumId + "/songs").subscribe((songs) => {
      this.playerService.playSongs(0, songs);
    });
  }

}