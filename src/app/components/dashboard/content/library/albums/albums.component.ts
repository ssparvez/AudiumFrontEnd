import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';
import { environment } from '../../../../../../environments/environment';
import { animate, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[animate(300, style({opacity: 0}))]),
      transition('* => void',[animate(300, style({opacity: 0}))])
    ])
  ]
})
export class AlbumsComponent implements OnInit {
  accountId: number;
  albums: Album[];
  mediaPath: string;
  public isPlaying: boolean;
  constructor(
    private router: Router,
    private generalService: GeneralService,
  ) { }

  ngOnInit() {
    this.mediaPath = environment.mediaURL;
    let currUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(currUser != null){
      this.accountId = currUser._accountId;
    }
    if(this.accountId != null){
      this.generalService.get("/accounts/" + this.accountId + "/albums").subscribe((albums) => {
        this.albums = albums
        console.log(this.albums);
      });
    }
  }
  updateUrl() {

  }

  viewAlbum(albumId: number) {
	console.log("album #" + albumId);
    this.router.navigate(['/dash/album/', albumId]);
  }
  checkImagePaths(albumId: number): string {
    let extensions = [".jpg", ".jpeg", ".png"]
    let imageUrl = "assets/images/defaults/album.svg"
    for(let index of extensions) {
    }

    return imageUrl;
  }

  pausePlayback($event: MouseEvent, albumId) {
    this.isPlaying = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  playPlayback($event: MouseEvent, albumId) {
    this.isPlaying = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

}
