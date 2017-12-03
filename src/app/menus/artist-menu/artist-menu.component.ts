import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Artist} from "../../classes/Artist";
import {ContextMenuComponent, ContextMenuService} from "ngx-contextmenu";
import {GeneralService} from "../../services/general/general.service";
import {MzToastService} from "ng2-materialize";
import {AppError} from "../../errors/AppError";
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-artist-menu',
  templateUrl: './artist-menu.component.html',
  styleUrls: ['./artist-menu.component.css']
})
export class ArtistMenuComponent implements OnInit {

  @Input('artists') public artists: Artist[];
  @Input('library') public library: boolean;
  @ViewChild('artistMenu') public artistMenu: ContextMenuComponent;
  public currentUser: JSON;
  public currentAccountId: number;
  public artistMenuActions = [
    {
      html:(item) => 'Add to Queue',
      click:(item) => this.addArtistToQueue(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Follow artist',
      click:(item) => this.changeFollowStatus(item, true),
      enabled: (item) => true,
      visible: (item: Artist) => !item.followed
    },
    {
      html:(item) => 'Unfollow artist',
      click:(item) => this.changeFollowStatus(item, false),
      enabled: (item) => true,
      visible: (item) => item.followed
    }
  ];

  constructor(private service: GeneralService,
              private playerService: PlayerService,
              private contextMenuService: ContextMenuService,
              private toastService: MzToastService ) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountId = this.currentUser['_accountId'];
    }
  }

  ngOnInit() {
  }


  public onContextMenu($event: MouseEvent, item: Artist): void {
    this.assignFollowStatus(item);
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.artistMenu,
      event: $event,
      item: item,
    });
    if (!$event.ctrlKey) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }


  changeFollowStatus(artist: Artist, status) {
    console.log(artist);
    this.service.update('/accounts/' + this.currentAccountId + '/artist/'  + artist.artistId + '/follow/'
      + status, "")
      .subscribe(
        response => {
          if (status) {
            this.addArtistToFollow(artist);
            this.toastService.show("You are now following this artist", 3000, 'blue');
          } else {
            if (this.library) {
              this.artists.splice(this.artists.indexOf(artist), 1);
            }
            this.removeArtistFromFollowed(artist);
            this.toastService.show("Artist was unfollowed", 3000, 'blue');
          }
        }, (error: AppError) => {
          this.toastService.show("Artist follow status could not be changed", 3000, 'red');
        }
      );
  }

  assignFollowStatus(artist: Artist): void {
    const artistsFollowed: number[] = JSON.parse(localStorage.getItem("artistsfollowed"));
    if (artistsFollowed.find( x => x === artist.artistId) != null ) {
      artist.followed = true;
    }
  }
  removeArtistFromFollowed(artist: Artist) {
    const artistsFollowed: number[] = JSON.parse(localStorage.getItem("artistsfollowed"));
    artistsFollowed.splice(artistsFollowed.indexOf(artist.artistId),1);
    localStorage.setItem("artistsfollowed", JSON.stringify(artistsFollowed));
    artist.followed = false;
  }

  addArtistToFollow(artist: Artist) {
    const artistsFollowed: number[] = JSON.parse(localStorage.getItem("artistsfollowed"));
    artistsFollowed.unshift(artist.artistId);
    localStorage.setItem("artistsfollowed", JSON.stringify(artistsFollowed));
  }

  addArtistToQueue(artist: Artist) {
    this.service.get( "/artists/" + artist.artistId + "/songs").subscribe((songs) => {
      this.playerService.queueSongs(songs);
      console.log(songs);
    });
  }
}
