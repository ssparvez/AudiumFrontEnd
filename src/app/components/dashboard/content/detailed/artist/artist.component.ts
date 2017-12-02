import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';
import { Song } from '../../../../../classes/Song';
import { Event } from '../../../../../classes/Event';
import { Address } from '../../../../../classes/Address';
import {MzToastService} from "ng2-materialize";
import {AppError} from "../../../../../errors/AppError";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
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
export class ArtistComponent implements OnInit {

  private id;
  artist: Artist;
  mediaPath: string;
  events: Event[];
  showAllSongs: boolean;
  showAllAlbums: boolean;
  public currentAccountId: number;
  public isPlaying;
  public playbackCondition = "play_circle_outline";
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService,
    private toastService: MzToastService
  ) {
    this.currentAccountId = JSON.parse(sessionStorage.getItem("currentUser"))['_accountId'];
    this.showAllSongs = false;
    this.showAllAlbums = false;
  }


  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.events = [];
    this.mediaPath = this.dataService.mediaURL;
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      // Get artist
      this.generalService.get("/artists/" + this.id).subscribe((artist) => {
        this.artist = artist;
        this.assignFollowStatus();
        // get artist songs
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

  playArtistSongs(index: number, songs: Song[]): void {
    this.playerService.loadSongs(index, songs);
  }

  playAlbumSongs(albumId: number) {
    this.generalService.get( "/albums/" + albumId + "/songs").subscribe((songs) => {
      this.playerService.loadSongs(0, songs);
    });
  }
  navigateToMaps(address: Address) {
    window.open("https://maps.google.com/?q=" + address.addressLine1 + ", " + address.city + " " + address.state, "_blank");
}

  changeFollowStatus(status) {
    this.generalService.update('/accounts/' + this.currentAccountId + '/artist/'  + this.id + '/follow/'
      + status, "")
      .subscribe(
        response => {
          this.artist.followed = status;
          if (status) {
            this.addArtistToFollow();
            this.toastService.show("You are now following this artist", 3000, 'blue');
          } else {
            this.removeArtistFromFollowed();
            this.toastService.show("Artist was unfollowed", 3000, 'blue');
          }
        }, (error: AppError) => {
          this.toastService.show("Artist follow status could not be changed", 3000, 'red');
        }
      );
  }

  isFollowing(): boolean {
    return this.artist.followed;
  }

  assignFollowStatus(): void {
    const artistsFollowed: number[] = JSON.parse(localStorage.getItem("artistsfollowed"));
    if (artistsFollowed.find( x => x === this.artist.artistId) != null ) {
      this.artist.followed = true;
    }
  }

  removeArtistFromFollowed() {
    const artistsFollowed: number[] = JSON.parse(localStorage.getItem("artistsfollowed"));
    artistsFollowed.splice(artistsFollowed.indexOf(this.artist.artistId),1);
    localStorage.setItem("artistsfollowed", JSON.stringify(artistsFollowed));
  }

  addArtistToFollow() {
    const artistsFollowed: number[] = JSON.parse(localStorage.getItem("artistsfollowed"));
    artistsFollowed.unshift(this.artist.artistId);
    localStorage.setItem("artistsfollowed", JSON.stringify(artistsFollowed));
  }

  pausePlayback($event: MouseEvent, albumId) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlayback($event: MouseEvent, albumId) {
    this.playAlbumSongs(albumId);
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playbackSong($event: MouseEvent, song:Song) {
    this.isPlaying = !this.isPlaying;
    song.isPlaying = !song.isPlaying;

  }
}
