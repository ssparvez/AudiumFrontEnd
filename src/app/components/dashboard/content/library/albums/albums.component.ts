import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {
  accountId: number
  albums: Album[]
  imagePath = "https://s3.us-east-2.amazonaws.com/assets.audium.io/images"
  constructor(
    private router: Router,
    private generalService : GeneralService,
    private playerService : PlayerService
  ) { }

  ngOnInit() {
    this.accountId = JSON.parse(sessionStorage.getItem("currentUser"))._accountId;
    this.generalService.get("/accounts/" + this.accountId + "/albums").subscribe((albums) => {
      this.albums = albums
      console.log(this.albums);
    });
  }
  updateUrl() {

  }

  viewAlbum(albumId : number) {
	console.log("album #" + albumId);
    this.router.navigate(['/dash/album/', albumId]);
  }

  playAlbumSongs(albumId: number) {
    this.generalService.get( "/albums/" + albumId + "/songs").subscribe((songs) => {
      this.playerService.playSongs(0, songs);
    });
  }
  checkImagePaths(albumId: number) : string {
    let extensions = [".jpg", ".jpeg", ".png"]
    let imageUrl = "assets/images/defaults/album.svg"
    for(let index of extensions) {
    }

    return imageUrl;
  }
}
