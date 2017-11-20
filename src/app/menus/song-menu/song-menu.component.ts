import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Song} from "../../classes/Song";
import {GeneralService} from "../../services/general/general.service";
import {ContextMenuComponent, ContextMenuService} from "ngx-contextmenu";
import {MzToastService} from "ng2-materialize";
import {Playlist} from "../../classes/Playlist";
import {AppError} from "../../errors/AppError";

@Component({
  selector: 'app-song-menu',
  templateUrl: './song-menu.component.html',
  styleUrls: ['./song-menu.component.css'],
})
export class SongMenuComponent implements OnInit {

  @Input('songs') public songs: Song[];
  @Input('detailed') public detailed: boolean;
  @Input('currentPlaylist') public currentPlaylist: Playlist;
  @Input('playlistOwner') public playlistOwner: number;
  @ViewChild('playlistSongMenu') public playlistSongMenu: ContextMenuComponent;
  @ViewChild('outsideMenu') public outsideMenu: ContextMenuComponent;
  public currentUser: JSON;
  public currentAccountId: number;
  public playlistMenuActions = [
    {
      html:(item) => 'Remove from playlist',
      click:(item) => this.removeSongFromPlaylist(item),
      enabled: (item) => true,
      visible: (item) => this.detailed === true && this.checkOwnership()
    },
  ];
  public regularMenuActions = [
    {
      html:(item) => 'Add to playlist',
      click:(item) => console.log('edit'),
      enabled: (item) => true,
      visible: (item) => this.detailed === false
    },
  ];

  constructor(private service: GeneralService,
              private contextMenuService: ContextMenuService,
              private toastService: MzToastService,) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountId = this.currentUser['_accountId'];
  }

  ngOnInit() {
  }

  public onContextMenu($event: MouseEvent, item: Song): void {
    let contextMenu: ContextMenuComponent;
    if (this.detailed) {
      contextMenu = this.playlistSongMenu;
    } else {
      contextMenu = this.outsideMenu;
    }
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: contextMenu,
      event: $event,
      item: item,
    });
    $event.preventDefault();
    $event.stopPropagation();
  }


  public removeSongFromPlaylist(songToRemove: Song) {
   this.service.deleteResource('/account/' + this.currentAccountId + '/playlist/' + this.currentPlaylist +
     '/remove/song/' + songToRemove.songId)
     .subscribe(
       response => {
         this.toastService.show("Song was removed from your playlist", 3000, 'blue');
         this.songs.splice(this.songs.indexOf(songToRemove),1);
       }, (error: AppError) => {
         this.toastService.show("Song could not be removed", 3000, 'blue');
       }
     );

  }

  checkOwnership() {
    return (this.currentAccountId === this.playlistOwner);
  }
}
