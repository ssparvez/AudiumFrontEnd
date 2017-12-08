import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Renderer2, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Album } from '../../../../classes/Album';
import { Artist } from '../../../../classes/Artist';
import { Playlist } from '../../../../classes/Playlist';
import { Profile } from '../../../../classes/Profile';
import { DataService } from '../../../../services/data.service';
import { SafeHtmlPipe } from '../../../../pipes/safe-html.pipe';
import {PlaybackService} from "../../../../services/playback/playback.service";
import {Song} from "../../../../classes/Song";
import {AppError} from "../../../../errors/AppError";
import {GeneralService} from "../../../../services/general/general.service";


// Supported entity types (only 1 type allowed per entity collection element)
enum Entity {
  None = 0,
  Album = 1,
  Artist = 2,
  Playlist = 3,
  Profile = 4
}

@Component({
  selector: 'entity-card-collection',
  templateUrl: './entity-card.component.html',
  styles: [':host { width: 100%; }'],
  styleUrls: ['./entity-card.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        animate(500, style({opacity: 1}))
      ]),
      transition('* => void',[
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class EntityCardComponent implements OnInit {

  private static _DEFAULT_width: number;
  public static readonly injectedFlagClass: string = "entity-card-collection-inject";
  public readonly ALBUM: Entity = Entity.Album;
  public readonly ARTIST: Entity = Entity.Artist;
  public readonly PLAYLIST: Entity = Entity.Playlist;
  public readonly PROFILE: Entity = Entity.Profile;
  public static readonly DEFAULT_nRows:            number = 3;
  public static readonly DEFAULT_nPerRow:          number = 4;
  public static readonly DEFAULT_nRowsInShowAllBt: number = 3;

  public mediaPath: string;
  public currentAccountId: number;
  private lastSizeCheck: number;
  private _destroyed: boolean = false;
  private  hasLoadedSongs: boolean;

  // Entity type for collection (only 1 type allowed)
  private _e: Entity = Entity.None;
  // Unique image directory structure for the collection entity type
  private readonly imgPath: string[][] = [ [ null, null ], [ 'album_arts', 'Album' ], [ 'artists', 'Profile' ],  [ 'playlists', 'Playlist' ], [ 'profiles', 'Profile' ] ];
  private readonly entityTypeString: string[] = [ null, 'album', 'artist', 'playlist', 'user_profile' ];
  private readonly authorTypeString: string[] = [ null, 'artist', '', 'profile', '' ];
  private readonly imageTypes: string[] = [ '.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  // Unique ID attribute of the collection entity type
  private readonly idAttr: string[] = [ null, 'albumId', 'artistId', 'playlistId', 'accountId' ];
  private readonly titleAttr: string[] = [ null, 'albumTitle', 'artistName', 'name', 'username' ];
  private readonly authorAttr: string[] = [ null, 'artistId', '', 'accountId', '' ];
  // Secondary author object is only used on some pages (search page, etc)
  private readonly authorEntityAttr: string[] = [ null, 'artist', '', 'creator', '' ];
  private readonly authorNameAttr: string[] = [ null, 'artistName', '', 'username', '' ];

  // Number of times each collection entity failed to load image
  private imageRetryCount: number[] = [];

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

  @Input() private albums: Album[];
  @Input() private artists: Artist[];
  @Input() private playlists: Playlist[];
  @Input() private profiles: Profile[];
  @Input() private songs: Song[];

  @Input() public title: string = "";
  @Input() public noEntitiesMessage:   string = "";
  @Input() public showAllBtHoverText: string = "Show all";

  @Input() public isPlaying: boolean = false;
  @Input() public titleUseHtml: boolean = false;
  // If true, server will try all file extensions before using default image
  @Input() public tryAllImageTypes:  boolean = false; // (NOTE: Setting tryAllImageTypes = true seems to be significantly slower)
  // If true, default entity image will always be used
  @Input() public forceDefaultImage: boolean = false;
  // Determines whether all entities in collection are shown by default
  @Input() public showAll: boolean = false;
  // Determines whether "Show all" button is displayed when showAll == false but all entities don't fit in the specified grid size
  @Input() public displayShowAllBt: boolean = true;
  // Entity name/title (Album.albumTitle, Artist.artistName, Playlist.name, or Profile.username)
  @Input() public displayName:   boolean = true;
  // Entity author (Album.artist or Playlist.creator; not used for Artist)
  @Input() public displayAuthor: boolean = true;
  // Year of creation (Album.releaseYear only)
  @Input() public displayYear:      boolean = false;
  @Input() public disableImageLink: boolean = false;
  // By default, image link is disabled when current route is the same as the link route, or if disableImageLink==true. Set to true to override
  @Input() public forceEnableImageLink: boolean = false;
  @Input() public forceDisplayTitleDiv: boolean = false;
  @Input() public disablePlayPauseBt: boolean = false;
  @Input() public disableHoverable: boolean = false;
  @Input() public disableContextMenu: boolean = false;
  // If true, the loading animation will play until entities have loaded
  @Input() public loadingAnimation: boolean = true;
  @Input() public collectionPadding: boolean = true; // Technically disables the margin
  @Input() public entityPadding: boolean = true; // Technically disables the margin as well as the padding
  @Input() public collectionAddClass: string = '';
  @Input() public entityAddClass: string = '';

  @Input() public playFromCard: boolean = false;
  @Input() public typeOfContent: string;


  // Context menu variables:

  // Should be set to true if viewing a detailed page (Only used for Playlists)
  @Input() public detailedContextMenu: boolean = false; // If true, redirects to library playlists page if "delete" menu option is used
  // Should be set to true if viewing a library page
  @Input() public libraryContextMenu: boolean = false;


  // Layout variables:

  // Number of entity card rows to show if showAll == false
  @Input() private nRows:   number = EntityCardComponent.DEFAULT_nRows;
  // Number of entity cards per row (Must be a value in { 1, 2, 3, 4, 6, 12 })
  @Input() private nPerRow: number = EntityCardComponent.DEFAULT_nPerRow;
  // Number of entity rows in "Show all" card (Is equivalent to the number of of albus per row and must be a value in { 1, 2, 3, 4, 6, 12 })
  @Input() private nRowsInShowAllBt: number = EntityCardComponent.DEFAULT_nRowsInShowAllBt;
  @Input() private collectionWidth: number;
  private cardWidth: number;


  constructor(
    private router: Router,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private playbackService: PlaybackService,
    private service: GeneralService,
    private renderer: Renderer2
  ) {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.currentAccountId = currUser['_accountId'];
    }
    if ((!this.collectionWidth) && EntityCardComponent.DEFAULT_width && EntityCardComponent.DEFAULT_width > 0) {
      this.collectionWidth = EntityCardComponent.DEFAULT_width;
    }
    if (this.collectionWidth) {
      this.cardWidth = ((this.collectionWidth * 0.92) / this.nPerRow);
    }

    this.playbackService.currentlyPlaying.subscribe(
      song => {
        if ( this.songs !== undefined && this.songs.indexOf(song) !== -1) {
          // this.songCurrentlyPlaying = this.songs.indexOf(song);
          // this.songs[this.songs.indexOf(song)].isPlaying = song.isPlaying;
          this.isPlaying = song.isPlaying;
        }
      });

    this.playbackService.hasBeenLoaded.subscribe(
      status => {
        this.hasLoadedSongs = status;
      }
    );
  }

  ngOnInit() {
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

  ngOnChanges() {
    if (this.e === Entity.None) {
      if (this.albums != undefined) {
        this.e = Entity.Album;
      } else if (this.artists  != undefined) {
        this.e = Entity.Artist;
      } else if (this.playlists  != undefined) {
        this.e = Entity.Playlist;
      } else if (this.profiles  != undefined) {
        this.e = Entity.Profile;
      }
      this.initializeCollection();
    }
  }

  ngOnDestroy() {
    this._destroyed = true;
  }

  ngAfterViewChecked() {
    if (this.mainDiv != null && this.mainDiv.nativeElement != null
        && this.mainDiv.nativeElement.offsetWidth != null
        && this.mainDiv.nativeElement.offsetWidth > 0){
      this.collectionWidth = this.mainDiv.nativeElement.offsetWidth;
      this.cardWidth = ((this.collectionWidth * 0.92) / this.nPerRow);
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
    if(this.e === Entity.None) {
      return;
    }

    switch (this.e) {
      case Entity.Album:
        break;
      case Entity.Artist:
        this.displayYear = false;
        this.displayAuthor = false;
        break;
      case Entity.Playlist:
        this.displayYear = false;
        break;
      case Entity.Profile:
        this.displayYear = false;
        this.displayAuthor = false;
        this.disablePlayPauseBt = true; // Users don't have songs (unless we want to play their library or recent plays)
        break;
      default:
        break;
    }

    this.imageRetryCount.length = 0;
    while ( this.imageRetryCount.length <= this.entities().length) {
      this.imageRetryCount.push(0);
    }

    if(!EntityCardComponent.validRowLength(this.nPerRow)) {
      console.log("ERROR: Number of entity cards per row (nPerRow) must be one of the following values:\n  { 1, 2, 3, 4, 6, 12 }\n"
        + "Default value (" + EntityCardComponent.DEFAULT_nPerRow + ") will be used instead.");
      this.nPerRow = EntityCardComponent.DEFAULT_nPerRow;
    }

    if(!EntityCardComponent.validRowLength(this.nRowsInShowAllBt)) {
      console.log("ERROR: Number of entity image rows in \"Show all\" button (nRowsInShowAllBt) must be one of the following values:\n  { 1, 2, 3, 4, 6, 12 }\n"
        + "Default value (" + EntityCardComponent.DEFAULT_nRowsInShowAllBt + ") will be used instead.");
      this.nRowsInShowAllBt = EntityCardComponent.DEFAULT_nRowsInShowAllBt;
    }

    if(this.showAll) {
      this.displayShowAllBt = false;
    }

    if(this.forceEnableImageLink) {
      this.disableImageLink = false;
    }
    this.recheckSize(true);
  }

  absorbRightClick($event: MouseEvent, i: number, blockEvent: boolean): void {
    // Does nothing; used for disabling context menu
    if ((!$event.ctrlKey) && blockEvent) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  public static validRowLength(length: number): boolean {
    let intVal: number = Math.floor(length);
    switch (intVal) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
      case 12:
        return true;
      default:
        break;
    }
    return false;
  }

  public static get DEFAULT_width (): number {
    return EntityCardComponent._DEFAULT_width;
  }

  public static set DEFAULT_width (value: number) {
    if (value > 0) {
      EntityCardComponent.DEFAULT_width = value;
    } else {
      console.log("ERROR: DEFAULT_width must be a positive number.");
    }
  }

  public recheckSize(force: boolean): void {
    if((force || (!this.lastSizeCheck) || ((new Date().getTime()) - this.lastSizeCheck) > 500) && (!this.destroyed)) {
      this.collectionWidth += 1;
      this.cardWidth = ((this.collectionWidth * 0.92) / this.nPerRow);
      this.collectionWidth -= 1;
      this.cdRef.detectChanges();
      this.lastSizeCheck = new Date().getTime();
    }
  }

  private _injectDiv(childDiv: ElementRef, newDivSelector: string, newDiv: HTMLDivElement): boolean {
    if (childDiv != null && childDiv.nativeElement != null && (!newDiv) && newDivSelector) {
      newDiv = (<HTMLDivElement>document.getElementById(newDivSelector));
      if (newDiv && (!newDiv.classList.contains(EntityCardComponent.injectedFlagClass))) {
        // If new div was found, inject it and recheck component size
        this.renderer.appendChild(childDiv.nativeElement, newDiv);
        this.renderer.addClass(newDiv, EntityCardComponent.injectedFlagClass);
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

  public play($event: MouseEvent, i: number, id: number): void {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.playFromCard) {
      if (this.typeOfContent === 'playlist') {
        if (!this.playlists[i].isLoaded) {
          this.loadSongs(this.playlists[i].playlistId);
          this.playlists[i].isLoaded = true;
        } else {
          this.playbackService.resumePlay();
        }
      } else if (this.typeOfContent === 'albums') {
        if (!this.albums[i].isLoaded) {
          this.loadSongs(this.albums[i].albumId);
          this.albums[i].isLoaded = true;
        } else {
          this.playbackService.resumePlay();
        }
      } else if (this.typeOfContent === 'artists') {
        if (!this.artists[i].isLoaded) {
          this.loadSongs(this.artists[i].artistId);
          this.artists[i].isLoaded = true;
        } else {
          this.playbackService.resumePlay();
        }
      } else {
        if (!this.hasLoadedSongs) {
          this.playbackService.loadSongQueue(this.songs);
          this.hasLoadedSongs = true;
          this.playbackService.playSongFromQueue(0);
        } else {
          this.playbackService.resumePlay();
        }
      }
    }
  }

  public pause($event: MouseEvent): void {
    this.playbackService.pause();
    $event.preventDefault();
    $event.stopPropagation();
  }

  private loadSongs(id: number) {
    this.service.get('/' + this.typeOfContent +  '/' + id + '/songs').subscribe(
      songsForContent => {
        this.songs = songsForContent;
        this.playbackService.loadSongQueue(this.songs);
        this.playbackService.playSongFromQueue(0);
      }, (error: AppError) => {

      }
    );
  }

  // Returns the materialize grid column class for an entity card
  getCardGridClass(): string {
    return (" col m" + (12 / this.nPerRow) + " ");
  }

  // Returns the size of the materialize icon used for the play/pause button on an entity card
  getCardIconSize(): number {
    return (this.cardWidth / 3);
  }

  // Returns the materialize grid column class for an entity image displayed inside the "Show all" card
  getShowAllBtImgGridClass(): string {
    return (" col m" + (12 / this.nRowsInShowAllBt) + " ");
  }

  // Returns whether or not to display "Show all" card
  getShowAllBt(): boolean {
    return (this.displayShowAllBt && (!this.showAll) && this.entities().length > (this.nRows * this.nPerRow));
  }

  // Returns the index of the last entity image to display in "Show all" card
  getShowAllBtEndIndex(): number {
    if(this.showAll){
      return 0;
    }
    let nEntities = (this.nRows * this.nPerRow);
    let nBtEntities = (nEntities + (this.nRowsInShowAllBt * this.nRowsInShowAllBt)) - 1;
    return this.entities().length > nBtEntities ? (nBtEntities - 1) : nBtEntities;
  }

  // Returns whether or not to display hidden entity count in "Show all" card
  getShowRemainingCount(): boolean {
    let nEntities = (this.nRows * this.nPerRow) - 1;
    let nBtEntities = (this.nRowsInShowAllBt * this.nRowsInShowAllBt);
    return ((!this.showAll) && this.entities().length > (nEntities + nBtEntities));
  }

  // Returns number of hidden entities
  getRemainingCount(): number {
    if(this.showAll){
      return 0;
    }
    let nEntities = (this.nRows * this.nPerRow) - 1;
    let nBtEntities = (this.nRowsInShowAllBt * this.nRowsInShowAllBt) - 1;
    return this.entities().length - (nEntities + nBtEntities);
  }

  // Returns the active entity collection
  public entities(): any[] {
    switch(this.e) {
      case Entity.Album:
        return this.albums;
      case Entity.Artist:
        return this.artists;
      case Entity.Playlist:
        return this.playlists;
      case Entity.Profile:
       return this.profiles;
      default:
        return undefined;
    }
  }

  public entity(i: number): any {
    switch(this.e) {
      case Entity.Album:
        return this.albums[i];
      case Entity.Artist:
        return this.artists[i];
      case Entity.Playlist:
        return this.playlists[i];
      case Entity.Profile:
       return this.profiles[i];
      default:
        return undefined;
    }
  }

  // Returns the entity ID of the collection entity at index i
  public id(i: number): number {
    return this.entity(i)[this.idAttr[this.e]];
  }

  // Returns the path to the image for the collection entity at index i
  public imagePath(i: number): string {
    if ((!this.forceDefaultImage) && (this.imageRetryCount[i] == 0 || (this.tryAllImageTypes && this.imageRetryCount[i] < this.imageTypes.length))) {
      return this.mediaPath + '/images/' + this.imgPath[this.e][0] + '/' + this.id(i) + '/' + this.imgPath[this.e][1] + this.imageTypes[this.imageRetryCount[i]];
    } else {
      return this.defaultImage();
    }
  }

  // If an error occurs when loading an image, increment the retry count
  private onImageError(i: number): void {
    if (this.forceDefaultImage) {
      console.log("ERROR: Failed to load image but forceDefaultImage == true");
    } else if (this.tryAllImageTypes || this.imageRetryCount[i] == 0) {
      this.imageRetryCount[i]++;
    }
  }

  // Returns path to default image for the collection entity type
  public defaultImage(): string {
    return 'assets/images/defaults/' + this.entityTypeString[this.e] + '.svg';
  }

  // Detailed entity page for the collection entity at index i
  public detailedEntityPage(i: number): string {
    return '/dash/' + this.entityTypeString[this.e] + '/' + this.id(i);
  }

  // Detailed page for the author of the collection entity at index i (only for Album and Playlist entities)
  public authorId(i: number): string {
    if(this.entities()[i][this.authorAttr[this.e]]) {
      return this.entities()[i][this.authorAttr[this.e]];
    }
    return this.entity(i)[this.authorEntityAttr[this.e]][this.authorAttr[this.e]];
  }

  // Detailed page for the author of the collection entity at index i (only for Album and Playlist entities)
  public detailedAuthorPage(i: number): string {
    if(this.entities()[i][this.authorAttr[this.e]]) {
      return '/dash/' + this.authorTypeString[this.e] + '/' + this.entity(i)[this.authorAttr[this.e]];
    }
    return '/dash/' + this.authorTypeString[this.e] + '/' + this.entity(i)[this.authorEntityAttr[this.e]][this.authorAttr[this.e]];
  }

  public authorName(i: number): string {
    if(this.entity(i)[this.authorNameAttr[this.e]]) {
      return this.entity(i)[this.authorNameAttr[this.e]];
    }
    return this.entity(i)[this.authorEntityAttr[this.e]][this.authorNameAttr[this.e]];
  }

  getCollectionWidth (): number {
    return this.collectionWidth;
  }

  getCardWidth (): number {
    return this.cardWidth;
  }

  get e (): Entity {
    return this._e;
  }

  get_nRows (): number {
    return this.nRows;
  }

  get_nPerRow (): number {
    return this.nPerRow;
  }

  get_nRowsInShowAllBt (): number {
    return this.nRowsInShowAllBt;
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


  set e (value: Entity) {
    // e can only be set once
    if(this._e == Entity.None) {
      this._e = value;
    }
  }

  set_nRows (value: number) {
    let intVal: number = Math.floor(value);
    if (intVal > 0) {
      this.nRows = intVal;
    } else {
      console.log("ERROR: Default row count (nRows) must be a positive integer");
    }
  }

  set_nPerRow (value: number) {
    if (EntityCardComponent.validRowLength(value)) {
      this.nPerRow = Math.floor(value)
    } else {
      console.log("ERROR: Number of entity cards per row (nPerRow) must be one of the following values:\n  { 1, 2, 3, 4, 6, 12 }");
    }
  }

  set_nRowsInShowAllBt (value: number) {
    if (EntityCardComponent.validRowLength(value)) {
      this.nRowsInShowAllBt = Math.floor(value)
    } else {
      console.log("ERROR: Number of entity image rows in \"Show all\" button (nRowsInShowAllBt) must be one of the following values:\n  { 1, 2, 3, 4, 6, 12 }");
    }
  }
}
