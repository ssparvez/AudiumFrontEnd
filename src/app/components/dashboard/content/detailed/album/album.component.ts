import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})

export class AlbumComponent implements OnInit {

  private id;
  album: Album;

  constructor(
    private route: ActivatedRoute,
    private generalService : GeneralService
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
}