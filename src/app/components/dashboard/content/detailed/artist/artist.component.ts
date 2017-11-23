import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';
import { Song } from '../../../../../classes/Song';
import { Event } from '../../../../../classes/Event';
import { Address } from '../../../../../classes/Address';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private id;
  artist: Artist;
  mediaPath: string;
  events: Event[];
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService
  ) {}


  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.events = [];
    this.mediaPath = this.dataService.mediaURL;
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      // Get artist
      this.generalService.get("/artists/" + this.id).subscribe((artist) => {
        this.artist = artist;
        // Get artist songs
		    this.generalService.get("/artists/" + this.id + "/songs").subscribe((songs) => {
          this.artist.songs = songs;
          console.log(this.artist.songs);
          // Get artist albums
          this.generalService.get("/artists/" + this.id + "/albums").subscribe((albums) => {
            this.artist.albums = albums;
            // Get artist upcoming events
            this.generalService.get("/artist/" + this.id + "/events").subscribe((events) => {
              this.artist.events = events;
            });
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
  navigateToMaps(address: Address){
    window.open("https://maps.google.com/?q=" + address.addressLine1 + ", " + address.city + " " + address.state, "_blank");
}
}
