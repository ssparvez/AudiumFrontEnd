import { Component, OnInit, Input } from '@angular/core';
import { Song } from '../../../../classes/Song';
import { Artist } from '../../../../classes/Artist';
import { Album } from '../../../../classes/Album';
import { Genre } from '../../../../classes/Genre';
import { Address } from '../../../../classes/Address';
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { GeneralService } from '../../../../services/general/general.service';
import { AppError } from '../../../../errors/AppError';
import { Playlist } from '../../../../classes/Playlist';
import { CustomerAccount } from '../../../../classes/CustomerAccount';
import { PlayerService } from '../../../../services/player/player.service';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  keywords: string;
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  profiles: CustomerAccount[];
  genres: Genre[];
  events: Event[];
  mediaPath: string;
  showAllSongs: boolean = false;
  showAllAlbums: boolean = false;
  showAllArtists: boolean = false;
  showAllPlaylists: boolean = false;
  showAllProfiles: boolean = false;
  showAllGenres: boolean = false;
  showAllEvents: boolean = false;
  public isPlaying;

  monthNames:      string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  monthNamesShort: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  today: string = ("" + new Date().getFullYear());

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService
  ) { }

  ngOnInit() {

    let date = new Date();
    if((date.getMonth()+1) < 10){
      this.today += "-0" + (date.getMonth()+1);
    }else{
      this.today += "-" + (date.getMonth()+1);
    }
    if(date.getDate() < 10){
      this.today += "-0" + date.getDate();
    }else{
      this.today += "-" + date.getDate();
    }

    this.mediaPath = this.dataService.mediaURL;
    this.route.params.subscribe(param => {
      this.keywords = param['keywords'];
      this.generalService.get("/search/songs/" + this.keywords).subscribe((songs) => {
        this.songs = songs;
        this.generalService.get("/search/artists/" + this.keywords).subscribe((artists) => {
          this.artists = artists;
          this.generalService.get("/search/albums/" + this.keywords).subscribe((albums) => {
            this.albums = albums;
            this.generalService.get("/search/playlists/" + this.keywords).subscribe((playlists) => {
              this.playlists = playlists;
              this.generalService.get("/search/genres/" + this.keywords).subscribe((genres) => {
                this.genres = genres;
                this.generalService.get("/search/profiles/" + this.keywords).subscribe((profiles) => {
                  this.profiles = profiles;
                  this.generalService.get("/search/events/" + this.keywords).subscribe((events) => {
                    this.events = events;
                  });
                });
              });
            });
          });
        });

      });

      this.router.events.subscribe((event) => {
        if (!(event instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0);
      });
    });
  }

  getFullDate(date: string) {
    return this.monthNames[(+date.substring(5,7))-1] + ' ' + parseInt(date.substring(8,10)) + ', ' + date.substring(0,4)
  }

  navigateToMaps(address: Address) {
    window.open("https://maps.google.com/?q=" + address.addressLine1 + ", " + address.city + " " + address.state, "_blank");
  }

  navigateToTickets(eventTitle: string) {
    let navUrl: string = "https://www.ticketmaster.com/search?q=";
    let firstTerm: boolean = true;
    for(let term of eventTitle.replace("+", "%2B").split(" ")){
      if(!firstTerm){
        navUrl += "+";
      }else{
        firstTerm = false;
      }
      navUrl += term;
    }
    window.open(navUrl);
  }

  playSongs(index: number): void {
    this.playerService.loadSongs(index, this.songs);
  }

  playArtistSongs($event: MouseEvent, artistId: number): void {
    this.generalService.get("/artists/" + artistId + "/songs").subscribe((songs) => {
      this.playerService.loadSongs(0, songs);
    });
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playAlbumSongs($event: MouseEvent, albumId: number): void {
    this.generalService.get("/albums/" + albumId + "/songs").subscribe((songs) => {
      this.playerService.loadSongs(0, songs);
    });
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlaylistSongs($event: MouseEvent, playlistId: number): void {
    this.generalService.get("/playlist/" + playlistId + "/songs").subscribe((songs) => {
      this.playerService.loadSongs(0, songs);
    });
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  pausePlayback($event: MouseEvent) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

}
