import { animate, style, transition, trigger } from "@angular/animations";
import {
  AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Renderer2, Input, OnChanges, OnDestroy, OnInit,
  ViewChild, AfterContentInit, SimpleChanges, SimpleChange
} from '@angular/core';
import { Router } from "@angular/router";
import { Playlist } from '../../../../classes/Playlist';
import { Song } from '../../../../classes/Song';
import { DataService } from '../../../../services/data.service';
import { SafeHtmlPipe } from '../../../../pipes/safe-html.pipe';
import {PlaybackService} from "../../../../services/playback/playback.service";


@Component({
  selector: 'track-list-component',
  templateUrl: './track-list.component.html',
  styles: [':host { width: 100%; }'],
  styleUrls: ['./track-list.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        animate(500, style({opacity: 0}))
      ]),
      transition('* => void',[
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class TrackListComponent implements OnInit, OnChanges {

  public static DEFAULT_nRows: number = 10;
  private static DEFAULT_width: number;
  public static readonly injectedFlagClass: string = "track-list-collection-inject";

  public mediaPath: string;
  public currentAccountId: number;
  public playing: boolean = false;
  private lastSizeCheck: number;
  private _initialized: boolean = false;
  private _destroyed: boolean = false;
  private songCurrentlyPlaying: number;
  private previousSongPlaying: number;
  private isPlaying: boolean;

  public static readonly entityTypeString: string = 'song';
  public static readonly authorTypeString: string = 'artist';
  // Unique ID attribute of the collection entity type
  public static readonly idAttr: string = 'songId';
  public static readonly titleAttr: string = 'title';
  public static readonly authorAttr: string = 'artistId';
  public static readonly albumAttr: string = 'albumId';
  public static readonly genreAttr: string = 'genreId';
  // Secondary object is only used on some pages (search page, etc)
  public static readonly authorEntityAttr: string = 'artist';
  public static readonly authorNameAttr: string = 'artistName';
  public static readonly albumEntityAttr: string = 'album';
  public static readonly albumNameAttr: string = 'albumName';
  public static readonly genreEntityAttr: string = 'genre';
  public static readonly genreNameAttr: string = 'genreName';


  @ViewChild('mainDiv') public mainDiv: ElementRef;
  @ViewChild('headerDiv') public headerDiv: ElementRef;
  @ViewChild('titleDiv') public titleDiv: ElementRef;
  @ViewChild('subtitleDiv') public subtitleDiv: ElementRef;
  @ViewChild('footerDiv') public footerDiv: ElementRef;
  @Input('injectHeaderDiv') public injectHeaderDivSelector: string;
  @Input('injectTitleDiv') public injectTitleDivSelector: string;
  @Input('injectSubtitleDiv') public injectSubtitleDivSelector: string;
  @Input('injectFooterDiv') public injectFooterDivSelector: string;
  public injectedHeaderDiv: HTMLDivElement;
  public injectedTitleDiv: HTMLDivElement;
  public injectedSubtitleDiv: HTMLDivElement;
  public injectedFooterDiv: HTMLDivElement;
  private _headerDivInjected: boolean = false;
  private _titleDivInjected: boolean = false;
  private _subtitleDivInjected: boolean = false;
  private _footerDivInjected: boolean = false;


  // Input variables:

  @Input() private songs: Song[];

  @Input() public title: string = "";
  @Input() public noEntitiesMessage: string = "";
  @Input() public showAllBtText: string = "Show all";

  @Input() public titleUseHtml: boolean = false;
  // Determines whether all songs in collection are shown by default
  @Input() public showAll: boolean = false;
  // Determines whether "Show all" button is displayed when showAll == false but all entities don't fit in the specified grid size
  @Input() public displayShowAllBt: boolean = true;
  @Input() public displayPlayAllBt: boolean = false;

  @Input() public displayTrackNumber: boolean = true;
  @Input() public displayPlaying: boolean = true;
  @Input() public displaySongTitle: boolean = true;
  @Input() public displayArtist: boolean = true;
  @Input() public displayAlbum: boolean = true;
  @Input() public displayYear: boolean = false;
  @Input() public displayDuration: boolean = false;
  @Input() public displayExplicit: boolean = true;
  @Input() public displayLyrics: boolean = false;
  @Input() public displayTimeAdded: boolean = false;
  @Input() public displayTimePlayed: boolean = false;
  @Input() public displaySaved: boolean = false;
  @Input() public displayGenre: boolean = false;
  @Input() public displayPlayCount: boolean = false;
  @Input() public displayPlayCountLastMonth: boolean = false;

  @Input() public forceDisplayTitleDiv: boolean = false;
  @Input() public disablePlayPauseBt: boolean = false;
  @Input() public disableContextMenu: boolean = false;
  @Input() public disableDoubleClick: boolean = false;
  // If true, the loading animation will play until entities have loaded
  @Input() public loadingAnimation: boolean = true;
  @Input() public collectionPadding: boolean = true; // Technically disables the margin
  @Input() public entityPadding: boolean = true; // Technically disables the margin as well as the padding
  @Input() public collectionAddClass: string = '';
  @Input() public entityAddClass: string = '';


  @Input() public trackNumberHeader: string = '';
  @Input() public songTitleHeader: string = 'Title';
  @Input() public artistHeader: string = 'Artist';
  @Input() public albumHeader: string = 'Album';
  @Input() public yearHeader: string = 'Year';
  @Input() public durationHeader: string = 'Duration';
  @Input() public lyricsHeader: string = 'Lyrics';
  @Input() public timeAddedHeader: string = 'Added';
  @Input() public timePlayedHeader: string = 'Time Played';
  @Input() public savedHeader: string = 'Saved?';
  @Input() public genreHeader: string = 'Genre';
  @Input() public playCountHeader: string = 'Plays';
  @Input() public playCountLastMonthHeader: string = 'Plays (Last Month)';



  // Context menu variables:

  // Should be set to true if viewing a detailed page
  @Input() public detailed: boolean = false;
  @Input() public library: boolean = false;
  @Input() public inPlaylist: boolean = false;
  @Input() public inMusic: boolean = false;
  @Input() public currentPlaylist: Playlist;
  @Input() public playlistOwner: number;



  // Layout variables:

  // Number of entity card rows to show if showAll == false
  @Input() private nRows: number = TrackListComponent.DEFAULT_nRows;
  @Input() private collectionWidth: number;
  private cardWidth: number;


  constructor(
    private router: Router,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private playbackService: PlaybackService,
    private renderer: Renderer2
  ) {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.currentAccountId = currUser['_accountId'];
    }
    if ((!this.collectionWidth) && TrackListComponent.DEFAULT_width && TrackListComponent.DEFAULT_width > 0) {
      this.collectionWidth = TrackListComponent.DEFAULT_width;
    }
    if (this.collectionWidth) {
      this.cardWidth = (this.collectionWidth * 0.92);
    }
  }

  ngOnInit() {

    this.playbackService.previousPlaying.subscribe(
      previousSong => {
        console.log(previousSong);
        this.previousSongPlaying = this.songs.indexOf(previousSong);
      });

    this.playbackService.currentlyPlaying.subscribe(
      song => {
        console.log('detected play');
        this.songCurrentlyPlaying = this.songs.indexOf(song);
        console.log(this.previousSongPlaying);
        if (this.previousSongPlaying !== undefined && this.previousSongPlaying >=0 ) {
          this.songs[this.songCurrentlyPlaying].isPlaying = true;
          this.songs[this.previousSongPlaying].isPlaying = false;
        }
      });

    this.playbackService.isPlaying.subscribe(
      status => {
        this.songs[this.songCurrentlyPlaying].isPlaying = status;
      }

    );
    this.mediaPath = this.dataService.mediaURL;
    var root = this;
    setTimeout(function() {
      if ((!root.destroyed) && root.collectionWidth) {
        root.recheckSize(true);
      }
    }, 100);

    setTimeout(function() {
      if (!root.destroyed) {
        root.recheckSize(true);
      }
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(!this.initialized && this.songs !== undefined) {
      this.initializeCollection();
    }
    const songs: SimpleChange = changes['songs'];
    this.playbackService.loadSongQueue(songs.currentValue);
  }



  ngOnDestroy() {
    this._destroyed = true;
  }

  ngAfterViewChecked() {
    if (this.mainDiv != null && this.mainDiv.nativeElement != null
        && this.mainDiv.nativeElement.offsetWidth != null
        && this.mainDiv.nativeElement.offsetWidth > 0){
      this.collectionWidth = this.mainDiv.nativeElement.offsetWidth;
      this.cardWidth = (this.collectionWidth * 0.92);
      this.recheckSize(true);
    }

    // Inject extra elements
    this._injectDiv(this.headerDiv, this.injectHeaderDivSelector, this.injectedHeaderDiv) && (this._headerDivInjected = true);
    this._injectDiv(this.titleDiv, this.injectTitleDivSelector, this.injectedTitleDiv) && (this._titleDivInjected = true);
    this._injectDiv(this.subtitleDiv, this.injectSubtitleDivSelector, this.injectedSubtitleDiv) && (this._subtitleDivInjected = true);
    this._injectDiv(this.footerDiv, this.injectFooterDivSelector, this.injectedFooterDiv) && (this._footerDivInjected = true);

    this.recheckSize(false);
}

  private initializeCollection(): void {
    if(!this.initialized) {
      return;
    }

    this.columnCount();

    if(this.showAll) {
      this.displayShowAllBt = false;
    }
    this._initialized = true;
    this.recheckSize(true);
  }

  absorbMouseEvent($event: MouseEvent, i: number, blockEvent: boolean): void {
    // Does nothing; used for disabling context menu
    if ((!$event.ctrlKey) && blockEvent) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  public columnCount(): number {
    let columnCount:number = 0;
    if (this.displayTrackNumber || (!this.disablePlayPauseBt)) { columnCount++; }
    if (this.displaySongTitle) { columnCount++; }
    if (this.displayArtist) { columnCount++; }
    if (this.displayAlbum) { columnCount++; }
    if (this.displayYear) { columnCount++; }
    if (this.displayGenre) { columnCount++; }
    if (this.displayDuration) { columnCount++; }
    if (this.displaySaved) { columnCount++; }
    if (this.displayTimeAdded) { columnCount++; }
    if (this.displayTimePlayed) { columnCount++; }
    if (this.displayPlayCount) { columnCount++; }
    if (this.displayPlayCountLastMonth) { columnCount++; }
    return columnCount;
  }

  public recheckSize(force: boolean): void {
    if((force || (!this.lastSizeCheck) || ((new Date().getTime()) - this.lastSizeCheck) > 500) && (!this.destroyed)) {
      this.collectionWidth += 1;
      this.cardWidth = (this.collectionWidth * 0.92);
      this.collectionWidth -= 1;
      this.cdRef.detectChanges();
      this.lastSizeCheck = new Date().getTime();
    }
  }

  private _injectDiv(childDiv: ElementRef, newDivSelector: string, newDiv: HTMLDivElement): boolean {
    if (childDiv != null && childDiv.nativeElement != null && (!newDiv) && newDivSelector) {
      newDiv = (<HTMLDivElement>document.getElementById(newDivSelector));
      if (newDiv && (!newDiv.classList.contains(TrackListComponent.injectedFlagClass))) {
        // If new div was found, inject it and recheck component size
        this.renderer.appendChild(childDiv.nativeElement, newDiv);
        this.renderer.addClass(newDiv, TrackListComponent.injectedFlagClass);
        this.recheckSize(false);
        return true;
      }
    }
    return false;
  }

  /**
    @param childDiv       Angular selector of existing div in this entity card collection component
    @param newDivSelector DOM selector (id) of div to be injected
  */
  public injectDiv(childDiv: ElementRef, newDivSelector: string): boolean {
    if (childDiv != null && childDiv.nativeElement != null && newDivSelector) {
      let newDiv: HTMLDivElement = (<HTMLDivElement>document.getElementById(newDivSelector));
      if (newDiv) {
        // If new div was found, inject it and recheck component size
        this.renderer.appendChild(childDiv.nativeElement, newDiv);
        this.recheckSize(false);
        return true;
      }
    }
    return false;
  }

  public play($event: MouseEvent, song: Song): void {
    this.playing = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  public playAll($event: MouseEvent, i: number): void {
    this.playing = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  public pause($event: MouseEvent): void {
    this.playing = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  // Returns whether or not to display "Show all" card
  getShowAllBt(): boolean {
    return (this.displayShowAllBt && (!this.showAll) && this.entities().length > this.nRows);
  }

  // Returns whether or not to display hidden entity count in "Show all" card
  getShowRemainingCount(): boolean {
    let nEntities = this.nRows - 1;
    return ((!this.showAll) && this.entities().length > nEntities);
  }

  // Returns number of hidden entities
  getRemainingCount(): number {
    if(this.showAll){
      return 0;
    }
    let nEntities = this.nRows - 1;
    return this.entities().length - (this.nRows - 1);
  }

  // Returns the active entity collection
  public entities(): any[] {
    return this.songs;
  }

  public entity(i: number): any {
    return this.songs[i];
  }

  // Returns the entity ID of the collection entity at index i
  public id(i: number): number {
    return this.entity(i)[TrackListComponent.idAttr];
  }

  public artistId(i: number): string {
    if(this.entity(i).artistId) {
      return this.entity(i).artistId;
    }
    return this.entity(i).artist.artistId;
  }

  // Detailed page for a song's artist
  public detailedArtistPage(i: number): string {
    if(this.entities()[i].artistId) {
      return '/dash/artist/' + this.entity(i).artistId;
    }
    return '/dash/artist/' + this.entity(i).artist.artistId;
  }

  public artistName(i: number): string {
    if(this.entity(i).artistName) {
      return this.entity(i).artistName;
    }
    return this.entity(i).artist.artistName;
  }

  public albumId(i: number): string {
    if(this.entity(i).albumId) {
      return this.entity(i).albumId;
    }
    return this.entity(i).album.albumId;
  }

  public detailedAlbumPage(i: number): string {
    if(this.entities()[i].albumId) {
      return '/dash/album/' + this.entity(i).albumId;
    }
    return '/dash/album/' + this.entity(i).album.albumId;
  }

  public albumTitle(i: number): string {
    if(this.entity(i).albumTitle) {
      return this.entity(i).albumTitle;
    }
    return this.entity(i).album.albumTitle;
  }

  public detailedGenrePage(i: number): string {
    if(this.entities()[i].genreId) {
      return '/dash/genre/' + this.entity(i).genreId;
    }
    return '/dash/genre/' + this.entity(i).genre.genreId;
  }

  public genreName(i: number): string {
    if(this.entity(i).genreName) {
      return this.entity(i).genreName;
    }
    return this.entity(i).genre.genreName;
  }

  public year(i: number): string {
    if(this.entity(i).year) {
      return this.entity(i).year;
    }
    return this.entity(i).album.releaseYear;
  }

  public detailedPlaylistPage(i: number): string {
    return '/dash/playlist/' + this.currentPlaylist.playlistId;
  }

  public detailedPlaylistAuthorPage(i: number): string {
    if(this.entity(i).accountId) {
      return '/dash/profile/' + this.currentPlaylist.accountId;
    }
    return '/dash/profile/' + this.currentPlaylist.creator.accountId;
  }

  getCollectionWidth (): number {
    return this.collectionWidth;
  }

  getCardWidth (): number {
    return this.cardWidth;
  }

  get_nRows (): number {
    return this.nRows;
  }

  get initialized(): boolean {
    return this._initialized;
  }

  get destroyed (): boolean {
    return this._destroyed;
  }

  get headerDivInjected (): boolean {
    return this._headerDivInjected;
  }

  get titleDivInjected (): boolean {
    return this._titleDivInjected;
  }

  get subtitleDivInjected (): boolean {
    return this._subtitleDivInjected;
  }

  get footerDivInjected (): boolean {
    return this._footerDivInjected;
  }

  set_nRows (value: number) {
    let intVal: number = Math.floor(value);
    if (intVal > 0) {
      this.nRows = intVal;
    } else {
      console.log("ERROR: Default row count (nRows) must be a positive integer");
    }
  }

  //** PLAYBACK **//

  playSong(song: Song, index) {
    this.songCurrentlyPlaying = index;
    this.playbackService.playSongFromQueue(index);
  }

  pauseSong(song: Song) {
    this.isPlaying = false;
    this.playbackService.pause();
  }

}
