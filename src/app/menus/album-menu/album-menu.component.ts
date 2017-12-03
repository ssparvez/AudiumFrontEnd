

import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {Album} from "../../classes/Album";
import {ContextMenuComponent, ContextMenuService} from "ngx-contextmenu";
import {GeneralService} from "../../services/general/general.service";
import {MzToastService} from "ng2-materialize";
import {AppError} from "../../errors/AppError";
import { PlayerService } from "../../services/player/player.service";
@Component({
  selector: 'app-album-menu',
  templateUrl: './album-menu.component.html',
  styleUrls: ['./album-menu.component.css']
})
export class AlbumMenuComponent implements OnInit {

  @Input('albums') public albums: Album[];
  @Input('library') public library: boolean;
  @ViewChild('albumMenu') public artistMenu: ContextMenuComponent;
  public albumsSaved: number[] = JSON.parse(localStorage.getItem("albumssaved"));
  public currentUser: JSON;
  public currentAccountId: number;
  public albumMenuActions = [
    {
      html:(item) => 'Add to Queue',
      click:(item) => this.addAlbumToQueue(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Save Album',
      click:(item) => this.changeSaveStatus(item, true),
      enabled: (item) => true,
      visible: (item: Album) => !item.saved
    },
    {
      html:(item) => 'Remove Album',
      click:(item) => this.changeSaveStatus(item, false),
      enabled: (item) => true,
      visible: (item) => item.saved
    }
  ];

  constructor(private service: GeneralService,
              private playerService: PlayerService,
              private contextMenuService: ContextMenuService,
              private toastService: MzToastService) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountId = this.currentUser['_accountId'];
    }
  }

  ngOnInit() {
  }

  public onContextMenu($event: MouseEvent, item: Album): void {
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

  changeSaveStatus(album: Album, status) {
    console.log(album);
    this.service.update('/accounts/' + this.currentAccountId + '/album/'  + album.albumId + '/save/'
      + status, "")
      .subscribe(
        response => {
          if (status) {
            this.addAlbumToSaved(album);
            this.toastService.show("This album is now saved", 3000, 'blue');
          } else {
            if (this.library) {
              this.albums.splice(this.albums.indexOf(album), 1);
            }
            this.removeAlbumFromSaved(album);
            this.toastService.show("Album was removed", 3000, 'blue');
          }
        }, (error: AppError) => {
          this.toastService.show("Album save status could not be changed", 3000, 'red');
        }
      );
  }

  assignFollowStatus(album: Album): void {
    const albumSaved: number[] = JSON.parse(localStorage.getItem("albumssaved"));
    if (albumSaved.find( x => x === album.albumId) != null ) {
      album.saved = true;
    }
  }

  removeAlbumFromSaved(album: Album) {
    this.albumsSaved = JSON.parse(localStorage.getItem("albumssaved"));
    this.albumsSaved.splice(this.albumsSaved.indexOf(album.albumId),1);
    localStorage.setItem("albumssaved", JSON.stringify(this.albumsSaved));
    album.saved = false;
  }

  addAlbumToSaved(album: Album) {
    this.albumsSaved = JSON.parse(localStorage.getItem("albumssaved"));
    this.albumsSaved.unshift(album.albumId);
    localStorage.setItem("albumssaved", JSON.stringify(this.albumsSaved));
  }

  addAlbumToQueue(album: Album) {
    this.service.get( "/albums/" + album.albumId + "/songs").subscribe((songs) => {
      this.playerService.queueSongs(songs);
      console.log(songs);
    });
  }
}
