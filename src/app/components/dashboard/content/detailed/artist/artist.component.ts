import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Artist } from '../../../../../classes/Artist';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';
import { Song } from '../../../../../classes/Song';
import { Event } from '../../../../../classes/Event';
import { Address } from '../../../../../classes/Address';
import { Album } from '../../../../../classes/Album';
import { MzToastService } from "ng2-materialize";
import { AppError } from "../../../../../errors/AppError";
import { animate, style, transition, trigger } from "@angular/animations";

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
  similarArtists: Artist[];
  mediaPath: string;
  showAllSongs: boolean = false;
  showAllAlbums: boolean = false;
  showAllSimilarArtists: boolean = false;
  showAllEvents: boolean = false;
  public currentAccountId: number;
  public isPlaying;
  public playbackCondition = "play_circle_outline";
  monthNames:      string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
  monthNamesShort: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  today: string = ("" + new Date().getFullYear());

  // Stylization variables
  @ViewChild('artistBannerDiv') artistBannerDiv: ElementRef;
  bannerWidth: number = 800;
  bannerHeight: number = this.bannerWidth / 2;
  nPopularSongs: number = 10; // Number songs to show if showAllSongs == false
  nAlbumRows: number = 3; // Number of album card rows to show if showAllAlbums == false
  nAlbumsPerRow: number = 4; // Number of album cards per row (Must be a value in { 1, 2, 3, 4, 6, 12 })
  nMoreBtAlbumRows: number = 3; // Number of album rows in "Show all albums" card (Is equivalent to the number of of albus per row and must be a value in { 1, 2, 3, 4, 6, 12 })
  nSimilarArtistRows: number = 3;
  nSimilarArtistsPerRow: number = 4;
  albumCardWidth: number = ((this.bannerWidth * 0.92) / this.nAlbumsPerRow);
  similarArtistCardWidth: number = ((this.bannerWidth * 0.92) / this.nSimilarArtistsPerRow);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService,
    private toastService: MzToastService,
    private cdRef: ChangeDetectorRef
  ) {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.currentAccountId = currUser['_accountId'];
    }
  }


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
      this.id = + param['id'];
      console.log(this.id);
      // Get artist
      this.generalService.get("/artists/" + this.id).subscribe((artist) => {
        this.artist = artist;
        this.assignFollowStatus();
        // get artist songs
		    this.generalService.get("/artists/" + this.id + "/songs").subscribe((songs) => {
          this.artist.songs = songs;
          // Get artist albums
          this.generalService.get("/artists/" + this.id + "/albums").subscribe((albums) => {
            this.artist.albums = albums;
            // Get similar artists
            this.generalService.get("/artists/" + this.id + "/similar").subscribe((similarArtists) => {
              this.similarArtists = similarArtists;
              // Get artist upcoming events
              this.generalService.get("/artists/" + this.id + "/events").subscribe((events) => {
                this.artist.events = events;
              });
            });
          });
        });
      });
    });
  }

  ngAfterViewChecked() {
    if(this.artistBannerDiv != null && this.artistBannerDiv.nativeElement != null
        && this.artistBannerDiv.nativeElement.offsetWidth != null
        && this.artistBannerDiv.nativeElement.offsetWidth > 0){
      this.bannerWidth = this.artistBannerDiv.nativeElement.offsetWidth;
      this.bannerHeight = this.bannerWidth / 2;
      this.albumCardWidth = ((this.bannerWidth * 0.92) / this.nAlbumsPerRow);
      this.similarArtistCardWidth = ((this.bannerWidth * 0.92) / this.nSimilarArtistsPerRow);
      this.cdRef.detectChanges();
    }
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

  getFullDate(date: string) {
    return this.monthNames[(+date.substring(5,7))-1] + ' ' + parseInt(date.substring(8,10)) + ', ' + date.substring(0,4)
  }

  // Returns the materialize grid column class for an album card
  getAlbumCardGridClass(): string {
    return (" col m" + (12 / this.nAlbumsPerRow) + " ");
  }

  // Returns the size of the materialize icon used for the play/pause button on an album card
  getAlbumCardIconSize(): number {
    return (this.albumCardWidth / 2);
  }

  // Returns the materialize grid column class for an album art displayed inside the "Show all albums" card
  getMoreBtAlbumGridClass(): string {
    return (" col m" + (12 / this.nMoreBtAlbumRows) + " ");
  }

  // Returns whether or not to display "Show all albums" card
  getShowMoreAlbumsBt(): boolean {
    return ((!this.showAllAlbums) && this.artist.albums.length > (this.nAlbumRows * this.nAlbumsPerRow));
  }

  // Returns the index of the last album to display in "Show all albums" card
  getMoreBtAlbumsEndIndex(): number {
    if(this.showAllAlbums){
      return 0;
    }
    let nAlbums = (this.nAlbumRows * this.nAlbumsPerRow);
    let nBtAlbums = (nAlbums + (this.nMoreBtAlbumRows * this.nMoreBtAlbumRows)) - 1;
    return this.artist.albums.length > nBtAlbums ? (nBtAlbums - 1) : nBtAlbums;
  }

  // Returns whether or not to display hidden album count in "Show all albums" card
  getShowRemainingAlbumCount(): boolean {
    let nAlbums = (this.nAlbumRows * this.nAlbumsPerRow) - 1;
    let nBtAlbums = (this.nMoreBtAlbumRows * this.nMoreBtAlbumRows);
    return ((!this.showAllAlbums) && this.artist.albums.length > (nAlbums + nBtAlbums));
  }

  // Returns number of hidden albums
  getRemainingAlbumCount(): number {
    if(this.showAllAlbums){
      return 0;
    }
    let nAlbums = (this.nAlbumRows * this.nAlbumsPerRow) - 1;
    let nBtAlbums = (this.nMoreBtAlbumRows * this.nMoreBtAlbumRows) - 1;
    return this.artist.albums.length - (nAlbums + nBtAlbums);
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
    if (artistsFollowed != null) {
      if (artistsFollowed.find( x => x === this.artist.artistId) != null ) {
        this.artist.followed = true;
      }
      else {
        this.artist.followed = false;

      }
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

  pausePlayback($event: MouseEvent) {
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
