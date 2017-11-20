import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ContextMenuComponent, ContextMenuService} from "ngx-contextmenu";
import {GeneralService} from "../../services/general/general.service";
import {Playlist} from "../../classes/Playlist";
import {ConfirmComponent} from "../../modals/confirm-modal/confirm.component";
import {AppError} from "../../errors/AppError";
import {MatDialog} from "@angular/material";
import {MzToastService} from "ng2-materialize";
import {Router} from "@angular/router";
import {animate, transition, trigger, style} from "@angular/animations";

@Component({
  selector: 'app-playlist-menu',
  templateUrl: './playlist-menu.component.html',
  styleUrls: ['./playlist-menu.component.css'],
})
export class PlaylistMenuComponent implements OnInit {
  @Input('playlists') public playlists: Playlist[];
  @Input('detailed') public detailed: boolean;
  @ViewChild('ownerMenu') public ownerMenu: ContextMenuComponent;
  @ViewChild('regularMenu') public regularMenu: ContextMenuComponent;
  public currentUser: JSON;
  public currentAccountId: number;
  public ownerMenuActions = [
    {
      html:(item) => 'Edit',
      click:(item) => console.log('edit'),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Make private',
      click:(item) => this.changeVisibility(item),
      enabled: (item) => true,
      visible: (item) => item.isPublic === true
    },
    {
      html:(item) => 'Make public',
      click:(item) => this.changeVisibility(item),
      enabled: (item) => true,
      visible: (item) => item.isPublic === false
    },
    {
      html:(item) => 'Delete',
      click:(item) => this.deletePlaylist(item),
      enabled:(item) => true,
      visible:(item) => true
    }
  ];
  public regularMenuActions = [
    {
      html:(item) => 'Follow playlist',
      click:(item) => console.log('edit'),
      enabled: (item) => true,
      visible: (item) => item.followed === false
    },
    {
      html:(item) => 'Unfollow playlist',
      click:(item) => console.log('edit'),
      enabled: (item) => true,
      visible: (item) => item.followed === true || item.followed == null
    }
  ];

  constructor(private service: GeneralService,
              private contextMenuService: ContextMenuService,
              private dialog: MatDialog,
              private toastService: MzToastService,
              private router: Router
              ) {

    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAccountId = this.currentUser['_accountId'];
  }

  ngOnInit() {
  }

  public onContextMenu($event: MouseEvent, item: Playlist): void {
    let contextMenu: ContextMenuComponent;
    if (this.checkOwnership(item['accountId'])) {
      contextMenu = this.ownerMenu;
    } else {
      contextMenu = this.regularMenu;
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

  deletePlaylist(playlistToDelete) {
    console.log(playlistToDelete);
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this playlist?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if (confirm ) {
          this.service.deleteResource('/playlist/delete/' + this.currentUser['_accountId'] + '/' + playlistToDelete.playlistId)
            .subscribe(
              response => {
                if(this.detailed) {
                  this.router.navigate(['/dash/playlists']);
                }
                this.toastService.show("Playlist was deleted", 3000, 'blue');
                this.playlists.splice(this.playlists.indexOf(playlistToDelete), 1);
              }, (error: AppError) => {
                this.toastService.show("Playlist could not be deleted", 3000, 'blue');
              }
            );
        }}
      );
  }

  changeVisibility(playlist) {
    const playlistToSend = { playlistId: playlist.playlistId, name:"", description: "", isPublic: !playlist.isPublic,
      creator: {accountId: this.currentUser['_accountId']}};
    console.log(playlistToSend);
    this.service.update('/playlist/visibility', playlistToSend).subscribe(
      response => {
        playlist.isPublic = !playlist.isPublic;
        this.toastService.show("Playlist visibility was changed", 3000, 'blue');
      }, (error: AppError) => {
        this.toastService.show("Playlist visibility could not be changed", 3000, 'blue');
      }
    );
  }

  checkOwnership(playlistOwner): boolean {
    return ( this.currentAccountId === playlistOwner);
  }

  setPlaylists(playlists: Playlist[]) {
    this.playlists = playlists;
  }

}

