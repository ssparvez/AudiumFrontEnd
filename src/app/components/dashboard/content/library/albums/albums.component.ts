import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
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
export class AlbumsComponent implements OnInit {
  accountId: number;
  albums: Album[];
  mediaPath: string;
  public isPlaying;
  constructor(
    private router: Router,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.mediaPath = this.dataService.mediaURL;
    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
    this.generalService.get("/accounts/" + this.accountId + "/albums").subscribe((albums) => {
      this.albums = albums
      console.log(this.albums);
    });
  }
  updateUrl() {

  }

  viewAlbum(albumId: number) {
	console.log("album #" + albumId);
    this.router.navigate(['/dash/album/', albumId]);
  }

  playAlbumSongs(albumId: number) {
    this.generalService.get( "/albums/" + albumId + "/songs").subscribe((songs) => {
      this.playerService.loadSongs(0, songs);
    });
  }
  checkImagePaths(albumId: number): string {
    let extensions = [".jpg", ".jpeg", ".png"]
    let imageUrl = "assets/images/defaults/album.svg"
    for(let index of extensions) {
    }

    return imageUrl;
  }

  pausePlayback(albumId) {

    this.isPlaying = false;

  }

  playPlayback(albumId) {
    this.playAlbumSongs(albumId);
    this.isPlaying = true;
  }

}
