import { animate, style, transition, trigger } from "@angular/animations";
import { AfterViewChecked, ChangeDetectorRef, Directive, Component, ElementRef, Renderer2, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { mediaURL } from '../../../../environments/environment';
import { SafeHtmlPipe } from '../../../pipes/safe-html.pipe';
import { Genre } from '../../../classes/Genre';

@Component({
  selector: 'genre-card-collection',
  templateUrl: './genre-card.component.html',
  styles: [':host { width: 100%; }'],
  styleUrls: ['./genre-card.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[animate(500, style({opacity: 1}))]),
      transition('* => void',[animate(500, style({opacity: 0}))])
    ])
  ]
})
export class GenreCardComponent implements OnInit {

  private static _DEFAULT_width: number;
  public static readonly injectedFlagClass: string = "genre-card-collection-inject";
  public static readonly DEFAULT_nRows:   number = 3;
  public static readonly DEFAULT_nPerRow: number = 4;

  public static readonly idAttr: string = 'genreId';
  private static readonly titleAttr: string = 'genreName';

  public mediaPath: string;
  public currentAccountId: number;
  public playing: boolean = false;
  private lastSizeCheck: number;
  private _initialized: boolean = false;
  private _destroyed: boolean = false;

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

  @Input() private genres: Genre[];

  @Input() public title: string = "";
  @Input() public noEntitiesMessage:   string = "";
  @Input() public showAllBtText: string = "Show all";

  @Input() public titleUseHtml: boolean = false;
  // Determines whether all genres are shown by default
  @Input() public showAll: boolean = false;
  // Determines whether "Show all" button is displayed when showAll == false but all genres don't fit in the specified grid size
  @Input() public displayShowAllBt: boolean = true;
  @Input() public smallShowAllBt: boolean = false;
  @Input() public showRemainingCount: boolean = false;
  // Entity name/title (Genre.genreName)
  @Input() public displayName:   boolean = true;
  @Input() public disableLink: boolean = false;
  // By default, router link is disabled when current route is the same as the link route, or if disableLink==true. Set to true to override
  @Input() public forceEnableLink: boolean = false;
  @Input() public forceDisplayTitleDiv: boolean = false;
  @Input() public disablePlayPauseBt: boolean = false;
  @Input() public disableHoverable: boolean = false;
  @Input() public disableContextMenu: boolean = false;
  // If true, the loading animation will play until genres have loaded
  @Input() public loadingAnimation: boolean = true;
  @Input() public collectionPadding: boolean = true; // Technically disables the margin
  @Input() public entityPadding: boolean = true; // Technically disables the margin as well as the padding
  @Input() public collectionAddClass: string = '';
  @Input() public entityAddClass: string = '';



  // Context menu variables:

  // Should be set to true if viewing a detailed page (Only used for Playlists)
  @Input() public detailedContextMenu: boolean = false; // If true, redirects to library playlists page if "delete" menu option is used
  // Should be set to true if viewing a library page
  @Input() public libraryContextMenu: boolean = false;


  // Layout variables:

  // Number of genre card rows to show if showAll == false
  @Input() private nRows:   number = GenreCardComponent.DEFAULT_nRows;
  // Number of genre cards per row (Must be a value in { 1, 2, 3, 4, 6, 12 })
  @Input() private nPerRow: number = GenreCardComponent.DEFAULT_nPerRow;
  @Input() private collectionWidth: number;
  private cardWidth: number;


  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.currentAccountId = currUser['_accountId'];
    }
    if ((!this.collectionWidth) && GenreCardComponent.DEFAULT_width && GenreCardComponent.DEFAULT_width > 0) {
      this.collectionWidth = GenreCardComponent.DEFAULT_width;
    }
    if (this.collectionWidth) {
      this.cardWidth = ((this.collectionWidth * 0.92) / this.nPerRow);
    }
  }

  ngOnInit() {
    this.mediaPath = mediaURL;

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
    if(!this.initialized && this.genres != undefined) {
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
    if(this.initialized){
      return;
    }
    if(!GenreCardComponent.validRowLength(this.nPerRow)) {
      console.log("ERROR: Number of entity cards per row (nPerRow) must be one of the following values:\n  { 1, 2, 3, 4, 6, 12 }\n"
        + "Default value (" + GenreCardComponent.DEFAULT_nPerRow + ") will be used instead.");
      this.nPerRow = GenreCardComponent.DEFAULT_nPerRow;
    }

    if(this.showAll) {
      this.displayShowAllBt = false;
    }

    if(this.forceEnableLink) {
      this.disableLink = false;
    }
    this.recheckSize(true);
    this._initialized = true;
  }

  absorbRightClick($event: MouseEvent, i: number): void {
    // Does nothing; used for disabling context menu
    if (!$event.ctrlKey) {
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
    return GenreCardComponent._DEFAULT_width;
  }

  public static set DEFAULT_width (value: number) {
    if (value > 0) {
      GenreCardComponent.DEFAULT_width = value;
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
      if (newDiv && (!newDiv.classList.contains(GenreCardComponent.injectedFlagClass))) {
        // If new div was found, inject it and recheck component size
        this.renderer.appendChild(childDiv.nativeElement, newDiv);
        this.renderer.addClass(newDiv, GenreCardComponent.injectedFlagClass);
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

  // Returns the materialize grid column class for a genre card
  getCardGridClass(): string {
    return (" col m" + (12 / this.nPerRow) + " ");
  }

  // Returns the size of the materialize icon used for the play/pause button on a genre card
  getCardIconSize(): number {
    return (this.cardWidth / 2);
  }

  // Returns the materialize grid column class for "Show all" card
  getShowAllBtGridClass(): string {
    if(!this.smallShowAllBt) {
      return " col m12 ";
    }
    return this.getCardGridClass();
  }

  // Returns whether or not to display "Show all" card
  getShowAllBt(): boolean {
    return (this.displayShowAllBt && (!this.showAll) && this.genres.length > (this.nRows * this.nPerRow));
  }

  // Returns the index of the last entity image to display in "Show all" card
  getShowAllBtEndIndex(): number {
    if(this.showAll){
      return 0;
    }
    let nEntities = (this.nRows * this.nPerRow);
    return this.genres.length > nEntities ? (nEntities - 1) : nEntities;
  }

  // Returns whether or not to display hidden card count in "Show all" card
  getShowRemainingCount(): boolean {
    let nEntities = (this.nRows * this.nPerRow) - 1;
    return ((!this.showAll) && this.showRemainingCount && this.genres.length > nEntities);
  }

  // Returns number of hidden genre cards
  getRemainingCount(): number {
    if(this.showAll){
      return 0;
    }
    let nEntities = (this.nRows * this.nPerRow) - 1;
    return this.genres.length - nEntities;
  }

  // Returns the genreID of the genre in the card at index i
  public id(i: number): number {
    return this.genres[i].genreId;
  }

  // Detailed entity page for the collection entity at index i
  public detailedEntityPage(i: number): string {
    return '/dash/genre/' + this.id(i);
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

  get_nPerRow (): number {
    return this.nPerRow;
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

  set_nPerRow (value: number) {
    if (GenreCardComponent.validRowLength(value)) {
      this.nPerRow = Math.floor(value)
    } else {
      console.log("ERROR: Number of genre cards per row (nPerRow) must be one of the following values:\n  { 1, 2, 3, 4, 6, 12 }");
    }
  }
}
