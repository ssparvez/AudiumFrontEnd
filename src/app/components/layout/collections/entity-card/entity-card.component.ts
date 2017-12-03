import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewChecked, ChangeDetectorRef, Directive, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Album } from '../../../../classes/Album';
import { Artist } from '../../../../classes/Artist';
import { Playlist } from '../../../../classes/Playlist';
import { DataService } from '../../../../services/data.service';


// Supported entity types (only 1 type allowed)
enum Entity {
  None = 0,
  Album = 1,
  Artist = 2,
  Playlist = 3
}

@Component({
  selector: 'entity-card-collection',
  templateUrl: './entity-card.component.html',
  styleUrls: ['./entity-card.component.css'],
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
export class EntityCardComponent implements OnInit {

  public static readonly DEFAULT_nRows:            number = 3;
  public static readonly DEFAULT_nPerRow:          number = 4;
  public static readonly DEFAULT_nRowsInShowAllBt: number = 3;

  public mediaPath: string;
  public currentAccountId: number;
  public playing: boolean = false;

  // Entity type for collection (only 1 type allowed)
  private _e: Entity = Entity.None;
  // Entity collection
  private collection: any[4];
  // Unique image directory structure for the collection entity type
  private readonly imgPath: string[][] = [ [ null, null ], [ 'album_arts', 'Album' ], [ 'artists', 'Profile' ],  [ 'playlists', 'Playlist' ] ];
  private readonly entityTypeString: string[] = [ null, 'album', 'artist', 'playlist' ];
  private readonly authorTypeString: string[] = [ null, 'artist', '', 'profile' ];
  private readonly imageTypes: string[] = [ '.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  // Unique ID attribute of the collection entity type
  private readonly idAttr: string[] = [ null, 'albumId', 'artistId', 'playlistId' ];
  private readonly titleAttr: string[] = [ null, 'albumTitle', 'artistName', 'name' ];
  private readonly authorAttr: string[] = [ null, 'artistId', '', 'accountId' ];
  private readonly authorNameAttr: string[] = [ null, 'artistName', '', 'username' ];

  // Number of times each collection entity failed to load image
  private imageRetryCount: number[] = [];

  @ViewChild('mainDiv') public mainDiv: ElementRef;


  // Input variables

  @Input() public title: string = "";
  @Input() public noEntitiesMessage:   string = "";
  @Input() public showAllBtHoverText: string = "Show all";

  // If true, server will try all file extensions before using default image
  @Input() public tryAllImageTypes:  boolean = false; // (NOTE: Setting tryAllImageTypes = true seems to be significantly slower)
  // If true, default entity image will always be used
  @Input() public forceDefaultImage: boolean = false;
  @Input() public showAll: boolean = false;
  // Entity author (Album.artist or Playlist.creator; not used for Artist)
  @Input() private displayAuthor: boolean = true;
  @Input() private displayYear:   boolean = false;

  // If true, the loading animation will play until entities have loaded
  @Input() private loadingAnimation: boolean = true;

  @Input() private albums: Album[];
  @Input() private artists: Artist[];
  @Input() private playlists: Playlist[];


  // Stylization variables

  // Number of entity card rows to show if showAll == false
  @Input() private nRows:   number = EntityCardComponent.DEFAULT_nRows;
  // Number of entity cards per row (Must be a value in { 1, 2, 3, 4, 6, 12 })
  @Input() private nPerRow: number = EntityCardComponent.DEFAULT_nPerRow;
  // Number of entity rows in "Show all" card (Is equivalent to the number of of albus per row and must be a value in { 1, 2, 3, 4, 6, 12 })
  @Input() private nRowsInShowAllBt: number = EntityCardComponent.DEFAULT_nRowsInShowAllBt;
  @Input() private collectionWidth: number = 800;
  private cardWidth: number = ((this.collectionWidth * 0.92) / this.nPerRow);

  constructor(
    private router: Router,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef
  ) {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.currentAccountId = currUser['_accountId'];
    }
  }

  ngOnInit() {
    this.mediaPath = this.dataService.mediaURL;
  }

  ngAfterViewChecked() {
    if(this.mainDiv != null && this.mainDiv.nativeElement != null
        && this.mainDiv.nativeElement.offsetWidth != null
        && this.mainDiv.nativeElement.offsetWidth > 0){
      this.collectionWidth = this.mainDiv.nativeElement.offsetWidth;
      this.cardWidth = ((this.collectionWidth * 0.92) / this.nPerRow);
      this.cdRef.detectChanges();
    }

    if (this.e == Entity.None) {
      if (this.albums != null) {
        this.e = Entity.Album;
      } else if (this.artists != null) {
        this.e = Entity.Artist;
      } else if (this.playlists != null) {
        this.e = Entity.Playlist;
      }
      this.initializeCollection();
    }
  }

  private initializeCollection(): void {
    this.collection = [ null, null, null, null ];
    switch (this.e) {
      case Entity.Album:
        this.collection[this.e] = this.albums;
        break;
      case Entity.Artist:
        this.collection[this.e] = this.artists;
        this.displayYear = false;
        break;
      case Entity.Playlist:
        this.collection[this.e] = this.playlists;
        this.displayYear = false;
        break;
      default:
        break;
    }

    if (this.e != Entity.None) {
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

  public recheckSize(): void {
    this.cdRef.detectChanges();
  }

  public play($event: MouseEvent, i: number): void {
    this.playing = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  public pause($event: MouseEvent): void {
    this.playing = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  // Returns the materialize grid column class for an entity card
  getCardGridClass(): string {
    return (" col m" + (12 / this.nPerRow) + " ");
  }

  // Returns the size of the materialize icon used for the play/pause button on an entity card
  getCardIconSize(): number {
    return (this.cardWidth / 2);
  }

  // Returns the materialize grid column class for an entity image displayed inside the "Show all" card
  getMoreBtImgGridClass(): string {
    return (" col m" + (12 / this.nRowsInShowAllBt) + " ");
  }

  // Returns whether or not to display "Show all" card
  getShowMoreBt(): boolean {
    return ((!this.showAll) && this.entities().length > (this.nRows * this.nPerRow));
  }

  // Returns the index of the last entity image to display in "Show all" card
  getMoreBtEndIndex(): number {
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
    return this.collection[this.e];
  }

  // Returns the entity ID of the collection entity at index i
  public id(i: number): number {
    return this.entities()[i][this.idAttr[this.e]];
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
  public detailedAuthorPage(i: number): string {
    return '/dash/' + this.authorTypeString[this.e] + '/' + this.entities()[i][this.authorAttr[this.e]];
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
