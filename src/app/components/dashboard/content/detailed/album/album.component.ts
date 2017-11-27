import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';
import { DataService } from '../../../../../services/data.service';
import {AppError} from "../../../../../errors/AppError";
import {MzToastService} from "ng2-materialize";

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})

export class AlbumComponent implements OnInit {
  mediaPath: string;
  private id;
  album: Album;
  private currentAccountId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private playerService: PlayerService,
    private dataService: DataService,
    private toastService: MzToastService) {

    this.currentAccountId = this.currentAccountId = JSON.parse(sessionStorage.getItem("currentUser"))['_accountId'];
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0);
    });
    this.mediaPath = this.dataService.mediaURL;
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.generalService.get("/albums/" + this.id).subscribe((album) => {
        this.album = album;
        this.assignFollowStatus();
		    this.generalService.get( "/albums/" + this.id + "/songs").subscribe((songs) => {
          this.album.songs = songs;
        });
      });
    });
  }

  changeSaveStatus(status) {
    this.generalService.update('/accounts/' + this.currentAccountId + '/album/'  + this.id + '/save/'
      + status, "")
      .subscribe(
        response => {
          if (status) {
            this.album.saved = status;
            this.addAlbumToSaved();
            this.toastService.show("This album is now saved", 3000, 'blue');
          } else {
            this.removeAlbumFromSaved();
            this.toastService.show("Album was removed", 3000, 'blue');
          }
        }, (error: AppError) => {
          this.toastService.show("Album save status could not be changed", 3000, 'blue');
        }
      );
  }
  isSaved(): boolean {
    return this.album.saved;
  }
  assignFollowStatus(): void {
    const albumsSaved = JSON.parse(localStorage.getItem("albumssaved"));
    if (albumsSaved.find( x => x === this.album.albumId) != null ) {
      this.album.saved = true;
    }
  }
  removeAlbumFromSaved() {
    const albumsSaved: number[] = JSON.parse(localStorage.getItem("albumssaved"));
    albumsSaved.splice(albumsSaved.indexOf(this.album.albumId),1);
    localStorage.setItem("albumssaved", JSON.stringify(albumsSaved));
  }

  addAlbumToSaved() {
    const albumsSaved: number[] = JSON.parse(localStorage.getItem("albumssaved"));
    albumsSaved.unshift(this.album.albumId);
    localStorage.setItem("albumssaved", JSON.stringify(albumsSaved));
  }


  playSongs(index): void {
    this.playerService.loadSongs(index, this.album.songs);
  }
}
