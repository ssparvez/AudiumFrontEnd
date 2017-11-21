import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';
import { PlayerService } from '../../../../../services/player/player.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})

export class AlbumComponent implements OnInit {
  imagePath = "https://s3.us-east-2.amazonaws.com/assets.audium.io/images"  
  private id;
  album: Album;

  constructor(
    private route: ActivatedRoute,
    private generalService : GeneralService,
    private playerService : PlayerService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(param => {
      this.id = + param['id'];
      console.log(this.id);
      this.generalService.get("/albums/" + this.id).subscribe((album) => {
        this.album = album;
		    this.generalService.get( "/albums/" + this.id + "/songs").subscribe((songs) => {
          this.album.songs = songs;
        });
      });
    });
  }

  playSongs(index): void {
    this.playerService.playSongs(index, this.album.songs);
  }
}