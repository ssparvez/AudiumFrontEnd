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
import {CreatePlaylistComponent} from "../../modals/create-playlist/create-playlist.component";
import { PlaybackService } from '../../services/playback/playback.service';

@Component({
  selector: 'app-playlist-menu',
  templateUrl: './playlist-menu.component.html',
  styleUrls: [],
})
export class PlaylistMenuComponent implements OnInit {
  @Input('playlists') public playlists: Playlist[];
  @Input('detailed') public detailed: boolean;
  @Input('library') public library: boolean;
  @ViewChild('ownerMenu') public ownerMenu: ContextMenuComponent;
  @ViewChild('regularMenu') public regularMenu: ContextMenuComponent;
  public playlistsFollowed: number[] = JSON.parse(localStorage.getItem("playlistsfollowed"));
  public currentUser: JSON;
  public currentAccountId: number;
  public ownerMenuActions = [
    {
      html:(item) => 'Add to Queue',
      click:(item) => this.addPlaylistToQueue(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Edit',
      click:(item) => this.openPlaylistEditForm(item),
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
      click:(item) => this.changeFollowStatus(item,true),
      enabled: (item) => true,
      visible: (item) => !(this.checkFollowStatus(item))
      //visible: (item) => (item.followed == false || item.followed == null)
    },
    {
      html:(item) => 'Unfollow playlist',
      click:(item) => this.changeFollowStatus(item,false),
      enabled: (item) => true,
      visible: (item) => this.checkFollowStatus(item)
      //visible: (item) => item.followed == true
    }
  ];

  constructor(private service: GeneralService,
              private contextMenuService: ContextMenuService,
              private dialog: MatDialog,
              private toastService: MzToastService,
              private router: Router,
              private playbackService: PlaybackService
              ) {

    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountId = this.currentUser['_accountId'];
    }
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
    if (!$event.ctrlKey) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }

  deletePlaylist(playlistToDelete) {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this playlist?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if (confirm ) {
          this.service.delete('/playlist/delete/' + this.currentUser['_accountId'] + '/' + playlistToDelete.playlistId)
            .subscribe(
              response => {
                if(this.detailed) {
                  this.router.navigate(['/dash/playlists']);
                } else {
                  this.playlists.splice(this.playlists.indexOf(playlistToDelete), 1);
                }
                this.toastService.show("Playlist was deleted", 3000, 'blue');
              }, (error: AppError) => {
                this.toastService.show("Playlist could not be deleted", 3000, 'red');
              }
            );
        }}
      );
  }

  changeVisibility(playlist) {
    const playlistToSend = { playlistId: playlist.playlistId, name:"", description: "", isPublic: !playlist.isPublic,
      creator: {accountId: this.currentUser['_accountId']}};
    this.service.update('/playlist/visibility', playlistToSend).subscribe(
      response => {
        playlist.isPublic = !playlist.isPublic;
        this.toastService.show("Playlist visibility was changed", 3000, 'blue');
      }, (error: AppError) => {
        this.toastService.show("Playlist visibility could not be changed", 3000, 'red');
      }
    );
  }


  changeFollowStatus(playlist: Playlist, status) {
    this.service.update('/accounts/' + this.currentAccountId + '/playlist/'  + playlist.playlistId + '/follow/'
      + status, "")
      .subscribe(
        response => {
          if (status) {
            this.addPlaylistToFollow(playlist);
            this.toastService.show("You are now following this playlist", 3000, 'blue');
          } else {
            this.removePlaylistFromFollowed(playlist);
            this.toastService.show("You are no longer following this playlist", 3000, 'blue');
          }
        }, (error: AppError) => {
          this.toastService.show("Playlist follow status could not be changed", 3000, 'red');
        }
      );
  }

  openPlaylistEditForm(playlist: Playlist) {
    this.dialog.open(CreatePlaylistComponent, {
      data: {
        accountId: this.currentUser['_accountId'],
        username: this.currentUser['_username'],
        playlistId: playlist.playlistId,
        isNew: false
      }, width: '600px'
    })
      .afterClosed()
      .subscribe(result => {
        if (result && result.isValid) {
          playlist.name = result.newName;
          this.toastService.show("Playlist name was changed", 3000, 'blue');
        }
      });
  }

  removePlaylistFromFollowed(playlist: Playlist) {
    this.playlistsFollowed = JSON.parse(localStorage.getItem("playlistsfollowed"));
    this.playlistsFollowed.splice(this.playlistsFollowed.indexOf(playlist.playlistId),1);
    if(this.library) {
      this.playlists.splice(this.playlists.indexOf(playlist), 1);
    }
    localStorage.setItem("playlistsfollowed", JSON.stringify(this.playlistsFollowed));
    playlist.followed = false;
  }

  addPlaylistToFollow(playlist: Playlist) {
    this.playlistsFollowed = JSON.parse(localStorage.getItem("playlistsfollowed"));
    this.playlistsFollowed.unshift(playlist.playlistId);
    localStorage.setItem("playlistsfollowed", JSON.stringify(this.playlistsFollowed));
    playlist.followed = true;
  }

  checkOwnership(playlistOwner): boolean {
    return ( this.currentAccountId === playlistOwner);
  }

  // Checks if a playlist is followed by the current user
  checkFollowStatus(playlist: Playlist): boolean {
    this.playlistsFollowed = JSON.parse(localStorage.getItem("playlistsfollowed"));
    if (this.playlistsFollowed.find( x => x === playlist.playlistId) != null ) {
      playlist.followed = true;
      return true;
    } else {
      playlist.followed = false;
      return false;
    }
  }

  setPlaylists(playlists: Playlist[]) {
    this.playlists = playlists;
  }

  addPlaylistToQueue(playlist: Playlist) {
    this.service.get( "/playlist/" + playlist.playlistId + "/songs").subscribe((songs) => {
      this.playbackService.addListToUserQueue(songs);
    });
  }

}

