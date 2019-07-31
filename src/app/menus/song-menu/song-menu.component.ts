import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Song} from "../../classes/Song";
import {GeneralService} from "../../services/general/general.service";
import {ContextMenuComponent, ContextMenuService} from "ngx-contextmenu";
import {MzToastService} from "ng2-materialize";
import {Playlist} from "../../classes/Playlist";
import {AppError} from "../../errors/AppError";
import {ChoosePlaylistComponent} from "../../modals/choose-playlist/choose-playlist.component";
import {MatDialog} from "@angular/material";
import { Router } from '@angular/router';
import {PlaybackService} from "../../services/playback/playback.service";

@Component({
  selector: 'app-song-menu',
  templateUrl: './song-menu.component.html',
  styleUrls: [],
})
export class SongMenuComponent implements OnInit {

  @Input('songs') public songs: Song[];
  @Input('inPlaylist') public inPlaylist: boolean;
  @Input('inMusic') public inMusic: boolean;
  @Input('currentPlaylist') public currentPlaylist: Playlist;
  @Input('playlistOwner') public playlistOwner: number;
  @ViewChild('playlistSongMenu') public playlistSongMenu: ContextMenuComponent;
  @ViewChild('outsideMenu') public outsideMenu: ContextMenuComponent;
  public currentUser: JSON;
  public currentAccountId: number;
  public playlistMenuActions = [
    {
      html:(item) => 'Add to Queue',
      click:(item) => this.addSongsToQueue(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Add to Playlist',
      click:(item) => this.openPlaylistChoices(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Save to Your Music',
      click:(item) => this.saveSongToMusic(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Remove from this Playlist',
      click:(item) => this.removeSongFromPlaylist(item),
      enabled: (item) => true,
      visible: (item) => this.checkOwnership()
    },
    {
      html:(item) => 'Show Lyrics',
      click:(item) => this.viewLyrics(item),
      enabled: (item) => true,
      visible: (item) => true
    },
  ];
  public outsideMenuActions = [
    {
      html:(item) => 'Add to Queue',
      click:(item) => this.addSongsToQueue(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Add to Playlist',
      click:(item) => this.openPlaylistChoices(item),
      enabled: (item) => true,
      visible: (item) => true
    },
    {
      html:(item) => 'Save to Your Music',
      click:(item) => this.saveSongToMusic(item),
      enabled: (item) => true,
      visible: (item) => !this.inMusic
    },
    {
      html:(item) => 'Remove from Your Music',
      click:(item) => this.removeSongFromMusic(item),
      enabled: (item: Song) => true,
      visible: (item) => this.inMusic
    },
    {
      html:(item) => 'Show Lyrics',
      click:(item) => this.viewLyrics(item),
      enabled: (item) => true,
      visible: (item) => true
    },
  ];

  constructor(private service: GeneralService,
              private contextMenuService: ContextMenuService,
              private dialog: MatDialog,
              private toastService: MzToastService,
              private playbackService: PlaybackService,
              private router: Router) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAccountId = this.currentUser['_accountId'];
    }
  }

  ngOnInit() {
  }

  public onContextMenu($event: MouseEvent, item: Song): void {
    let contextMenu: ContextMenuComponent;
    if (this.inPlaylist) {
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
    if (!$event.ctrlKey) {
      $event.preventDefault();
      $event.stopPropagation();
    }
  }


  public removeSongFromPlaylist(songToRemove: Song) {
    console.log(songToRemove.songId);
   this.service.delete('/accounts/' + this.currentAccountId + '/playlist/' + this.currentPlaylist +
     '/remove/song/' + songToRemove.songId).subscribe(
       response => {
         this.toastService.show("Song was removed from your playlist", 3000, 'blue');
         this.playbackService.removeSongFromQueue(songToRemove);
         this.songs.splice(this.songs.indexOf(songToRemove),1);
       }, (error: AppError) => {
         this.toastService.show("Song could not be removed", 3000, 'red');
       }
     );

  }

  openPlaylistChoices(song: Song) {
    this.dialog.open(ChoosePlaylistComponent, {
      data: {
        accountId: this.currentAccountId,
        songId: song.songId
      }, width: '1400px'
    }).afterClosed()
      .subscribe(
        result => {
          if (result) {
            this.toastService.show("Song was added to your playlist", 3000, 'blue');
          } else {
          }
        });
  }

  saveSongToMusic(songToSave: Song) {
    this.service.post('/accounts/' + this.currentAccountId + '/song/' + songToSave.songId + "/save", null)
      .subscribe(
        response => {
          if (response) {
            this.toastService.show("Song was saved to your music", 3000, 'blue');
          } else {
            this.toastService.show("Song is already saved", 3000, 'blue');
          }

        }, (error: AppError) => {
          this.toastService.show("Song could not be saved", 3000, 'red');
        });
  }

  removeSongFromMusic(songToRemove: Song) {
    if (this.inMusic) {
      this.service.delete('/accounts/' + this.currentAccountId + '/song/' + songToRemove.songId + "/remove").subscribe(
        response => {
          this.toastService.show("Song was removed from your music", 3000, 'blue');
          this.playbackService.removeSongFromQueue(songToRemove);
          this.songs.splice(this.songs.indexOf(songToRemove), 1);
        },(error: AppError) => {
          this.toastService.show("Song could not be removed", 3000, 'red');
        }
      );
    }
  }

  addSongsToQueue(song: Song) {
    this.playbackService.addToUserQueue(song);
  }

  viewLyrics(song: Song) {
    this.router.navigate(['dash/song', song.songId, 'lyrics'])
  }


  checkOwnership() {
    return (this.currentAccountId === this.playlistOwner);
  }
}
